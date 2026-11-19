import axios, { isAxiosError } from 'axios'

import { useAuthStore } from '@/store/authStore'

export const MENSAJE_CUENTA_DESACTIVADA = 'Cuenta de usuario desactivada'

const RUTAS_SIN_LIMPIEZA_DE_SESION = ['/auth/token', '/auth/me']

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

axiosInstance.interceptors.response.use(
  (respuesta) => respuesta,
  (error: unknown) => {
    if (isAxiosError<{ detail?: unknown }>(error) && error.response) {
      const { status, data } = error.response
      const url = error.config?.url ?? ''
      const sesionVencida =
        status === 401 && !RUTAS_SIN_LIMPIEZA_DE_SESION.includes(url)
      const cuentaDesactivada =
        status === 400 && data?.detail === MENSAJE_CUENTA_DESACTIVADA
      if (sesionVencida || cuentaDesactivada) {
        useAuthStore.getState().limpiarSesion()
      }
    }
    return Promise.reject(error)
  },
)
