from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.usuarios.models import Usuario


class UsuarioRepository(BaseRepository[Usuario]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Usuario)

    def get_by_username(self, username: str) -> Usuario | None:
        consulta = select(Usuario).where(Usuario.username == username)
        return self.session.exec(consulta).first()

    def get_by_email(self, email: str) -> Usuario | None:
        consulta = select(Usuario).where(Usuario.email == email)
        return self.session.exec(consulta).first()
