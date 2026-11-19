import Card from '@/shared/ui/Card'

interface TarjetaResumenProps {
  titulo: string
  valor: string
  colorDelValor?: string
}

const TarjetaResumen = ({
  titulo,
  valor,
  colorDelValor = 'text-gray-900',
}: TarjetaResumenProps) => {
  return (
    <Card className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-500">{titulo}</span>
      <span className={`text-3xl font-bold ${colorDelValor}`}>{valor}</span>
    </Card>
  )
}

export default TarjetaResumen
