import {
  ESTADOS_PEDIDO,
  type EstadoPedido,
} from '../../features/pedidos/types/pedido'

const ESTILOS_POR_ESTADO: Record<EstadoPedido, string> = {
  [ESTADOS_PEDIDO.PENDIENTE]: 'bg-yellow-100 text-yellow-800',
  [ESTADOS_PEDIDO.EN_PREPARACION]: 'bg-blue-100 text-blue-800',
  [ESTADOS_PEDIDO.ENTREGADO]: 'bg-green-100 text-green-800',
  [ESTADOS_PEDIDO.CANCELADO]: 'bg-gray-200 text-gray-700',
}

const ETIQUETAS_POR_ESTADO: Record<EstadoPedido, string> = {
  [ESTADOS_PEDIDO.PENDIENTE]: 'Pendiente',
  [ESTADOS_PEDIDO.EN_PREPARACION]: 'En preparación',
  [ESTADOS_PEDIDO.ENTREGADO]: 'Entregado',
  [ESTADOS_PEDIDO.CANCELADO]: 'Cancelado',
}

interface BadgeEstadoProps {
  estado: EstadoPedido
}

function BadgeEstado({ estado }: BadgeEstadoProps) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTILOS_POR_ESTADO[estado]}`}
    >
      {ETIQUETAS_POR_ESTADO[estado]}
    </span>
  )
}

export default BadgeEstado
