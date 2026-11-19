import { Link } from 'react-router-dom'

import EstadoVacio from '../../../shared/components/EstadoVacio'
import Button from '../../../shared/ui/Button'
import Card from '../../../shared/ui/Card'
import { formatearPrecio } from '../../../shared/utils/formatearPrecio'
import { useCartStore } from '../../../store/cartStore'

const CarritoPage = () => {
  const items = useCartStore((estado) => estado.items)
  const quitar = useCartStore((estado) => estado.quitar)
  const cambiarCantidad = useCartStore((estado) => estado.cambiarCantidad)
  const vaciar = useCartStore((estado) => estado.vaciar)
  const total = useCartStore((estado) => estado.total())

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-800">Carrito</h1>
        <EstadoVacio mensaje="Tu carrito está vacío." />
        <Link to="/" className="text-center text-orange-600 hover:underline">
          Ir al catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-800">Carrito</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col divide-y divide-gray-100 p-0 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.producto_id}
              className="flex flex-wrap items-center justify-between gap-4 p-4"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.nombre}</p>
                <p className="text-sm text-gray-500">
                  {formatearPrecio(item.precio_unitario)} c/u
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variante="secundario"
                  aria-label={`Restar una unidad de ${item.nombre}`}
                  onClick={() => cambiarCantidad(item.producto_id, item.cantidad - 1)}
                >
                  −
                </Button>
                <span className="w-8 text-center font-medium">{item.cantidad}</span>
                <Button
                  variante="secundario"
                  aria-label={`Sumar una unidad de ${item.nombre}`}
                  onClick={() => cambiarCantidad(item.producto_id, item.cantidad + 1)}
                >
                  +
                </Button>
              </div>
              <span className="w-28 text-right font-semibold text-gray-900">
                {formatearPrecio(item.precio_unitario * item.cantidad)}
              </span>
              <button
                type="button"
                onClick={() => quitar(item.producto_id)}
                className="text-sm text-red-600 hover:underline"
              >
                Quitar
              </button>
            </div>
          ))}
        </Card>
        <Card className="flex h-fit flex-col gap-4">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>{formatearPrecio(total)}</span>
          </div>
          <Link
            to="/checkout"
            className="rounded-lg bg-orange-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-orange-600"
          >
            Confirmar pedido
          </Link>
          <Button variante="secundario" onClick={vaciar}>
            Vaciar carrito
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default CarritoPage
