import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'

import Paginacion from '@/shared/components/Paginacion'
import Button from '@/shared/ui/Button'
import { formatearPrecio } from '@/shared/utils/formatearPrecio'
import type { Producto } from '@/features/productos/types/producto'

const PRODUCTOS_POR_PAGINA = 10

const INDICADOR_DE_ORDEN: Record<string, string> = { asc: ' ▲', desc: ' ▼' }

const columnHelper = createColumnHelper<Producto>()

const columnas = [
  columnHelper.accessor('nombre', { header: 'Nombre' }),
  columnHelper.accessor((producto) => producto.categoria.nombre, {
    id: 'categoria',
    header: 'Categoría',
  }),
  columnHelper.accessor('precio_base', {
    header: 'Precio',
    cell: (info) => formatearPrecio(info.getValue()),
  }),
  columnHelper.accessor('stock', { header: 'Stock' }),
  columnHelper.accessor('disponible', {
    header: 'Disponible',
    cell: (info) => (info.getValue() ? 'Sí' : 'No'),
  }),
]

interface TablaProductosProps {
  productos: Producto[]
  onEditar: (producto: Producto) => void
  onCambiarStock: (producto: Producto) => void
  onEliminar: (producto: Producto) => void
}

const TablaProductos = ({
  productos,
  onEditar,
  onCambiarStock,
  onEliminar,
}: TablaProductosProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PRODUCTOS_POR_PAGINA,
  })

  const tabla = useReactTable({
    data: productos,
    columns: columnas,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            {tabla.getHeaderGroups().map((grupo) => (
              <tr key={grupo.id}>
                {grupo.headers.map((encabezado) => (
                  <th key={encabezado.id} className="px-4 py-3 font-medium">
                    {encabezado.isPlaceholder ? null : (
                      <button
                        type="button"
                        onClick={encabezado.column.getToggleSortingHandler()}
                        disabled={!encabezado.column.getCanSort()}
                        className="font-medium hover:text-gray-900"
                      >
                        {flexRender(encabezado.column.columnDef.header, encabezado.getContext())}
                        {INDICADOR_DE_ORDEN[encabezado.column.getIsSorted() as string] ?? null}
                      </button>
                    )}
                  </th>
                ))}
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-800">
            {tabla.getRowModel().rows.map((fila) => (
              <tr key={fila.id}>
                {fila.getVisibleCells().map((celda) => (
                  <td key={celda.id} className="px-4 py-3">
                    {flexRender(celda.column.columnDef.cell, celda.getContext())}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button variante="secundario" onClick={() => onEditar(fila.original)}>
                      Editar
                    </Button>
                    <Button variante="secundario" onClick={() => onCambiarStock(fila.original)}>
                      Stock
                    </Button>
                    <Button variante="peligro" onClick={() => onEliminar(fila.original)}>
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Paginacion
        pagina={tabla.getState().pagination.pageIndex}
        totalPaginas={tabla.getPageCount()}
        onCambiarPagina={tabla.setPageIndex}
      />
    </div>
  )
}

export default TablaProductos
