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


def _no_encontrada() -> HTTPException:
    return HTTPException(status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")


def _duplicada() -> HTTPException:
    return HTTPException(
        status.HTTP_409_CONFLICT, detail="Ya existe una categoría con ese nombre"
    )


@router.get("", response_model=list[CategoriaRead])
def listar_categorias(service: CategoriaService = Depends(get_categoria_service)):
    return service.listar()


@router.get("/{id}", response_model=CategoriaRead)
def obtener_categoria(
    id: int, service: CategoriaService = Depends(get_categoria_service)
):
    try:
        return service.obtener(id)
    except CategoriaNoEncontrada:
        raise _no_encontrada()


@router.post("", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED)
def crear_categoria(
    data: CategoriaCreate, service: CategoriaService = Depends(get_categoria_service)
):
    try:
        return service.crear(data)
    except NombreDuplicado:
        raise _duplicada()


@router.put("/{id}", response_model=CategoriaRead)
def actualizar_categoria(
    id: int,
    data: CategoriaUpdate,
    service: CategoriaService = Depends(get_categoria_service),
):
    try:
        return service.actualizar(id, data)
    except CategoriaNoEncontrada:
        raise _no_encontrada()
    except NombreDuplicado:
        raise _duplicada()


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(
    id: int, service: CategoriaService = Depends(get_categoria_service)
) -> None:
    try:
        service.eliminar(id)
    except CategoriaNoEncontrada:
        raise _no_encontrada()
