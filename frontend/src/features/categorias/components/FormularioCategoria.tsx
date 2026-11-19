import { useForm } from '@tanstack/react-form'

import Button from '@/shared/ui/Button'
import Input from '@/shared/ui/Input'
import type { Categoria, CategoriaDatos } from '@/features/categorias/types/categoria'
import { validarNombreCategoria } from '@/features/categorias/validaciones'

interface ValoresFormularioCategoria {
  nombre: string
  descripcion: string
}

interface FormularioCategoriaProps {
  categoria: Categoria | null
  guardando: boolean
  error: string | null
  onGuardar: (datos: CategoriaDatos) => void
  onCancelar: () => void
}

const FormularioCategoria = ({
  categoria,
  guardando,
  error,
  onGuardar,
  onCancelar,
}: FormularioCategoriaProps) => {
  const valoresIniciales: ValoresFormularioCategoria = {
    nombre: categoria?.nombre ?? '',
    descripcion: categoria?.descripcion ?? '',
  }

  const formulario = useForm({
    defaultValues: valoresIniciales,
    onSubmit: ({ value }) => {
      onGuardar({
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim() || null,
      })
    },
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
        name="nombre"
        validators={{
          onChange: ({ value }) => validarNombreCategoria(value),
          onBlur: ({ value }) => validarNombreCategoria(value),
        }}
      >
        {(campo) => (
          <Input
            id={campo.name}
            label="Nombre"
            value={campo.state.value}
            onChange={(evento) => campo.handleChange(evento.target.value)}
            onBlur={campo.handleBlur}
            error={campo.state.meta.isTouched ? campo.state.meta.errors[0] : undefined}
          />
        )}
      </formulario.Field>
      <formulario.Field name="descripcion">
        {(campo) => (
          <div className="flex flex-col gap-1">
            <label htmlFor={campo.name} className="text-sm font-medium text-gray-700">
              Descripción (opcional)
            </label>
            <textarea
              id={campo.name}
              rows={3}
              value={campo.state.value}
              onChange={(evento) => campo.handleChange(evento.target.value)}
              onBlur={campo.handleBlur}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
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

export default FormularioCategoria
