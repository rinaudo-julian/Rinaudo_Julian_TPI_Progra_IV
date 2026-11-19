import { Navigate, Outlet } from 'react-router-dom'

import type { Rol } from '../features/auth/types/usuario'
import { useAuthStore } from '../store/authStore'

interface ProtectedRouteProps {
  rolesPermitidos?: Rol[]
}

function ProtectedRoute({ rolesPermitidos }: ProtectedRouteProps) {
  const usuario = useAuthStore((estado) => estado.usuario)
  const cargando = useAuthStore((estado) => estado.cargando)

  if (cargando) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">Verificando sesión...</p>
      </div>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
