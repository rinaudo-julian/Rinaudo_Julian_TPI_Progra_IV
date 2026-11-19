# Food Store — TPI Programación IV

Aplicación web para un negocio de comidas. Los clientes recorren el catálogo, arman un carrito y confirman pedidos; el negocio administra categorías, productos, stock, pedidos y usuarios desde un panel de administración.

El proyecto se divide en dos partes independientes que se comunican por HTTP:

- **Backend:** API REST con FastAPI + SQLModel sobre PostgreSQL, organizada en capas (Router → Service → Unit of Work → Repository → Model).
- **Frontend:** aplicación React + TypeScript (en desarrollo).

**Repositorio:** https://github.com/rinaudo-julian/Rinaudo_Julian_TPI_Progra_IV

## Backend

### Requisitos

- Python 3.11 a 3.13
- PostgreSQL 15 o superior

### Instalación y ejecución

Todos los comandos se ejecutan desde la carpeta `backend/`.

1. Crear y activar el entorno virtual e instalar las dependencias:

   ```bash
   cd backend
   python3.13 -m venv venv
   source venv/bin/activate        # macOS / Linux
   venv\Scripts\activate           # Windows
   pip install -r requirements.txt
   ```

2. Crear el archivo de variables de entorno a partir del ejemplo:

   ```bash
   cp .env.example .env
   ```

   En `.env`, completar `DATABASE_URL` con los datos de conexión y reemplazar `SECRET_KEY` por una clave propia de al menos 32 caracteres. Se puede generar con:

   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(48))"
   ```

3. Crear la base de datos en PostgreSQL:

   ```bash
   createdb foodstore_db
   ```

4. Cargar los datos iniciales (crea las tablas, los usuarios, las categorías y los productos; se puede ejecutar varias veces sin duplicar datos):

   ```bash
   python -m app.db.seed
   ```

5. Levantar el servidor:

   ```bash
   fastapi dev app/main.py
   ```

   o, de forma equivalente:

   ```bash
   uvicorn app.main:app --reload
   ```

La API queda disponible en http://localhost:8000/api/v1 y la documentación interactiva en http://localhost:8000/docs y http://localhost:8000/redoc.

### Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL con el driver `psycopg2` | `postgresql+psycopg2://usuario:password@localhost:5432/foodstore_db` |
| `SECRET_KEY` | Clave para firmar el JWT, mínimo 32 caracteres | `cambiar-esta-clave-de-al-menos-32-caracteres` |
| `ALGORITHM` | Algoritmo del JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiración del token y de la cookie, en minutos | `30` |
| `FRONTEND_ORIGIN` | Origen permitido en CORS | `http://localhost:5173` |

### Datos iniciales (seed)

`python -m app.db.seed` carga los siguientes datos. Si ya existen, no los vuelve a crear.

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `Admin1234!` | `admin` |
| `cliente` | `Cliente1234!` | `user` |

- Categorías: **Pizzas**, **Hamburguesas** y **Bebidas**.
- Productos: 8 productos con stock, repartidos entre esas categorías.

## Frontend

Pendiente.
