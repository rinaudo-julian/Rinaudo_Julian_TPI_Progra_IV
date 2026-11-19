from datetime import UTC, datetime, timedelta
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

TIPO_TOKEN_ACCESO = "access"

contexto_hash = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return contexto_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return contexto_hash.verify(password, hashed_password)


def create_access_token(
    data: dict[str, Any], expires_delta: timedelta | None = None
) -> str:
    datos_a_codificar = data.copy()
    expiracion = datetime.now(UTC) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    datos_a_codificar.update({"type": TIPO_TOKEN_ACCESO, "exp": expiracion})
    return jwt.encode(
        datos_a_codificar, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )


def decode_access_token(token: str) -> dict[str, Any] | None:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
    except JWTError:
        return None
    if payload.get("type") != TIPO_TOKEN_ACCESO:
        return None
    return payload
