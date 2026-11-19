import { Link, NavLink, useNavigate } from 'react-router-dom'

import { ROLES } from '../../features/auth/types/usuario'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import Button from '../ui/Button'

function claseDeEnlace({ isActive }: { isActive: boolean }): string {
  return `text-sm font-medium ${isActive ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`
}

const Navbar = () => {
  const usuario = useAuthStore((estado) => estado.usuario)
  const logout = useAuthStore((estado) => estado.logout)
  const cantidadEnCarrito = useCartStore((estado) =>
    estado.items.reduce((suma, item) => suma + item.cantidad, 0),
  )
  const navigate = useNavigate()

  const cerrarSesion = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="text-xl font-bold text-orange-600">
          Food Store
        </Link>
        <div className="flex flex-wrap items-center gap-4">
          <NavLink to="/" end className={claseDeEnlace}>
            Catálogo
          </NavLink>
          <NavLink to="/carrito" className={claseDeEnlace}>
            Carrito ({cantidadEnCarrito})
          </NavLink>
          {usuario?.role === ROLES.USER && (
            <NavLink to="/mis-pedidos" className={claseDeEnlace}>
              Mis pedidos
            </NavLink>
          )}
          {usuario?.role === ROLES.ADMIN && (
            <NavLink to="/admin/resumen" className={claseDeEnlace}>
              Panel
            </NavLink>
          )}
          {usuario ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">
                {usuario.full_name}{' '}
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700">
                  {usuario.role}
                </span>
              </span>
              <Button variante="secundario" onClick={() => void cerrarSesion()}>
                Cerrar sesión
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink to="/login" className={claseDeEnlace}>
                Ingresar
              </NavLink>
              <NavLink to="/register" className={claseDeEnlace}>
                Registrarse
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
