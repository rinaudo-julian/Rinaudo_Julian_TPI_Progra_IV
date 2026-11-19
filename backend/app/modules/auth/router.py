from typing import Annotated

from fastapi import APIRouter, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm

from app.core.config import settings
from app.core.database import session_factory
from app.core.deps import NOMBRE_COOKIE_TOKEN
from app.modules.auth.schemas import MensajeRespuesta
from app.modules.auth.service import AuthService
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

router = APIRouter(prefix="/auth", tags=["Auth"])


def get_auth_service() -> AuthService:
    return AuthService(UsuarioUnitOfWork(session_factory))


AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]
FormularioLoginDep = Annotated[OAuth2PasswordRequestForm, Depends()]


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
