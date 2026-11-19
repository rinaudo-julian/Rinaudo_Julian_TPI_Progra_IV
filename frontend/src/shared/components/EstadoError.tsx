import Button from '@/shared/ui/Button'

interface EstadoErrorProps {
  mensaje: string
  onReintentar?: () => void
}

const EstadoError = ({ mensaje, onReintentar }: EstadoErrorProps) => {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
      <p className="text-red-700">{mensaje}</p>
      {onReintentar && (
        <Button variante="secundario" onClick={onReintentar}>
          Reintentar
        </Button>
      )}
    </div>
  )
}

export default EstadoError
