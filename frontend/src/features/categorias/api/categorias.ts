import { axiosInstance } from '@/shared/api/axiosInstance'
import type { Categoria } from '@/features/categorias/types/categoria'

export async function obtenerCategorias(): Promise<Categoria[]> {
  const { data } = await axiosInstance.get<Categoria[]>('/categorias')
  return data
}
