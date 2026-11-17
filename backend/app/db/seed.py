from app.core.database import create_all_tables, session_factory
from app.modules.categorias.models import Categoria
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork

CATEGORIAS: list[tuple[str, str]] = [
    ("Pizzas", "Pizzas a la piedra y al molde"),
    ("Hamburguesas", "Hamburguesas caseras con papas"),
    ("Bebidas", "Gaseosas, aguas y jugos"),
]


def seed_categorias() -> int:
    creadas = 0
    with CategoriaUnitOfWork(session_factory) as uow:
        for nombre, descripcion in CATEGORIAS:
            if uow.categorias.get_by_nombre(nombre) is None:
                uow.categorias.add(Categoria(nombre=nombre, descripcion=descripcion))
                creadas += 1
    return creadas


def main() -> None:
    create_all_tables()
    creadas = seed_categorias()
    print(f"Seed: {creadas} categoría(s) creada(s), {len(CATEGORIAS) - creadas} ya existían.")


if __name__ == "__main__":
    main()
