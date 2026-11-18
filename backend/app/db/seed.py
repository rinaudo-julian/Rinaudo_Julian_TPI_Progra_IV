from app.core.database import create_all_tables, session_factory
from app.core.security import hash_password
from app.db.models import Categoria, Producto, Usuario
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork
from app.modules.productos.unit_of_work import ProductoUnitOfWork
from app.modules.usuarios.models import ROL_ADMIN, ROL_USER
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

USUARIOS: list[tuple[str, str, str, str, str]] = [
    ("admin", "Administrador", "admin@foodstore.com", "Admin1234!", ROL_ADMIN),
    ("cliente", "Cliente de Prueba", "cliente@foodstore.com", "Cliente1234!", ROL_USER),
]

CATEGORIAS: list[tuple[str, str]] = [
    ("Pizzas", "Pizzas a la piedra y al molde"),
    ("Hamburguesas", "Hamburguesas caseras con papas"),
    ("Bebidas", "Gaseosas, aguas y jugos"),
]

PRODUCTOS: list[tuple[str, str, str, float, int]] = [
    ("Pizzas", "Muzzarella", "Salsa de tomate, muzzarella y aceitunas", 9500.0, 20),
    ("Pizzas", "Napolitana", "Muzzarella, tomate en rodajas y ajo", 11000.0, 15),
    ("Pizzas", "Fugazzeta", "Rellena de muzzarella con cebolla", 12500.0, 10),
    ("Hamburguesas", "Clásica", "Medallón de carne, lechuga y tomate", 8500.0, 25),
    ("Hamburguesas", "Cheddar y panceta", "Doble cheddar y panceta crocante", 10500.0, 20),
    ("Hamburguesas", "Veggie", "Medallón de lentejas y vegetales", 9000.0, 12),
    ("Bebidas", "Gaseosa 500 ml", "Cola, lima limón o naranja", 2500.0, 50),
    ("Bebidas", "Agua mineral 500 ml", "Con o sin gas", 1800.0, 40),
]


def seed_usuarios() -> int:
    creados = 0
    with UsuarioUnitOfWork(session_factory) as uow:
        for username, full_name, email, password, role in USUARIOS:
            if uow.usuarios.get_by_username(username) is None:
                uow.usuarios.add(
                    Usuario(
                        username=username,
                        full_name=full_name,
                        email=email,
                        hashed_password=hash_password(password),
                        role=role,
                    )
                )
                creados += 1
    return creados


def seed_categorias() -> int:
    creadas = 0
    with CategoriaUnitOfWork(session_factory) as uow:
        for nombre, descripcion in CATEGORIAS:
            if uow.categorias.get_by_nombre(nombre) is None:
                uow.categorias.add(Categoria(nombre=nombre, descripcion=descripcion))
                creadas += 1
    return creadas


def seed_productos() -> int:
    creados = 0
    with ProductoUnitOfWork(session_factory) as uow:
        for nombre_categoria, nombre, descripcion, precio_base, stock in PRODUCTOS:
            categoria = uow.categorias.get_by_nombre(nombre_categoria)
            if categoria is None or categoria.id is None:
                continue
            if uow.productos.get_by_nombre_y_categoria(nombre, categoria.id) is None:
                uow.productos.add(
                    Producto(
                        categoria_id=categoria.id,
                        nombre=nombre,
                        descripcion=descripcion,
                        precio_base=precio_base,
                        stock=stock,
                    )
                )
                creados += 1
    return creados


def main() -> None:
    create_all_tables()
    usuarios_creados = seed_usuarios()
    categorias_creadas = seed_categorias()
    productos_creados = seed_productos()
    print(
        f"Seed: {usuarios_creados} usuario(s), {categorias_creadas} categoría(s) y "
        f"{productos_creados} producto(s) creados."
    )


if __name__ == "__main__":
    main()
