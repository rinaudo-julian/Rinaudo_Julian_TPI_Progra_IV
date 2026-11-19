import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { obtenerProductos } from '../api/productos'
import type { FiltrosProductos } from '../types/producto'

export function useProductos(filtros: FiltrosProductos) {
  return useQuery({
    queryKey: ['productos', filtros],
    queryFn: () => obtenerProductos(filtros),
    placeholderData: keepPreviousData,
  })
}
