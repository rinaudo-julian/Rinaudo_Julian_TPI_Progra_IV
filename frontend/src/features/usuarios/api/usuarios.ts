import { axiosInstance } from '@/shared/api/axiosInstance'
import type { Usuario } from '@/features/auth/types/usuario'

export async function obtenerUsuarios(): Promise<Usuario[]> {
  const { data } = await axiosInstance.get<Usuario[]>('/admin/usuarios')
  return data
}

export async function activarUsuario(id: number): Promise<Usuario> {
  const { data } = await axiosInstance.post<Usuario>(`/admin/usuarios/${id}/activar`)
  return data
}

export async function desactivarUsuario(id: number): Promise<Usuario> {
  const { data } = await axiosInstance.post<Usuario>(`/admin/usuarios/${id}/desactivar`)
  return data
}
