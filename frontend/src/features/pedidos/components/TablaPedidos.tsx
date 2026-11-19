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
import BadgeEstado from '@/shared/ui/BadgeEstado'
import Button from '@/shared/ui/Button'
import { formatearFecha } from '@/shared/utils/formatearFecha'
import { formatearPrecio } from '@/shared/utils/formatearPrecio'
import { ESTADOS_PEDIDO, type EstadoPedido, type Pedido } from '@/features/pedidos/types/pedido'

const PEDIDOS_POR_PAGINA = 10

const AVANCE_POR_ESTADO: Partial<Record<EstadoPedido, { estado: EstadoPedido; etiqueta: string }>> = {
  [ESTADOS_PEDIDO.PENDIENTE]: { estado: ESTADOS_PEDIDO.EN_PREPARACION, etiqueta: 'Preparar' },
  [ESTADOS_PEDIDO.EN_PREPARACION]: { estado: ESTADOS_PEDIDO.ENTREGADO, etiqueta: 'Entregar' },
}

const INDICADOR_DE_ORDEN: Record<string, string> = { asc: ' ▲', desc: ' ▼' }

const columnHelper = createColumnHelper<Pedido>()

const columnas = [
  columnHelper.accessor('id', {
    header: 'Pedido',
    cell: (info) => `#${info.getValue()}`,
  }),
  columnHelper.accessor('created_at', {
    header: 'Fecha',
    cell: (info) => formatearFecha(info.getValue()),
  }),
  columnHelper.accessor('usuario_id', {
    header: 'Usuario',
    cell: (info) => `#${info.getValue()}`,
  }),
  columnHelper.accessor('total', {
    header: 'Total',
    cell: (info) => formatearPrecio(info.getValue()),
  }),
  columnHelper.accessor('estado', {
    header: 'Estado',
    cell: (info) => <BadgeEstado estado={info.getValue()} />,
  }),
]

interface TablaPedidosProps {
  pedidos: Pedido[]
  pedidoEnProcesoId: number | null
  onVerDetalle: (pedido: Pedido) => void
  onAvanzar: (pedido: Pedido, nuevoEstado: EstadoPedido) => void
  onCancelar: (pedido: Pedido) => void
}

const TablaPedidos = ({
  pedidos,
  pedidoEnProcesoId,
  onVerDetalle,
  onAvanzar,
  onCancelar,
}: TablaPedidosProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PEDIDOS_POR_PAGINA,
  })

  const tabla = useReactTable({
    data: pedidos,
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
            {tabla.getRowModel().rows.map((fila) => {
              const pedido = fila.original
              const avance = AVANCE_POR_ESTADO[pedido.estado]
              return (
                <tr key={fila.id}>
                  {fila.getVisibleCells().map((celda) => (
                    <td key={celda.id} className="px-4 py-3">
                      {flexRender(celda.column.columnDef.cell, celda.getContext())}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button variante="secundario" onClick={() => onVerDetalle(pedido)}>
                        Detalle
                      </Button>
                      {avance && (
                        <Button
                          cargando={pedidoEnProcesoId === pedido.id}
                          disabled={pedidoEnProcesoId !== null}
                          onClick={() => onAvanzar(pedido, avance.estado)}
                        >
                          {avance.etiqueta}
                        </Button>
                      )}
                      {avance && (
                        <Button
                          variante="peligro"
                          disabled={pedidoEnProcesoId !== null}
                          onClick={() => onCancelar(pedido)}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
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

export default TablaPedidos
