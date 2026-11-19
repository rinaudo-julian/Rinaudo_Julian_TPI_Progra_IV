import { useForm } from '@tanstack/react-form'

import Button from '@/shared/ui/Button'
import Input from '@/shared/ui/Input'
import type { Producto, StockDatos } from '@/features/productos/types/producto'
import { validarStock } from '@/features/productos/validaciones'

interface FormularioStockProps {
  producto: Producto
  guardando: boolean
  error: string | null
  onGuardar: (datos: StockDatos) => void
  onCancelar: () => void
}

const FormularioStock = ({
  producto,
  guardando,
  error,
  onGuardar,
  onCancelar,
}: FormularioStockProps) => {
  const valoresIniciales: StockDatos = {
    stock: producto.stock,
    disponible: producto.disponible,
  }

  const formulario = useForm({
    defaultValues: valoresIniciales,
    onSubmit: ({ value }) => onGuardar(value),
  })

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(evento) => {
        evento.preventDefault()
        void formulario.handleSubmit()
      }}
    >
      <formulario.Field
        name="stock"
        validators={{ onChange: ({ value }) => validarStock(value) }}
      >
        {(campo) => (
          <Input
            id={campo.name}
            label="Stock"
            type="number"
            min={0}
            step={1}
            value={campo.state.value}
            onChange={(evento) => campo.handleChange(Number(evento.target.value))}
            onBlur={campo.handleBlur}
            error={campo.state.meta.isTouched ? campo.state.meta.errors[0] : undefined}
          />
        )}
      </formulario.Field>
      <formulario.Field name="disponible">
        {(campo) => (
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={campo.state.value}
              onChange={(evento) => campo.handleChange(evento.target.checked)}
              onBlur={campo.handleBlur}
              className="accent-orange-500"
            />
            Disponible para la venta
          </label>
        )}
      </formulario.Field>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" cargando={guardando}>
          Guardar
        </Button>
        <Button type="button" variante="secundario" onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

export default FormularioStock
