from collections.abc import Callable
from typing import Annotated

from fastapi import Depends, Header, HTTPException, status

from app.core.database import session_factory
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


# TEMPORAL: identifica al usuario con el header X-Usuario-Id hasta implementar auth.
# Reemplazar por get_current_active_user (cookie HttpOnly con JWT).
def get_usuario_actual(
    x_usuario_id: Annotated[int | None, Header()] = None,
) -> UserPublic:
    if x_usuario_id is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="No autenticado")
    with UsuarioUnitOfWork(session_factory) as uow:
        usuario = uow.usuarios.get_by_id(x_usuario_id)
        if usuario is None:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="No autenticado")
        if usuario.disabled:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST, detail="Cuenta de usuario desactivada"
            )
        return UserPublic.model_validate(usuario)


UsuarioActualDep = Annotated[UserPublic, Depends(get_usuario_actual)]


def require_role(roles_permitidos: list[str]) -> Callable[[UserPublic], UserPublic]:
    def verificar_rol(usuario: UsuarioActualDep) -> UserPublic:
        if usuario.role not in roles_permitidos:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                detail="No tiene permisos para realizar esta operación",
            )
        return usuario

    return verificar_rol
