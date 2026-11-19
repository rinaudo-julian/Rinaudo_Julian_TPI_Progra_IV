from collections.abc import Callable
from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer

from app.core.database import session_factory
from app.core.security import decode_access_token
from app.modules.usuarios.models import ROL_ADMIN
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

NOMBRE_COOKIE_TOKEN = "access_token"


class OAuth2PasswordBearerWithCookie(OAuth2PasswordBearer):
    async def __call__(self, request: Request) -> str | None:
        token = request.cookies.get(NOMBRE_COOKIE_TOKEN)
        if not token:
            if self.auto_error:
                raise HTTPException(
                    status.HTTP_401_UNAUTHORIZED,
                    detail="No autenticado",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            return None
        return token


oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="/api/v1/auth/token")


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> UserPublic:
    error_credenciales = HTTPException(
        status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales inválidas o token expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise error_credenciales
    username = payload.get("sub")
    if username is None:
        raise error_credenciales
    with UsuarioUnitOfWork(session_factory) as uow:
        usuario = uow.usuarios.get_by_username(username)
        if usuario is None:
            raise error_credenciales
        return UserPublic.model_validate(usuario)


def get_current_active_user(
    usuario: Annotated[UserPublic, Depends(get_current_user)],
) -> UserPublic:
    if usuario.disabled:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, detail="Cuenta de usuario desactivada"
        )
    return usuario


UsuarioActualDep = Annotated[UserPublic, Depends(get_current_active_user)]


def require_role(roles_permitidos: list[str]) -> Callable[[UserPublic], UserPublic]:
    def verificar_rol(usuario: UsuarioActualDep) -> UserPublic:
        if usuario.role not in roles_permitidos:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                detail="No tiene permisos para realizar esta operación",
            )
        return usuario

    return verificar_rol


AdminDep = Annotated[UserPublic, Depends(require_role([ROL_ADMIN]))]
