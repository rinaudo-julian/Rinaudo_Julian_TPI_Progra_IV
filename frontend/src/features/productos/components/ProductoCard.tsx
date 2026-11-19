import { formatearPrecio } from '../../../shared/utils/formatearPrecio'
import Button from '../../../shared/ui/Button'
import Card from '../../../shared/ui/Card'
import { useCartStore } from '../../../store/cartStore'
import type { Producto } from '../types/producto'

interface ProductoCardProps {
  producto: Producto
}

const ProductoCard = ({ producto }: ProductoCardProps) => {
  const agregar = useCartStore((estado) => estado.agregar)
  const cantidadEnCarrito = useCartStore(
    (estado) =>
      estado.items.find((item) => item.producto_id === producto.id)?.cantidad ?? 0,
  )

  const sinStock = producto.stock === 0
  const alcanzoElStock = cantidadEnCarrito >= producto.stock
  const sePuedeAgregar = producto.disponible && !alcanzoElStock

  let textoDelBoton = 'Agregar al carrito'
  if (!producto.disponible) textoDelBoton = 'No disponible'
  else if (sinStock) textoDelBoton = 'Sin stock'
  else if (alcanzoElStock) textoDelBoton = 'Stock máximo en el carrito'

  return (
    <Card className="flex flex-col gap-3 p-4">
      {producto.imagen_url ? (
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          className="h-40 w-full rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center rounded-lg bg-orange-50 text-4xl font-bold text-orange-300">
          {producto.nombre.charAt(0)}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1">
        <span className="text-xs font-medium uppercase text-orange-600">
          {producto.categoria.nombre}
        </span>
        <h2 className="text-lg font-semibold text-gray-800">{producto.nombre}</h2>
        {producto.descripcion && (
          <p className="text-sm text-gray-600">{producto.descripcion}</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-gray-900">
          {formatearPrecio(producto.precio_base)}
        </span>
        {cantidadEnCarrito > 0 && (
          <span className="text-xs text-gray-500">En carrito: {cantidadEnCarrito}</span>
        )}
      </div>
      <Button
        disabled={!sePuedeAgregar}
        onClick={() =>
          agregar({
            producto_id: producto.id,
            nombre: producto.nombre,
            precio_unitario: producto.precio_base,
          })
        }
      >
        {textoDelBoton}
      </Button>
    </Card>
  )
}

export default ProductoCard
