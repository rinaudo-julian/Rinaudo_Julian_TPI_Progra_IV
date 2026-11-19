import { useState } from 'react'

import { handleApiError } from '@/shared/api/handleApiError'
import EstadoError from '@/shared/components/EstadoError'
import EstadoVacio from '@/shared/components/EstadoVacio'
import Skeleton from '@/shared/components/Skeleton'
import Button from '@/shared/ui/Button'
import Modal from '@/shared/ui/Modal'
import FormularioProducto from '@/features/productos/components/FormularioProducto'
import FormularioStock from '@/features/productos/components/FormularioStock'
import TablaProductos from '@/features/productos/components/TablaProductos'
import { useActualizarProducto } from '@/features/productos/hooks/useActualizarProducto'
import { useActualizarStockProducto } from '@/features/productos/hooks/useActualizarStockProducto'
import { useCrearProducto } from '@/features/productos/hooks/useCrearProducto'
import { useEliminarProducto } from '@/features/productos/hooks/useEliminarProducto'
import { useProductos } from '@/features/productos/hooks/useProductos'
import type { Producto, ProductoDatos, StockDatos } from '@/features/productos/types/producto'

const LIMITE_DEL_PANEL = 100

const AdminProductosPage = () => {
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [productoEnEdicion, setProductoEnEdicion] = useState<Producto | null>(null)
  const [productoEnStock, setProductoEnStock] = useState<Producto | null>(null)
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null)

  const productos = useProductos({ skip: 0, limit: LIMITE_DEL_PANEL })
  const crear = useCrearProducto()
  const actualizar = useActualizarProducto()
  const actualizarStock = useActualizarStockProducto()
  const eliminar = useEliminarProducto()

  const mutacionDelFormulario = productoEnEdicion ? actualizar : crear

  const abrirFormulario = (producto: Producto | null) => {
    crear.reset()
    actualizar.reset()
    setProductoEnEdicion(producto)
    setFormularioAbierto(true)
  }

  const cerrarFormulario = () => {
    setFormularioAbierto(false)
    setProductoEnEdicion(null)
  }

  const guardar = (datos: ProductoDatos) => {
    if (productoEnEdicion) {
      actualizar.mutate({ id: productoEnEdicion.id, datos }, { onSuccess: cerrarFormulario })
    } else {
      crear.mutate(datos, { onSuccess: cerrarFormulario })
    }
  }

  const abrirStock = (producto: Producto) => {
    actualizarStock.reset()
    setProductoEnStock(producto)
  }

  const guardarStock = (producto: Producto, datos: StockDatos) => {
    actualizarStock.mutate(
      { id: producto.id, datos },
      { onSuccess: () => setProductoEnStock(null) },
    )
  }

  const abrirEliminacion = (producto: Producto) => {
    eliminar.reset()
    setProductoAEliminar(producto)
  }

  const confirmarEliminacion = (producto: Producto) => {
    eliminar.mutate(producto.id, { onSuccess: () => setProductoAEliminar(null) })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Productos</h1>
        <Button onClick={() => abrirFormulario(null)}>Nuevo producto</Button>
      </div>

      {productos.isPending && <Skeleton className="h-64" />}
      {productos.isError && (
        <EstadoError
          mensaje={handleApiError(productos.error)}
          onReintentar={() => void productos.refetch()}
        />
      )}
      {productos.isSuccess && productos.data.items.length === 0 && (
        <EstadoVacio mensaje="Todavía no hay productos." />
      )}
      {productos.isSuccess && productos.data.items.length > 0 && (
        <TablaProductos
          productos={productos.data.items}
          onEditar={abrirFormulario}
          onCambiarStock={abrirStock}
          onEliminar={abrirEliminacion}
        />
      )}

      <Modal
        titulo={productoEnEdicion ? `Editar ${productoEnEdicion.nombre}` : 'Nuevo producto'}
        abierto={formularioAbierto}
        onCerrar={cerrarFormulario}
      >
        <FormularioProducto
          key={productoEnEdicion?.id ?? 'nuevo'}
          producto={productoEnEdicion}
          guardando={mutacionDelFormulario.isPending}
          error={
            mutacionDelFormulario.isError ? handleApiError(mutacionDelFormulario.error) : null
          }
          onGuardar={guardar}
          onCancelar={cerrarFormulario}
        />
      </Modal>

      <Modal
        titulo={productoEnStock ? `Stock de ${productoEnStock.nombre}` : ''}
        abierto={productoEnStock !== null}
        onCerrar={() => setProductoEnStock(null)}
      >
        {productoEnStock && (
          <FormularioStock
            key={productoEnStock.id}
            producto={productoEnStock}
            guardando={actualizarStock.isPending}
            error={actualizarStock.isError ? handleApiError(actualizarStock.error) : null}
            onGuardar={(datos) => guardarStock(productoEnStock, datos)}
            onCancelar={() => setProductoEnStock(null)}
          />
        )}
      </Modal>

      <Modal
        titulo={productoAEliminar ? `Eliminar ${productoAEliminar.nombre}` : ''}
        abierto={productoAEliminar !== null}
        onCerrar={() => setProductoAEliminar(null)}
      >
        {productoAEliminar && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-700">
              ¿Seguro que querés eliminar este producto? Deja de mostrarse en el catálogo.
            </p>
            {eliminar.isError && (
              <p className="text-sm text-red-600">{handleApiError(eliminar.error)}</p>
            )}
            <div className="flex gap-2">
              <Button
                variante="peligro"
                cargando={eliminar.isPending}
                onClick={() => confirmarEliminacion(productoAEliminar)}
              >
                Sí, eliminar
              </Button>
              <Button variante="secundario" onClick={() => setProductoAEliminar(null)}>
                Volver
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AdminProductosPage
