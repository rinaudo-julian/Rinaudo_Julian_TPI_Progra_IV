import BadgeEstado from '@/shared/ui/BadgeEstado'
import { formatearFecha } from '@/shared/utils/formatearFecha'
import { formatearPrecio } from '@/shared/utils/formatearPrecio'
import { FORMAS_PAGO, type FormaPago, type Pedido } from '@/features/pedidos/types/pedido'

const ETIQUETAS_FORMA_PAGO: Record<FormaPago, string> = {
  [FORMAS_PAGO.EFECTIVO]: 'Efectivo',
  [FORMAS_PAGO.TRANSFERENCIA]: 'Transferencia',
}

interface DetallePedidoProps {
  pedido: Pedido
}

const DetallePedido = ({ pedido }: DetallePedidoProps) => {
  return (
    <div className="flex flex-col gap-4 text-sm text-gray-700">
      <dl className="grid grid-cols-2 gap-2">
        <dt className="text-gray-500">Estado</dt>
        <dd>
          <BadgeEstado estado={pedido.estado} />
        </dd>
        <dt className="text-gray-500">Fecha</dt>
        <dd>{formatearFecha(pedido.created_at)}</dd>
        <dt className="text-gray-500">Forma de pago</dt>
        <dd>{ETIQUETAS_FORMA_PAGO[pedido.forma_pago]}</dd>
        <dt className="text-gray-500">Dirección</dt>
        <dd>{pedido.direccion_entrega}</dd>
        {pedido.notas && (
          <>
            <dt className="text-gray-500">Notas</dt>
            <dd>{pedido.notas}</dd>
          </>
        )}
      </dl>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500">
            <th className="py-2 font-medium">Producto</th>
            <th className="py-2 text-right font-medium">Cant.</th>
            <th className="py-2 text-right font-medium">Precio</th>
            <th className="py-2 text-right font-medium">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {pedido.items.map((linea) => (
            <tr key={linea.producto_id} className="border-b border-gray-100">
              <td className="py-2">{linea.nombre_producto}</td>
              <td className="py-2 text-right">{linea.cantidad}</td>
              <td className="py-2 text-right">{formatearPrecio(linea.precio_unitario)}</td>
              <td className="py-2 text-right">{formatearPrecio(linea.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between text-base font-bold text-gray-900">
        <span>Total</span>
        <span>{formatearPrecio(pedido.total)}</span>
      </div>
    </div>
  )
}

export default DetallePedido
