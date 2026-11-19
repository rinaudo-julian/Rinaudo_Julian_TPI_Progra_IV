import type { ReactNode } from 'react'

import { handleApiError } from '../../../shared/api/handleApiError'
import EstadoError from '../../../shared/components/EstadoError'
import Skeleton from '../../../shared/components/Skeleton'
import { formatearPrecio } from '../../../shared/utils/formatearPrecio'
import TarjetaResumen from '../components/TarjetaResumen'
import { useResumenPedidos } from '../hooks/useResumenPedidos'

const CANTIDAD_DE_TARJETAS = 6

const AdminResumenPage = () => {
  const resumen = useResumenPedidos()

  let contenido: ReactNode
  if (resumen.isPending) {
    contenido = (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: CANTIDAD_DE_TARJETAS }, (_, indice) => (
          <Skeleton key={indice} className="h-28" />
        ))}
      </div>
    )
  } else if (resumen.isError) {
    contenido = (
      <EstadoError
        mensaje={handleApiError(resumen.error)}
        onReintentar={() => void resumen.refetch()}
      />
    )
  } else {
    const datos = resumen.data
    contenido = (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TarjetaResumen
          titulo="Pendientes"
          valor={String(datos.pendientes)}
          colorDelValor="text-yellow-600"
        />
        <TarjetaResumen
          titulo="En preparación"
          valor={String(datos.en_preparacion)}
          colorDelValor="text-blue-600"
        />
        <TarjetaResumen
          titulo="Entregados"
          valor={String(datos.entregados)}
          colorDelValor="text-green-600"
        />
        <TarjetaResumen
          titulo="Cancelados"
          valor={String(datos.cancelados)}
          colorDelValor="text-gray-500"
        />
        <TarjetaResumen titulo="Pedidos de hoy" valor={String(datos.pedidos_hoy)} />
        <TarjetaResumen
          titulo="Ingresos (entregados)"
          valor={formatearPrecio(datos.ingresos_entregados)}
          colorDelValor="text-orange-600"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-800">Resumen</h1>
      {contenido}
    </div>
  )
}

export default AdminResumenPage
