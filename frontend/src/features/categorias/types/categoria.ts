export interface Categoria {
  id: number
  nombre: string
  descripcion: string | null
  activo: boolean
}

export interface CategoriaDatos {
  nombre: string
  descripcion: string | null
}
