from fastapi import HTTPException, status

from app.core.security import create_access_token, hash_password, verify_password
from app.modules.usuarios.models import ROL_USER, Usuario
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class AuthService:
    def __init__(self, uow: UsuarioUnitOfWork) -> None:
        self.uow = uow

    def registrar(self, data: UserCreate) -> UserPublic:
        with self.uow as uow:
            if uow.usuarios.get_by_username(data.username) is not None:
                raise HTTPException(
                    status.HTTP_409_CONFLICT,
                    detail="El nombre de usuario ya está registrado",
                )
            if uow.usuarios.get_by_email(data.email) is not None:
                raise HTTPException(
                    status.HTTP_409_CONFLICT, detail="El email ya está registrado"
                )
            usuario = uow.usuarios.add(
                Usuario(
                    username=data.username,
                    full_name=data.full_name,
                    email=data.email,
                    hashed_password=hash_password(data.password),
                    role=ROL_USER,
                )
            )
            return UserPublic.model_validate(usuario)

    def login(self, username: str, password: str) -> str:
        with self.uow as uow:
            usuario = uow.usuarios.get_by_username(username)
            if usuario is None or not verify_password(
                password, usuario.hashed_password
            ):
                raise HTTPException(
                    status.HTTP_401_UNAUTHORIZED,
                    detail="Credenciales incorrectas",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            if usuario.disabled:
                raise HTTPException(
                    status.HTTP_400_BAD_REQUEST,
                    detail="Cuenta de usuario desactivada",
                )
            return create_access_token(
                data={"sub": usuario.username, "role": usuario.role}
            )
