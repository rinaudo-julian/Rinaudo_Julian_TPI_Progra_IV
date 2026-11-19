import { useQuery } from '@tanstack/react-query'

import { obtenerUsuarios } from '@/features/usuarios/api/usuarios'

export function useUsuarios() {
  return useQuery({ queryKey: ['usuarios'], queryFn: obtenerUsuarios })
}
