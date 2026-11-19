import { axiosInstance } from '@/shared/api/axiosInstance'
import type { FiltrosProductos, ProductosPaginados } from '@/features/productos/types/producto'

export async function obtenerProductos(
  filtros: FiltrosProductos,
): Promise<ProductosPaginados> {
  const { data } = await axiosInstance.get<ProductosPaginados>('/productos', {
    params: filtros,
  })
  return data
}
