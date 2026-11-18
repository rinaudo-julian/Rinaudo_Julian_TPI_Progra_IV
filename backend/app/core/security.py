from passlib.context import CryptContext

contexto_hash = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return contexto_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return contexto_hash.verify(password, hashed_password)
