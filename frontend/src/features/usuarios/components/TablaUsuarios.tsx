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
import type { Usuario } from '@/features/auth/types/usuario'

const USUARIOS_POR_PAGINA = 10

const INDICADOR_DE_ORDEN: Record<string, string> = { asc: ' ▲', desc: ' ▼' }

const columnHelper = createColumnHelper<Usuario>()

const columnas = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => `#${info.getValue()}`,
  }),
  columnHelper.accessor('username', { header: 'Usuario' }),
  columnHelper.accessor('full_name', { header: 'Nombre' }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('role', { header: 'Rol' }),
  columnHelper.accessor('disabled', {
    header: 'Estado',
    cell: (info) => (
      <>
        {info.getValue() && (
          <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700">
            Desactivado
          </span>
        )}
        {!info.getValue() && (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Activo
          </span>
        )}
      </>
    ),
  }),
]

interface TablaUsuariosProps {
  usuarios: Usuario[]
  usuarioDeLaSesionId: number | undefined
  usuarioEnProcesoId: number | null
  onActivar: (usuario: Usuario) => void
  onDesactivar: (usuario: Usuario) => void
}

const TablaUsuarios = ({
  usuarios,
  usuarioDeLaSesionId,
  usuarioEnProcesoId,
  onActivar,
  onDesactivar,
}: TablaUsuariosProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: USUARIOS_POR_PAGINA,
  })

  const tabla = useReactTable({
    data: usuarios,
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
              const usuario = fila.original
              const esLaSesion = usuario.id === usuarioDeLaSesionId
              return (
                <tr key={fila.id}>
                  {fila.getVisibleCells().map((celda) => (
                    <td key={celda.id} className="px-4 py-3">
                      {flexRender(celda.column.columnDef.cell, celda.getContext())}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    {usuario.disabled && (
                      <Button
                        cargando={usuarioEnProcesoId === usuario.id}
                        disabled={usuarioEnProcesoId !== null}
                        onClick={() => onActivar(usuario)}
                      >
                        Activar
                      </Button>
                    )}
                    {!usuario.disabled && !esLaSesion && (
                      <Button
                        variante="peligro"
                        cargando={usuarioEnProcesoId === usuario.id}
                        disabled={usuarioEnProcesoId !== null}
                        onClick={() => onDesactivar(usuario)}
                      >
                        Desactivar
                      </Button>
                    )}
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

export default TablaUsuarios
