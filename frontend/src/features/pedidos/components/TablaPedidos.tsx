import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo } from 'react'

import Paginacion from '../../../shared/components/Paginacion'
import BadgeEstado from '../../../shared/ui/BadgeEstado'
import Button from '../../../shared/ui/Button'
import { formatearFecha } from '../../../shared/utils/formatearFecha'
import { formatearPrecio } from '../../../shared/utils/formatearPrecio'
import { ESTADOS_PEDIDO, type EstadoPedido, type Pedido } from '../types/pedido'

const PEDIDOS_POR_PAGINA = 10

const AVANCE_POR_ESTADO: Partial<Record<EstadoPedido, { estado: EstadoPedido; etiqueta: string }>> = {
  [ESTADOS_PEDIDO.PENDIENTE]: { estado: ESTADOS_PEDIDO.EN_PREPARACION, etiqueta: 'Preparar' },
  [ESTADOS_PEDIDO.EN_PREPARACION]: { estado: ESTADOS_PEDIDO.ENTREGADO, etiqueta: 'Entregar' },
}

const columnHelper = createColumnHelper<Pedido>()

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
  const columnas = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'Pedido',
        cell: (celda) => `#${celda.getValue()}`,
      }),
      columnHelper.accessor('created_at', {
        header: 'Fecha',
        cell: (celda) => formatearFecha(celda.getValue()),
      }),
      columnHelper.accessor('usuario_id', {
        header: 'Usuario',
        cell: (celda) => `#${celda.getValue()}`,
      }),
      columnHelper.accessor('total', {
        header: 'Total',
        cell: (celda) => formatearPrecio(celda.getValue()),
      }),
      columnHelper.accessor('estado', {
        header: 'Estado',
        cell: (celda) => <BadgeEstado estado={celda.getValue()} />,
      }),
      columnHelper.display({
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => {
          const pedido = row.original
          const avance = AVANCE_POR_ESTADO[pedido.estado]
          const enProceso = pedidoEnProcesoId === pedido.id
          return (
            <div className="flex flex-wrap gap-2">
              <Button variante="secundario" onClick={() => onVerDetalle(pedido)}>
                Detalle
              </Button>
              {avance && (
                <Button
                  cargando={enProceso}
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
          )
        },
      }),
    ],
    [pedidoEnProcesoId, onVerDetalle, onAvanzar, onCancelar],
  )

  const tabla = useReactTable({
    data: pedidos,
    columns: columnas,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: PEDIDOS_POR_PAGINA } },
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
                    {flexRender(encabezado.column.columnDef.header, encabezado.getContext())}
                  </th>
                ))}
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

export default TablaPedidos
