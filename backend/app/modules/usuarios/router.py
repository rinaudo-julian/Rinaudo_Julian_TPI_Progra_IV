from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.database import session_factory
from app.core.deps import AdminDep
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.service import (
    AutoDesactivacion,
    UsuarioNoEncontrado,
    UsuarioService,
)
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

router = APIRouter(prefix="/admin/usuarios", tags=["Usuarios"])


def get_usuario_service() -> UsuarioService:
    return UsuarioService(UsuarioUnitOfWork(session_factory))


UsuarioServiceDep = Annotated[UsuarioService, Depends(get_usuario_service)]


def _usuario_no_encontrado() -> HTTPException:
    return HTTPException(status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")


@router.get("", response_model=list[UserPublic])
def listar_usuarios(administrador: AdminDep, service: UsuarioServiceDep):
    return service.listar()


@router.post("/{id}/activar", response_model=UserPublic)
def activar_usuario(id: int, administrador: AdminDep, service: UsuarioServiceDep):
    try:
        return service.activar(id)
    except UsuarioNoEncontrado as error:
        raise _usuario_no_encontrado() from error


@router.post("/{id}/desactivar", response_model=UserPublic)
def desactivar_usuario(
    id: int, administrador: AdminDep, service: UsuarioServiceDep
):
    try:
        return service.desactivar(id, administrador)
    except UsuarioNoEncontrado as error:
        raise _usuario_no_encontrado() from error
    except AutoDesactivacion as error:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail="No podés desactivar tu propia cuenta",
        ) from error
