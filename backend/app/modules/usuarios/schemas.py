from datetime import datetime
from typing import Annotated

from pydantic import EmailStr, StringConstraints, field_validator
from sqlmodel import SQLModel

LARGO_MAXIMO_PASSWORD_BYTES = 72

Username = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=3, max_length=50)
]
NombreCompleto = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)
]
Password = Annotated[str, StringConstraints(min_length=8, max_length=72)]


class UserCreate(SQLModel):
    username: Username
    full_name: NombreCompleto
    email: EmailStr
    password: Password

    @field_validator("password")
    @classmethod
    def validar_largo_en_bytes(cls, password: str) -> str:
        if len(password.encode("utf-8")) > LARGO_MAXIMO_PASSWORD_BYTES:
            raise ValueError(
                f"La contraseña no puede superar los {LARGO_MAXIMO_PASSWORD_BYTES} bytes"
            )
        return password


class UserPublic(SQLModel):
    id: int
    username: str
    full_name: str
    email: str
    role: str
    disabled: bool
    created_at: datetime
