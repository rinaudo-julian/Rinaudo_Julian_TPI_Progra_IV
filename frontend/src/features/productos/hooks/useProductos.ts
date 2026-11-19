import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { obtenerProductos } from '@/features/productos/api/productos'
import type { FiltrosProductos } from '@/features/productos/types/producto'

export function useProductos(filtros: FiltrosProductos) {
  return useQuery({
    queryKey: ['productos', filtros],
    queryFn: () => obtenerProductos(filtros),
    placeholderData: keepPreviousData,
  })
}
