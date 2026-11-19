import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ItemCarrito {
  producto_id: number
  nombre: string
  precio_unitario: number
  cantidad: number
}

interface CartState {
  items: ItemCarrito[]
  agregar: (item: Omit<ItemCarrito, 'cantidad'>, cantidad?: number) => void
  quitar: (productoId: number) => void
  cambiarCantidad: (productoId: number, cantidad: number) => void
  vaciar: () => void
  total: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      agregar: (item, cantidad = 1) =>
        set((estado) => {
          const existente = estado.items.find(
            (itemActual) => itemActual.producto_id === item.producto_id,
          )
          if (existente) {
            return {
              items: estado.items.map((itemActual) =>
                itemActual.producto_id === item.producto_id
                  ? { ...itemActual, cantidad: itemActual.cantidad + cantidad }
                  : itemActual,
              ),
            }
          }
          return { items: [...estado.items, { ...item, cantidad }] }
        }),
      quitar: (productoId) =>
        set((estado) => ({
          items: estado.items.filter(
            (itemActual) => itemActual.producto_id !== productoId,
          ),
        })),
      cambiarCantidad: (productoId, cantidad) =>
        set((estado) => ({
          items:
            cantidad < 1
              ? estado.items.filter(
                  (itemActual) => itemActual.producto_id !== productoId,
                )
              : estado.items.map((itemActual) =>
                  itemActual.producto_id === productoId
                    ? { ...itemActual, cantidad }
                    : itemActual,
                ),
        })),
      vaciar: () => set({ items: [] }),
      total: () =>
        get().items.reduce(
          (suma, itemActual) =>
            suma + itemActual.precio_unitario * itemActual.cantidad,
          0,
        ),
    }),
    { name: 'carrito' },
  ),
)
