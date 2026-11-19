import { isAxiosError } from 'axios'

interface ErrorDeValidacion {
  msg: string
}

interface CuerpoDeError {
  detail?: string | ErrorDeValidacion[]
}

export function handleApiError(error: unknown): string {
  if (isAxiosError<CuerpoDeError>(error)) {
    if (!error.response) {
      return 'No se pudo conectar con el servidor'
    }
    const detalle = error.response.data?.detail
    if (typeof detalle === 'string') {
      return detalle
    }
    if (Array.isArray(detalle) && detalle.length > 0) {
      return detalle.map((errorDeValidacion) => errorDeValidacion.msg).join('. ')
    }
  }
  return 'Ocurrió un error inesperado'
}
