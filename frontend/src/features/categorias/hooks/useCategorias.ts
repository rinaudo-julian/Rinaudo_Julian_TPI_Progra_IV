import { useQuery } from '@tanstack/react-query'

import { obtenerCategorias } from '@/features/categorias/api/categorias'

export function useCategorias() {
  return useQuery({ queryKey: ['categorias'], queryFn: obtenerCategorias })
}
