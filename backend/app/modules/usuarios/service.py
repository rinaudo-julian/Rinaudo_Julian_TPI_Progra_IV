from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class UsuarioNoEncontrado(Exception):
    pass


class AutoDesactivacion(Exception):
    pass


class UsuarioService:
    def __init__(self, uow: UsuarioUnitOfWork) -> None:
        self.uow = uow

    def listar(self) -> list[UserPublic]:
        with self.uow as uow:
            usuarios = uow.usuarios.list_todos()
            return [UserPublic.model_validate(usuario) for usuario in usuarios]

    def activar(self, id: int) -> UserPublic:
        with self.uow as uow:
            usuario = self._get_usuario(uow, id)
            usuario.disabled = False
            usuario = uow.usuarios.add(usuario)
            return UserPublic.model_validate(usuario)

    def desactivar(self, id: int, administrador: UserPublic) -> UserPublic:
        with self.uow as uow:
            usuario = self._get_usuario(uow, id)
            if usuario.id == administrador.id:
                raise AutoDesactivacion(id)
            usuario.disabled = True
            usuario = uow.usuarios.add(usuario)
            return UserPublic.model_validate(usuario)

    @staticmethod
    def _get_usuario(uow: UsuarioUnitOfWork, id: int) -> Usuario:
        usuario = uow.usuarios.get_by_id(id)
        if usuario is None:
            raise UsuarioNoEncontrado(id)
        return usuario
