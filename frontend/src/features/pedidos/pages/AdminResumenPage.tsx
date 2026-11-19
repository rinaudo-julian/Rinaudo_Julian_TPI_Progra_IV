import { handleApiError } from '../../../shared/api/handleApiError'
import EstadoError from '../../../shared/components/EstadoError'
import Skeleton from '../../../shared/components/Skeleton'
import { formatearPrecio } from '../../../shared/utils/formatearPrecio'
import TarjetaResumen from '../components/TarjetaResumen'
import { useResumenPedidos } from '../hooks/useResumenPedidos'

const CANTIDAD_DE_TARJETAS = 6

const AdminResumenPage = () => {
  const resumen = useResumenPedidos()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-800">Resumen</h1>
      {resumen.isPending && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: CANTIDAD_DE_TARJETAS }, (_, indice) => (
            <Skeleton key={indice} className="h-28" />
          ))}
        </div>
      )}
      {resumen.isError && (
        <EstadoError
          mensaje={handleApiError(resumen.error)}
          onReintentar={() => void resumen.refetch()}
        />
      )}
      {resumen.isSuccess && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TarjetaResumen
            titulo="Pendientes"
            valor={String(resumen.data.pendientes)}
            colorDelValor="text-yellow-600"
          />
          <TarjetaResumen
            titulo="En preparación"
            valor={String(resumen.data.en_preparacion)}
            colorDelValor="text-blue-600"
          />
          <TarjetaResumen
            titulo="Entregados"
            valor={String(resumen.data.entregados)}
            colorDelValor="text-green-600"
          />
          <TarjetaResumen
            titulo="Cancelados"
            valor={String(resumen.data.cancelados)}
            colorDelValor="text-gray-500"
          />
          <TarjetaResumen titulo="Pedidos de hoy" valor={String(resumen.data.pedidos_hoy)} />
          <TarjetaResumen
            titulo="Ingresos (entregados)"
            valor={formatearPrecio(resumen.data.ingresos_entregados)}
            colorDelValor="text-orange-600"
          />
        </div>
      )}
    </div>
  )
}

export default AdminResumenPage
