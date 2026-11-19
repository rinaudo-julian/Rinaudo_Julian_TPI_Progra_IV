import { useForm } from '@tanstack/react-form'

import Button from '@/shared/ui/Button'
import Input from '@/shared/ui/Input'
import { useCategorias } from '@/features/categorias/hooks/useCategorias'
import type { Producto, ProductoDatos } from '@/features/productos/types/producto'
import {
  validarCategoria,
  validarNombreProducto,
  validarPrecio,
} from '@/features/productos/validaciones'

interface ValoresFormularioProducto {
  nombre: string
  descripcion: string
  precio_base: number
  imagen_url: string
  categoria_id: number
}

interface FormularioProductoProps {
  producto: Producto | null
  guardando: boolean
  error: string | null
  onGuardar: (datos: ProductoDatos) => void
  onCancelar: () => void
}

const FormularioProducto = ({
  producto,
  guardando,
  error,
  onGuardar,
  onCancelar,
}: FormularioProductoProps) => {
  const categorias = useCategorias()

  const valoresIniciales: ValoresFormularioProducto = {
    nombre: producto?.nombre ?? '',
    descripcion: producto?.descripcion ?? '',
    precio_base: producto?.precio_base ?? 0,
    imagen_url: producto?.imagen_url ?? '',
    categoria_id: producto?.categoria_id ?? 0,
  }

  const formulario = useForm({
    defaultValues: valoresIniciales,
    onSubmit: ({ value }) => {
      onGuardar({
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim() || null,
        precio_base: value.precio_base,
        imagen_url: value.imagen_url.trim() || null,
        categoria_id: value.categoria_id,
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
          onChange: ({ value }) => validarNombreProducto(value),
          onBlur: ({ value }) => validarNombreProducto(value),
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
      <formulario.Field
        name="precio_base"
        validators={{ onChange: ({ value }) => validarPrecio(value) }}
      >
        {(campo) => (
          <Input
            id={campo.name}
            label="Precio"
            type="number"
            min={0}
            step="0.01"
            value={campo.state.value}
            onChange={(evento) => campo.handleChange(Number(evento.target.value))}
            onBlur={campo.handleBlur}
            error={campo.state.meta.isTouched ? campo.state.meta.errors[0] : undefined}
          />
        )}
      </formulario.Field>
      <formulario.Field name="imagen_url">
        {(campo) => (
          <Input
            id={campo.name}
            label="URL de la imagen (opcional)"
            type="url"
            value={campo.state.value}
            onChange={(evento) => campo.handleChange(evento.target.value)}
            onBlur={campo.handleBlur}
          />
        )}
      </formulario.Field>
      <formulario.Field
        name="categoria_id"
        validators={{
          onChange: ({ value }) => validarCategoria(value),
          onBlur: ({ value }) => validarCategoria(value),
        }}
      >
        {(campo) => (
          <div className="flex flex-col gap-1">
            <label htmlFor={campo.name} className="text-sm font-medium text-gray-700">
              Categoría
            </label>
            <select
              id={campo.name}
              value={campo.state.value}
              onChange={(evento) => campo.handleChange(Number(evento.target.value))}
              onBlur={campo.handleBlur}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value={0}>Elegí una categoría</option>
              {categorias.data?.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            {campo.state.meta.isTouched && campo.state.meta.errors[0] && (
              <p className="text-xs text-red-600">{campo.state.meta.errors[0]}</p>
            )}
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

export default FormularioProducto
