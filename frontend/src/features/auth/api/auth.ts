import { axiosInstance } from '../../../shared/api/axiosInstance'
import type { MensajeRespuesta, Usuario } from '../types/usuario'

export async function iniciarSesion(
  username: string,
  password: string,
): Promise<MensajeRespuesta> {
  const formulario = new URLSearchParams({ username, password })
  const { data } = await axiosInstance.post<MensajeRespuesta>(
    '/auth/token',
    formulario,
  )
  return data
}

export async function cerrarSesion(): Promise<MensajeRespuesta> {
  const { data } = await axiosInstance.post<MensajeRespuesta>('/auth/logout')
  return data
}

export async function obtenerUsuarioActual(): Promise<Usuario> {
  const { data } = await axiosInstance.get<Usuario>('/auth/me')
  return data
}
