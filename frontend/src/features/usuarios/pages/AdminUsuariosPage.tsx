import { handleApiError } from '@/shared/api/handleApiError'
import EstadoError from '@/shared/components/EstadoError'
import EstadoVacio from '@/shared/components/EstadoVacio'
import Skeleton from '@/shared/components/Skeleton'
import { useAuthStore } from '@/store/authStore'
import type { Usuario } from '@/features/auth/types/usuario'
import TablaUsuarios from '@/features/usuarios/components/TablaUsuarios'
import { useActivarUsuario } from '@/features/usuarios/hooks/useActivarUsuario'
import { useDesactivarUsuario } from '@/features/usuarios/hooks/useDesactivarUsuario'
import { useUsuarios } from '@/features/usuarios/hooks/useUsuarios'

const AdminUsuariosPage = () => {
  const usuarioDeLaSesion = useAuthStore((estado) => estado.usuario)
  const usuarios = useUsuarios()
  const activar = useActivarUsuario()
  const desactivar = useDesactivarUsuario()

  const idActivando = activar.isPending ? activar.variables : null
  const idDesactivando = desactivar.isPending ? desactivar.variables : null
  const errorDeAccion = activar.error ?? desactivar.error

  const activarUsuario = (usuario: Usuario) => {
    desactivar.reset()
    activar.mutate(usuario.id)
  }

  const desactivarUsuario = (usuario: Usuario) => {
    activar.reset()
    desactivar.mutate(usuario.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-800">Usuarios</h1>

      {errorDeAccion && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {handleApiError(errorDeAccion)}
        </p>
      )}

      {usuarios.isPending && <Skeleton className="h-64" />}
      {usuarios.isError && (
        <EstadoError
          mensaje={handleApiError(usuarios.error)}
          onReintentar={() => void usuarios.refetch()}
        />
      )}
      {usuarios.isSuccess && usuarios.data.length === 0 && (
        <EstadoVacio mensaje="No hay usuarios registrados." />
      )}
      {usuarios.isSuccess && usuarios.data.length > 0 && (
        <TablaUsuarios
          usuarios={usuarios.data}
          usuarioDeLaSesionId={usuarioDeLaSesion?.id}
          usuarioEnProcesoId={idActivando ?? idDesactivando}
          onActivar={activarUsuario}
          onDesactivar={desactivarUsuario}
        />
      )}
    </div>
  )
}

export default AdminUsuariosPage
