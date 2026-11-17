from sqlalchemy import Index, func, text
from sqlmodel import Field, SQLModel


class Categoria(SQLModel, table=True):
    __table_args__ = (
        Index("uq_categoria_nombre_lower", func.lower(text("nombre")), unique=True),
    )

    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=100)
    descripcion: str | None = None
    activo: bool = Field(default=True)
