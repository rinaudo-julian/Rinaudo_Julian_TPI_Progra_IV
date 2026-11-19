import { formatearPrecio } from '../../../shared/utils/formatearPrecio'
import type { ItemCarrito } from '../../../store/cartStore'

interface ResumenCarritoProps {
  items: ItemCarrito[]
  total: number
}

function ResumenCarrito({ items, total }: ResumenCarritoProps) {
  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.producto_id} className="flex justify-between text-sm text-gray-700">
            <span>
              {item.cantidad} × {item.nombre}
            </span>
            <span>{formatearPrecio(item.precio_unitario * item.cantidad)}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold text-gray-900">
        <span>Total</span>
        <span>{formatearPrecio(total)}</span>
      </div>
    </div>
  )
}

export default ResumenCarrito
