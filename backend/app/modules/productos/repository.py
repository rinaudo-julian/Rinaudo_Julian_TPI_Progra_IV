from sqlalchemy import func
from sqlmodel import Session, col, select

from app.core.base_repository import BaseRepository
from app.modules.productos.models import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Producto)

    def get_by_nombre_y_categoria(
        self, nombre: str, categoria_id: int
    ) -> Producto | None:
        consulta = select(Producto).where(
            func.lower(Producto.nombre) == nombre.lower(),
            Producto.categoria_id == categoria_id,
        )
        return self.session.exec(consulta).first()

    def search(
        self,
        skip: int,
        limit: int,
        search: str | None,
        categoria_id: int | None,
        disponible: bool | None,
    ) -> tuple[int, list[Producto]]:
        filtros = [col(Producto.activo).is_(True)]
        if search:
            filtros.append(col(Producto.nombre).ilike(f"%{search}%"))
        if categoria_id is not None:
            filtros.append(col(Producto.categoria_id) == categoria_id)
        if disponible is not None:
            filtros.append(col(Producto.disponible).is_(disponible))

        consulta_total = select(func.count()).select_from(Producto).where(*filtros)
        total = self.session.exec(consulta_total).one()

        consulta_pagina = (
            select(Producto)
            .where(*filtros)
            .order_by(col(Producto.id))
            .offset(skip)
            .limit(limit)
        )
        productos = list(self.session.exec(consulta_pagina).all())
        return total, productos
