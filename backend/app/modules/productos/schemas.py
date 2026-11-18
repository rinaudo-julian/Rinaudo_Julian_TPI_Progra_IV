from typing import Annotated

from pydantic import Field, StringConstraints
from sqlmodel import SQLModel

from app.modules.categorias.schemas import CategoriaRead

NombreProducto = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=2, max_length=100)
]
Precio = Annotated[float, Field(ge=0)]
Stock = Annotated[int, Field(ge=0)]


class ProductoCreate(SQLModel):
    nombre: NombreProducto
    descripcion: str | None = None
    precio_base: Precio
    imagen_url: str | None = None
    stock: Stock = 0
    disponible: bool = True
    categoria_id: int


class ProductoUpdate(SQLModel):
    nombre: NombreProducto | None = None
    descripcion: str | None = None
    precio_base: Precio | None = None
    imagen_url: str | None = None
    stock: Stock | None = None
    disponible: bool | None = None
    categoria_id: int | None = None


class ProductoStockUpdate(SQLModel):
    stock: Stock | None = None
    disponible: bool | None = None


class ProductoRead(SQLModel):
    id: int
    nombre: str
    descripcion: str | None
    precio_base: float
    imagen_url: str | None
    stock: int
    disponible: bool
    activo: bool
    categoria_id: int
    categoria: CategoriaRead


class ProductosPaginados(SQLModel):
    total: int
    items: list[ProductoRead]
