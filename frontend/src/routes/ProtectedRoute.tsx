import { Navigate, Outlet, useLocation } from 'react-router-dom'

import type { EstadoNavegacionLogin, Rol } from '../features/auth/types/usuario'
import { useAuthStore } from '../store/authStore'

interface ProtectedRouteProps {
  rolesPermitidos?: Rol[]
}

function ProtectedRoute({ rolesPermitidos }: ProtectedRouteProps) {
  const usuario = useAuthStore((estado) => estado.usuario)
  const cargando = useAuthStore((estado) => estado.cargando)
  const location = useLocation()

  if (cargando) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">Verificando sesión...</p>
      </div>
    )
  }

  if (!usuario) {
    const estado: EstadoNavegacionLogin = { desde: location.pathname }
    return <Navigate to="/login" replace state={estado} />
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
