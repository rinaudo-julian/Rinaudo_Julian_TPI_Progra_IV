import Button from '../ui/Button'

interface PaginacionProps {
  pagina: number
  totalPaginas: number
  onCambiarPagina: (pagina: number) => void
}

function Paginacion({ pagina, totalPaginas, onCambiarPagina }: PaginacionProps) {
  if (totalPaginas <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variante="secundario"
        disabled={pagina === 0}
        onClick={() => onCambiarPagina(pagina - 1)}
      >
        Anterior
      </Button>
      <span className="text-sm text-gray-600">
        Página {pagina + 1} de {totalPaginas}
      </span>
      <Button
        variante="secundario"
        disabled={pagina >= totalPaginas - 1}
        onClick={() => onCambiarPagina(pagina + 1)}
      >
        Siguiente
      </Button>
    </div>
  )
}

export default Paginacion
