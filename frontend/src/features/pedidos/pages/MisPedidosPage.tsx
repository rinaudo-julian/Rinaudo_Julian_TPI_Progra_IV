import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { handleApiError } from '../../../shared/api/handleApiError'
import EstadoError from '../../../shared/components/EstadoError'
import EstadoVacio from '../../../shared/components/EstadoVacio'
import Paginacion from '../../../shared/components/Paginacion'
import Skeleton from '../../../shared/components/Skeleton'
import BadgeEstado from '../../../shared/ui/BadgeEstado'
import Button from '../../../shared/ui/Button'
import Card from '../../../shared/ui/Card'
import Modal from '../../../shared/ui/Modal'
import { formatearFecha } from '../../../shared/utils/formatearFecha'
import { formatearPrecio } from '../../../shared/utils/formatearPrecio'
import DetallePedido from '../components/DetallePedido'
import { useCancelarPedido } from '../hooks/useCancelarPedido'
import { usePedidos } from '../hooks/usePedidos'
import { ESTADOS_PEDIDO } from '../types/pedido'

const PEDIDOS_POR_PAGINA = 10

const MisPedidosPage = () => {
  const [pagina, setPagina] = useState(0)
  const [pedidoSeleccionadoId, setPedidoSeleccionadoId] = useState<number | null>(null)
  const [confirmandoCancelacion, setConfirmandoCancelacion] = useState(false)

  const pedidos = usePedidos({
    skip: pagina * PEDIDOS_POR_PAGINA,
    limit: PEDIDOS_POR_PAGINA,
  })
  const cancelar = useCancelarPedido()

  const pedidoSeleccionado =
    pedidos.data?.items.find((pedido) => pedido.id === pedidoSeleccionadoId) ?? null
  const totalPaginas = Math.ceil((pedidos.data?.total ?? 0) / PEDIDOS_POR_PAGINA)

  const abrirDetalle = (id: number) => {
    cancelar.reset()
    setConfirmandoCancelacion(false)
    setPedidoSeleccionadoId(id)
  }

  const cerrarDetalle = () => {
    setPedidoSeleccionadoId(null)
    setConfirmandoCancelacion(false)
  }

  const confirmarCancelacion = (id: number) => {
    cancelar.mutate(id, {
      onSuccess: () => setConfirmandoCancelacion(false),
    })
  }

  let contenido: ReactNode
  if (pedidos.isPending) {
    contenido = (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }, (_, indice) => (
          <Skeleton key={indice} className="h-20" />
        ))}
      </div>
    )
  } else if (pedidos.isError) {
    contenido = (
      <EstadoError
        mensaje={handleApiError(pedidos.error)}
        onReintentar={() => void pedidos.refetch()}
      />
    )
  } else if (pedidos.data.items.length === 0) {
    contenido = (
      <div className="flex flex-col gap-4">
        <EstadoVacio mensaje="Todavía no hiciste ningún pedido." />
        <Link to="/" className="text-center text-orange-600 hover:underline">
          Ir al catálogo
        </Link>
      </div>
    )
  } else {
    contenido = (
      <div
        className={`flex flex-col gap-3 transition-opacity ${pedidos.isPlaceholderData ? 'opacity-60' : ''}`}
      >
        {pedidos.data.items.map((pedido) => (
          <Card
            key={pedido.id}
            className="flex flex-wrap items-center justify-between gap-4 p-4"
          >
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-800">Pedido #{pedido.id}</span>
              <span className="text-sm text-gray-500">
                {formatearFecha(pedido.created_at)}
              </span>
            </div>
            <BadgeEstado estado={pedido.estado} />
            <span className="font-semibold text-gray-900">
              {formatearPrecio(pedido.total)}
            </span>
            <Button variante="secundario" onClick={() => abrirDetalle(pedido.id)}>
              Ver detalle
            </Button>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-800">Mis pedidos</h1>
      {contenido}
      <Paginacion
        pagina={pagina}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPagina}
      />

      <Modal
        titulo={pedidoSeleccionado ? `Pedido #${pedidoSeleccionado.id}` : ''}
        abierto={pedidoSeleccionado !== null}
        onCerrar={cerrarDetalle}
      >
        {pedidoSeleccionado && (
          <div className="flex flex-col gap-4">
            <DetallePedido pedido={pedidoSeleccionado} />
            {cancelar.isError && (
              <p className="text-sm text-red-600">{handleApiError(cancelar.error)}</p>
            )}
            {pedidoSeleccionado.estado === ESTADOS_PEDIDO.PENDIENTE &&
              (confirmandoCancelacion ? (
                <div className="flex flex-col gap-3 rounded-lg bg-red-50 p-3">
                  <p className="text-sm text-red-700">
                    ¿Seguro que querés cancelar este pedido?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variante="peligro"
                      cargando={cancelar.isPending}
                      onClick={() => confirmarCancelacion(pedidoSeleccionado.id)}
                    >
                      Sí, cancelar
                    </Button>
                    <Button
                      variante="secundario"
                      onClick={() => setConfirmandoCancelacion(false)}
                    >
                      Volver
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variante="peligro" onClick={() => setConfirmandoCancelacion(true)}>
                  Cancelar pedido
                </Button>
              ))}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default MisPedidosPage
