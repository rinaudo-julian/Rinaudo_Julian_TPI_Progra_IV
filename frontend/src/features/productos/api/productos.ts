import { axiosInstance } from '@/shared/api/axiosInstance'
import type {
  FiltrosProductos,
  Producto,
  ProductoDatos,
  ProductosPaginados,
  StockDatos,
} from '@/features/productos/types/producto'

export async function obtenerProductos(
  filtros: FiltrosProductos,
): Promise<ProductosPaginados> {
  const { data } = await axiosInstance.get<ProductosPaginados>('/productos', {
    params: filtros,
  })
  return data
}

export async function crearProducto(datos: ProductoDatos): Promise<Producto> {
  const { data } = await axiosInstance.post<Producto>('/productos', datos)
  return data
}

export async function actualizarProducto({
  id,
  datos,
}: {
  id: number
  datos: ProductoDatos
}): Promise<Producto> {
  const { data } = await axiosInstance.put<Producto>(`/productos/${id}`, datos)
  return data
}

export async function actualizarStockProducto({
  id,
  datos,
}: {
  id: number
  datos: StockDatos
}): Promise<Producto> {
  const { data } = await axiosInstance.patch<Producto>(`/productos/${id}/stock`, datos)
  return data
}

export async function eliminarProducto(id: number): Promise<void> {
  await axiosInstance.delete(`/productos/${id}`)
}
