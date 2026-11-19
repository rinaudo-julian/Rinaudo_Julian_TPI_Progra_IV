from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.database import session_factory
from app.core.deps import AdminDep
from app.modules.categorias.service import CategoriaNoEncontrada
from app.modules.productos.schemas import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoStockUpdate,
    ProductoUpdate,
)
from app.modules.productos.service import ProductoNoEncontrado, ProductoService
from app.modules.productos.unit_of_work import ProductoUnitOfWork

router = APIRouter(prefix="/productos", tags=["Productos"])


def get_producto_service() -> ProductoService:
    return ProductoService(ProductoUnitOfWork(session_factory))


ProductoServiceDep = Annotated[ProductoService, Depends(get_producto_service)]


def _producto_no_encontrado() -> HTTPException:
    return HTTPException(status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")


def _categoria_no_encontrada() -> HTTPException:
    return HTTPException(status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")


@router.get("", response_model=ProductosPaginados)
def listar_productos(
    service: ProductoServiceDep,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    search: str | None = None,
    categoria_id: int | None = None,
    disponible: bool | None = None,
):
    return service.listar(skip, limit, search, categoria_id, disponible)


@router.get("/{id}", response_model=ProductoRead)
def obtener_producto(id: int, service: ProductoServiceDep):
    try:
        return service.obtener(id)
    except ProductoNoEncontrado as error:
        raise _producto_no_encontrado() from error


@router.post("", response_model=ProductoRead, status_code=status.HTTP_201_CREATED)
def crear_producto(
    data: ProductoCreate, administrador: AdminDep, service: ProductoServiceDep
):
    try:
        return service.crear(data)
    except CategoriaNoEncontrada as error:
        raise _categoria_no_encontrada() from error


@router.put("/{id}", response_model=ProductoRead)
def actualizar_producto(
    id: int,
    data: ProductoUpdate,
    administrador: AdminDep,
    service: ProductoServiceDep,
):
    try:
        return service.actualizar(id, data)
    except ProductoNoEncontrado as error:
        raise _producto_no_encontrado() from error
    except CategoriaNoEncontrada as error:
        raise _categoria_no_encontrada() from error


@router.patch("/{id}/stock", response_model=ProductoRead)
def actualizar_stock_producto(
    id: int,
    data: ProductoStockUpdate,
    administrador: AdminDep,
    service: ProductoServiceDep,
):
    try:
        return service.actualizar_stock(id, data)
    except ProductoNoEncontrado as error:
        raise _producto_no_encontrado() from error


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(
    id: int, administrador: AdminDep, service: ProductoServiceDep
) -> None:
    try:
        service.eliminar(id)
    except ProductoNoEncontrado as error:
        raise _producto_no_encontrado() from error
