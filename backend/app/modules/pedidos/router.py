from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.database import session_factory
from app.core.deps import AdminDep, UsuarioActualDep
from app.modules.pedidos.models import EstadoPedido
from app.modules.pedidos.schemas import (
    CambioEstado,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from app.modules.pedidos.service import (
    PedidoAjeno,
    PedidoNoEncontrado,
    PedidoService,
    ReglaDeNegocioInvalida,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.productos.service import ProductoNoEncontrado

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


def get_pedido_service() -> PedidoService:
    return PedidoService(PedidoUnitOfWork(session_factory))


PedidoServiceDep = Annotated[PedidoService, Depends(get_pedido_service)]


def _pedido_no_encontrado() -> HTTPException:
    return HTTPException(status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")


def _pedido_ajeno() -> HTTPException:
    return HTTPException(
        status.HTTP_403_FORBIDDEN, detail="El pedido pertenece a otro usuario"
    )


def _producto_no_encontrado() -> HTTPException:
    return HTTPException(status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")


def _regla_invalida(error: ReglaDeNegocioInvalida) -> HTTPException:
    return HTTPException(status.HTTP_400_BAD_REQUEST, detail=str(error))


@router.post("", response_model=PedidoRead, status_code=status.HTTP_201_CREATED)
def crear_pedido(
    data: PedidoCreate, usuario: UsuarioActualDep, service: PedidoServiceDep
):
    try:
        return service.crear(usuario, data)
    except ProductoNoEncontrado as error:
        raise _producto_no_encontrado() from error
    except ReglaDeNegocioInvalida as error:
        raise _regla_invalida(error) from error


@router.get("", response_model=PedidosPaginados)
def listar_pedidos(
    usuario: UsuarioActualDep,
    service: PedidoServiceDep,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    estado: EstadoPedido | None = None,
):
    return service.listar(usuario, skip, limit, estado)


@router.get("/resumen", response_model=ResumenPedidos)
def resumen_pedidos(administrador: AdminDep, service: PedidoServiceDep):
    return service.resumen()


@router.get("/{id}", response_model=PedidoRead)
def obtener_pedido(id: int, usuario: UsuarioActualDep, service: PedidoServiceDep):
    try:
        return service.obtener(usuario, id)
    except PedidoNoEncontrado as error:
        raise _pedido_no_encontrado() from error
    except PedidoAjeno as error:
        raise _pedido_ajeno() from error


@router.patch("/{id}/estado", response_model=PedidoRead)
def cambiar_estado_pedido(
    id: int,
    data: CambioEstado,
    administrador: AdminDep,
    service: PedidoServiceDep,
):
    try:
        return service.cambiar_estado(id, data.estado)
    except PedidoNoEncontrado as error:
        raise _pedido_no_encontrado() from error
    except ReglaDeNegocioInvalida as error:
        raise _regla_invalida(error) from error


@router.patch("/{id}/cancelar", response_model=PedidoRead)
def cancelar_pedido(id: int, usuario: UsuarioActualDep, service: PedidoServiceDep):
    try:
        return service.cancelar(usuario, id)
    except PedidoNoEncontrado as error:
        raise _pedido_no_encontrado() from error
    except PedidoAjeno as error:
        raise _pedido_ajeno() from error
    except ReglaDeNegocioInvalida as error:
        raise _regla_invalida(error) from error
