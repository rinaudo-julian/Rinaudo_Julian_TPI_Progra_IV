from datetime import datetime

from sqlalchemy import func
from sqlmodel import Session, col, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Pedido)

    def list_by_usuario(
        self,
        usuario_id: int | None,
        estado: str | None,
        skip: int,
        limit: int,
    ) -> tuple[int, list[Pedido]]:
        filtros = []
        if usuario_id is not None:
            filtros.append(col(Pedido.usuario_id) == usuario_id)
        if estado is not None:
            filtros.append(col(Pedido.estado) == estado)

        consulta_total = select(func.count()).select_from(Pedido).where(*filtros)
        total = self.session.exec(consulta_total).one()

        consulta_pagina = (
            select(Pedido)
            .where(*filtros)
            .order_by(col(Pedido.id).desc())
            .offset(skip)
            .limit(limit)
        )
        pedidos = list(self.session.exec(consulta_pagina).all())
        return total, pedidos

    def count_by_estado(self) -> dict[str, int]:
        consulta = select(Pedido.estado, func.count()).group_by(col(Pedido.estado))
        return {estado: cantidad for estado, cantidad in self.session.exec(consulta)}

    def count_desde(self, desde: datetime) -> int:
        consulta = (
            select(func.count())
            .select_from(Pedido)
            .where(col(Pedido.created_at) >= desde)
        )
        return self.session.exec(consulta).one()

    def sum_total_by_estado(self, estado: str) -> float:
        consulta = select(func.coalesce(func.sum(Pedido.total), 0.0)).where(
            col(Pedido.estado) == estado
        )
        return float(self.session.exec(consulta).one())
