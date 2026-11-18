from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.database import session_factory
from app.modules.categorias.schemas import (
    CategoriaCreate,
    CategoriaRead,
    CategoriaUpdate,
)
from app.modules.categorias.service import (
    CategoriaNoEncontrada,
    CategoriaService,
    NombreDuplicado,
)
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork

router = APIRouter(prefix="/categorias", tags=["Categorías"])


def get_categoria_service() -> CategoriaService:
    return CategoriaService(CategoriaUnitOfWork(session_factory))


CategoriaServiceDep = Annotated[CategoriaService, Depends(get_categoria_service)]


def _no_encontrada() -> HTTPException:
    return HTTPException(status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")


def _duplicada() -> HTTPException:
    return HTTPException(
        status.HTTP_409_CONFLICT, detail="Ya existe una categoría con ese nombre"
    )


@router.get("", response_model=list[CategoriaRead])
def listar_categorias(service: CategoriaServiceDep):
    return service.listar()


@router.get("/{id}", response_model=CategoriaRead)
def obtener_categoria(id: int, service: CategoriaServiceDep):
    try:
        return service.obtener(id)
    except CategoriaNoEncontrada as error:
        raise _no_encontrada() from error


@router.post("", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED)
def crear_categoria(data: CategoriaCreate, service: CategoriaServiceDep):
    try:
        return service.crear(data)
    except NombreDuplicado as error:
        raise _duplicada() from error


@router.put("/{id}", response_model=CategoriaRead)
def actualizar_categoria(id: int, data: CategoriaUpdate, service: CategoriaServiceDep):
    try:
        return service.actualizar(id, data)
    except CategoriaNoEncontrada as error:
        raise _no_encontrada() from error
    except NombreDuplicado as error:
        raise _duplicada() from error


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(id: int, service: CategoriaServiceDep) -> None:
    try:
        service.eliminar(id)
    except CategoriaNoEncontrada as error:
        raise _no_encontrada() from error
