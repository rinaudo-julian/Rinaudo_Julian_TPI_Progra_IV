from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.config import settings
from app.core.database import session_factory
from app.core.deps import NOMBRE_COOKIE_TOKEN, UsuarioActualDep
from app.modules.auth.schemas import MensajeRespuesta
from app.modules.auth.service import AuthService
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

router = APIRouter(prefix="/auth", tags=["Auth"])


def get_auth_service() -> AuthService:
    return AuthService(UsuarioUnitOfWork(session_factory))


AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]
FormularioLoginDep = Annotated[OAuth2PasswordRequestForm, Depends()]


@router.post(
    "/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED
)
def registrar(data: UserCreate, service: AuthServiceDep):
    return service.registrar(data)


@router.post("/token", response_model=MensajeRespuesta)
def login(
    formulario: FormularioLoginDep, response: Response, service: AuthServiceDep
):
    token = service.login(formulario.username, formulario.password)
    response.set_cookie(
        key=NOMBRE_COOKIE_TOKEN,
        value=token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=False,
    )
    return MensajeRespuesta(message="Login exitoso")


@router.post("/logout", response_model=MensajeRespuesta)
def logout(response: Response):
    response.delete_cookie(
        key=NOMBRE_COOKIE_TOKEN, httponly=True, samesite="lax", secure=False
    )
    return MensajeRespuesta(message="Sesión cerrada")


@router.get("/me", response_model=UserPublic)
def obtener_usuario_actual(usuario: UsuarioActualDep):
    return usuario
