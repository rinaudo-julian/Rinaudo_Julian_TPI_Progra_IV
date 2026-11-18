from typing import Any

from app.modules.categorias.service import CategoriaNoEncontrada
from app.modules.productos.models import Producto
from app.modules.productos.schemas import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoStockUpdate,
    ProductoUpdate,
)
from app.modules.productos.unit_of_work import ProductoUnitOfWork

CAMPOS_OBLIGATORIOS = {"nombre", "precio_base", "stock", "disponible", "categoria_id"}


class ProductoNoEncontrado(Exception):
    pass


class ProductoService:
    def __init__(self, uow: ProductoUnitOfWork) -> None:
        self.uow = uow

    def listar(
        self,
        skip: int,
        limit: int,
        search: str | None,
        categoria_id: int | None,
        disponible: bool | None,
    ) -> ProductosPaginados:
        with self.uow as uow:
            total, productos = uow.productos.search(
                skip, limit, search, categoria_id, disponible
            )
            return ProductosPaginados(
                total=total,
                items=[ProductoRead.model_validate(producto) for producto in productos],
            )

    def obtener(self, id: int) -> ProductoRead:
        with self.uow as uow:
            producto = self._get_activo(uow, id)
            return ProductoRead.model_validate(producto)

    def crear(self, data: ProductoCreate) -> ProductoRead:
        with self.uow as uow:
            self._validar_categoria(uow, data.categoria_id)
            producto = uow.productos.add(Producto.model_validate(data))
            return ProductoRead.model_validate(producto)

    def actualizar(self, id: int, data: ProductoUpdate) -> ProductoRead:
        with self.uow as uow:
            producto = self._get_activo(uow, id)
            cambios = self._cambios_enviados(data.model_dump(exclude_unset=True))

            if "categoria_id" in cambios:
                self._validar_categoria(uow, cambios["categoria_id"])

            for campo, valor in cambios.items():
                setattr(producto, campo, valor)
            producto = uow.productos.add(producto)
            return ProductoRead.model_validate(producto)

    def actualizar_stock(self, id: int, data: ProductoStockUpdate) -> ProductoRead:
        with self.uow as uow:
            producto = self._get_activo(uow, id)
            cambios = self._cambios_enviados(data.model_dump(exclude_unset=True))

            for campo, valor in cambios.items():
                setattr(producto, campo, valor)
            producto = uow.productos.add(producto)
            return ProductoRead.model_validate(producto)

    def eliminar(self, id: int) -> None:
        with self.uow as uow:
            producto = self._get_activo(uow, id)
            producto.activo = False
            uow.productos.add(producto)

    @staticmethod
    def _cambios_enviados(cambios: dict[str, Any]) -> dict[str, Any]:
        return {
            campo: valor
            for campo, valor in cambios.items()
            if not (campo in CAMPOS_OBLIGATORIOS and valor is None)
        }

    @staticmethod
    def _get_activo(uow: ProductoUnitOfWork, id: int) -> Producto:
        producto = uow.productos.get_by_id(id)
        if producto is None or not producto.activo:
            raise ProductoNoEncontrado(id)
        return producto

    @staticmethod
    def _validar_categoria(uow: ProductoUnitOfWork, categoria_id: int) -> None:
        categoria = uow.categorias.get_by_id(categoria_id)
        if categoria is None or not categoria.activo:
            raise CategoriaNoEncontrada(categoria_id)
