import { axiosInstance } from '@/shared/api/axiosInstance'
import type { Categoria, CategoriaDatos } from '@/features/categorias/types/categoria'

export async function obtenerCategorias(): Promise<Categoria[]> {
  const { data } = await axiosInstance.get<Categoria[]>('/categorias')
  return data
}

export async function crearCategoria(datos: CategoriaDatos): Promise<Categoria> {
  const { data } = await axiosInstance.post<Categoria>('/categorias', datos)
  return data
}

export async function actualizarCategoria({
  id,
  datos,
}: {
  id: number
  datos: CategoriaDatos
}): Promise<Categoria> {
  const { data } = await axiosInstance.put<Categoria>(`/categorias/${id}`, datos)
  return data
}

export async function eliminarCategoria(id: number): Promise<void> {
  await axiosInstance.delete(`/categorias/${id}`)
}
