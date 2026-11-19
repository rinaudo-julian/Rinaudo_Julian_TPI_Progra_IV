import { useMutation } from '@tanstack/react-query'

import { registrarUsuario } from '../api/auth'

export function useRegistrar() {
  return useMutation({ mutationFn: registrarUsuario })
}
