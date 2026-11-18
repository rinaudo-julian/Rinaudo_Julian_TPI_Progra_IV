from datetime import UTC, datetime

from app.modules.pedidos.models import DetallePedido, EstadoPedido, Pedido
from app.modules.pedidos.schemas import (
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.productos.service import ProductoNoEncontrado
from app.modules.usuarios.models import ROL_ADMIN
from app.modules.usuarios.schemas import UserPublic

TRANSICIONES: dict[EstadoPedido, set[EstadoPedido]] = {
    EstadoPedido.PENDIENTE: {EstadoPedido.EN_PREPARACION, EstadoPedido.CANCELADO},
    EstadoPedido.EN_PREPARACION: {EstadoPedido.ENTREGADO, EstadoPedido.CANCELADO},
    EstadoPedido.ENTREGADO: set(),
    EstadoPedido.CANCELADO: set(),
}


class PedidoNoEncontrado(Exception):
    pass


class PedidoAjeno(Exception):
    pass


class ReglaDeNegocioInvalida(Exception):
    pass


class ProductoRepetido(ReglaDeNegocioInvalida):
    pass


class ProductoNoDisponible(ReglaDeNegocioInvalida):
    pass


class StockInsuficiente(ReglaDeNegocioInvalida):
    pass


class TransicionInvalida(ReglaDeNegocioInvalida):
    pass


class PedidoNoCancelable(ReglaDeNegocioInvalida):
    pass


class PedidoService:
    def __init__(self, uow: PedidoUnitOfWork) -> None:
        self.uow = uow

    def crear(self, usuario: UserPublic, data: PedidoCreate) -> PedidoRead:
        with self.uow as uow:
            productos_pedidos = [item.producto_id for item in data.items]
            if len(productos_pedidos) != len(set(productos_pedidos)):
                raise ProductoRepetido("Hay productos repetidos en el pedido")

            pedido = uow.pedidos.add(
                Pedido(
                    usuario_id=usuario.id,
                    forma_pago=data.forma_pago,
                    direccion_entrega=data.direccion_entrega,
                    notas=data.notas,
                    total=0,
                )
            )

            total = 0.0
            for item in data.items:
                producto = uow.productos.get_by_id(item.producto_id)
                if producto is None or not producto.activo:
                    raise ProductoNoEncontrado(item.producto_id)
                if not producto.disponible:
                    raise ProductoNoDisponible(
                        f"El producto '{producto.nombre}' no está disponible"
                    )
                if producto.stock < item.cantidad:
                    raise StockInsuficiente(
                        f"Stock insuficiente para '{producto.nombre}' "
                        f"(disponible: {producto.stock})"
                    )

                producto.stock -= item.cantidad
                subtotal = round(producto.precio_base * item.cantidad, 2)
                pedido.items.append(
                    DetallePedido(
                        producto_id=item.producto_id,
                        cantidad=item.cantidad,
                        nombre_producto=producto.nombre,
                        precio_unitario=producto.precio_base,
                        subtotal=subtotal,
                    )
                )
                total += subtotal

            pedido.total = round(total, 2)
            pedido = uow.pedidos.add(pedido)
            return PedidoRead.model_validate(pedido)

    def listar(
        self,
        usuario: UserPublic,
        skip: int,
        limit: int,
        estado: EstadoPedido | None,
    ) -> PedidosPaginados:
        with self.uow as uow:
            usuario_id = None if self._es_admin(usuario) else usuario.id
            total, pedidos = uow.pedidos.list_by_usuario(usuario_id, estado, skip, limit)
            return PedidosPaginados(
                total=total,
                items=[PedidoRead.model_validate(pedido) for pedido in pedidos],
            )

    def obtener(self, usuario: UserPublic, id: int) -> PedidoRead:
        with self.uow as uow:
            pedido = self._get_pedido(uow, id)
            if not self._es_admin(usuario) and pedido.usuario_id != usuario.id:
                raise PedidoAjeno(id)
            return PedidoRead.model_validate(pedido)

    def cambiar_estado(self, id: int, nuevo_estado: EstadoPedido) -> PedidoRead:
        with self.uow as uow:
            pedido = self._get_pedido(uow, id)
            estado_actual = EstadoPedido(pedido.estado)
            if nuevo_estado not in TRANSICIONES[estado_actual]:
                raise TransicionInvalida(
                    f"No se puede pasar de {estado_actual} a {nuevo_estado}"
                )

            if nuevo_estado == EstadoPedido.CANCELADO:
                self._restituir_stock(pedido)
            pedido.estado = nuevo_estado
            pedido.updated_at = datetime.now(UTC)
            pedido = uow.pedidos.add(pedido)
            return PedidoRead.model_validate(pedido)

    def cancelar(self, usuario: UserPublic, id: int) -> PedidoRead:
        with self.uow as uow:
            pedido = self._get_pedido(uow, id)
            if pedido.usuario_id != usuario.id:
                raise PedidoAjeno(id)
            if pedido.estado != EstadoPedido.PENDIENTE:
                raise PedidoNoCancelable(
                    "Solo se puede cancelar un pedido en estado PENDIENTE"
                )

            self._restituir_stock(pedido)
            pedido.estado = EstadoPedido.CANCELADO
            pedido.updated_at = datetime.now(UTC)
            pedido = uow.pedidos.add(pedido)
            return PedidoRead.model_validate(pedido)

    def resumen(self) -> ResumenPedidos:
        with self.uow as uow:
            cantidades = uow.pedidos.count_by_estado()
            inicio_del_dia = datetime.now().astimezone().replace(
                hour=0, minute=0, second=0, microsecond=0
            )
            return ResumenPedidos(
                pendientes=cantidades.get(EstadoPedido.PENDIENTE, 0),
                en_preparacion=cantidades.get(EstadoPedido.EN_PREPARACION, 0),
                entregados=cantidades.get(EstadoPedido.ENTREGADO, 0),
                cancelados=cantidades.get(EstadoPedido.CANCELADO, 0),
                pedidos_hoy=uow.pedidos.count_desde(inicio_del_dia),
                ingresos_entregados=uow.pedidos.sum_total_by_estado(
                    EstadoPedido.ENTREGADO
                ),
            )

    @staticmethod
    def _restituir_stock(pedido: Pedido) -> None:
        for detalle in pedido.items:
            detalle.producto.stock += detalle.cantidad

    @staticmethod
    def _es_admin(usuario: UserPublic) -> bool:
        return usuario.role == ROL_ADMIN

    @staticmethod
    def _get_pedido(uow: PedidoUnitOfWork, id: int) -> Pedido:
        pedido = uow.pedidos.get_by_id(id)
        if pedido is None:
            raise PedidoNoEncontrado(id)
        return pedido
