import { useState } from 'react'

import { handleApiError } from '@/shared/api/handleApiError'
import EstadoError from '@/shared/components/EstadoError'
import EstadoVacio from '@/shared/components/EstadoVacio'
import Paginacion from '@/shared/components/Paginacion'
import Skeleton from '@/shared/components/Skeleton'
import Button from '@/shared/ui/Button'
import { useCategorias } from '@/features/categorias/hooks/useCategorias'
import ProductoCard from '@/features/productos/components/ProductoCard'
import { useProductos } from '@/features/productos/hooks/useProductos'

const PRODUCTOS_POR_PAGINA = 6

const CatalogoPage = () => {
  const [pagina, setPagina] = useState(0)
  const [textoBusqueda, setTextoBusqueda] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [categoriaId, setCategoriaId] = useState<number | undefined>(undefined)

  const categorias = useCategorias()
  const productos = useProductos({
    skip: pagina * PRODUCTOS_POR_PAGINA,
    limit: PRODUCTOS_POR_PAGINA,
    search: busqueda || undefined,
    categoria_id: categoriaId,
  })

  const totalPaginas = Math.ceil((productos.data?.total ?? 0) / PRODUCTOS_POR_PAGINA)

  const buscar = () => {
    setBusqueda(textoBusqueda.trim())
    setPagina(0)
  }

  const cambiarCategoria = (valor: string) => {
    setCategoriaId(valor ? Number(valor) : undefined)
    setPagina(0)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-800">Catálogo</h1>

      <div className="flex flex-col gap-3 sm:flex-row">
        <form
          className="flex flex-1 gap-2"
          onSubmit={(evento) => {
            evento.preventDefault()
            buscar()
          }}
        >
          <input
            type="search"
            aria-label="Buscar productos"
            placeholder="Buscar por nombre..."
            value={textoBusqueda}
            onChange={(evento) => setTextoBusqueda(evento.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-300"
          />
          <Button type="submit">Buscar</Button>
        </form>
        <select
          aria-label="Filtrar por categoría"
          value={categoriaId ?? ''}
          onChange={(evento) => cambiarCategoria(evento.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="">Todas las categorías</option>
          {categorias.data?.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      {productos.isPending && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, indice) => (
            <Skeleton key={indice} className="h-80" />
          ))}
        </div>
      )}
      {productos.isError && (
        <EstadoError
          mensaje={handleApiError(productos.error)}
          onReintentar={() => void productos.refetch()}
        />
      )}
      {productos.isSuccess && productos.data.items.length === 0 && (
        <EstadoVacio mensaje="No hay productos que coincidan con la búsqueda." />
      )}
      {productos.isSuccess && productos.data.items.length > 0 && (
        <div
          className={`grid gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${productos.isPlaceholderData ? 'opacity-60' : ''}`}
        >
          {productos.data.items.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}

      <Paginacion
        pagina={pagina}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPagina}
      />
    </div>
  )
}

export default CatalogoPage
