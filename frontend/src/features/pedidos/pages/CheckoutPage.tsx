import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from 'react-router-dom'

import { handleApiError } from '@/shared/api/handleApiError'
import EstadoVacio from '@/shared/components/EstadoVacio'
import Button from '@/shared/ui/Button'
import Card from '@/shared/ui/Card'
import Input from '@/shared/ui/Input'
import { useAuthStore } from '@/store/authStore'
import { ROLES } from '@/features/auth/types/usuario'
import { useCartStore } from '@/store/cartStore'
import ResumenCarrito from '@/features/pedidos/components/ResumenCarrito'
import { useCrearPedido } from '@/features/pedidos/hooks/useCrearPedido'
import { FORMAS_PAGO, type FormaPago } from '@/features/pedidos/types/pedido'

const FORMAS_DE_PAGO: { valor: FormaPago; etiqueta: string }[] = [
  { valor: FORMAS_PAGO.EFECTIVO, etiqueta: 'Efectivo' },
  { valor: FORMAS_PAGO.TRANSFERENCIA, etiqueta: 'Transferencia' },
]

interface FormularioCheckout {
  direccion_entrega: string
  forma_pago: FormaPago
  notas: string
}

const VALORES_INICIALES: FormularioCheckout = {
  direccion_entrega: '',
  forma_pago: FORMAS_PAGO.EFECTIVO,
  notas: '',
}

function validarDireccion(direccion: string): string | undefined {
  const largo = direccion.trim().length
  if (largo < 5) return 'Mínimo 5 caracteres'
  if (largo > 200) return 'Máximo 200 caracteres'
  return undefined
}

const CheckoutPage = () => {
  const items = useCartStore((estado) => estado.items)
  const total = useCartStore((estado) => estado.total())
  const vaciar = useCartStore((estado) => estado.vaciar)
  const usuario = useAuthStore((estado) => estado.usuario)
  const crearPedido = useCrearPedido()
  const navigate = useNavigate()

  const formulario = useForm({
    defaultValues: VALORES_INICIALES,
    onSubmit: ({ value }) => {
      crearPedido.mutate(
        {
          items: items.map((item) => ({
            producto_id: item.producto_id,
            cantidad: item.cantidad,
          })),
          forma_pago: value.forma_pago,
          direccion_entrega: value.direccion_entrega.trim(),
          notas: value.notas.trim() || null,
        },
        {
          onSuccess: () => {
            const destino = usuario?.role === ROLES.ADMIN ? '/admin/pedidos' : '/mis-pedidos'
            navigate(destino, { replace: true })
            vaciar()
          },
        },
      )
    },
  })

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-800">Confirmar pedido</h1>
        <EstadoVacio mensaje="No hay productos en el carrito para confirmar." />
        <Link to="/" className="text-center text-orange-600 hover:underline">
          Ir al catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-800">Confirmar pedido</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <form
            noValidate
            className="flex flex-col gap-4"
            onSubmit={(evento) => {
              evento.preventDefault()
              void formulario.handleSubmit()
            }}
          >
            <formulario.Field
              name="direccion_entrega"
              validators={{ onChange: ({ value }) => validarDireccion(value) }}
              children={(campo) => (
                <Input
                  id={campo.name}
                  label="Dirección de entrega"
                  autoComplete="street-address"
                  value={campo.state.value}
                  onChange={(evento) => campo.handleChange(evento.target.value)}
                  onBlur={campo.handleBlur}
                  error={campo.state.meta.isTouched ? campo.state.meta.errors[0] : undefined}
                />
              )}
            />
            <formulario.Field
              name="forma_pago"
              children={(campo) => (
                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-1 text-sm font-medium text-gray-700">
                    Forma de pago
                  </legend>
                  {FORMAS_DE_PAGO.map((forma) => (
                    <label key={forma.valor} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name={campo.name}
                        value={forma.valor}
                        checked={campo.state.value === forma.valor}
                        onChange={() => campo.handleChange(forma.valor)}
                        className="accent-orange-500"
                      />
                      {forma.etiqueta}
                    </label>
                  ))}
                </fieldset>
              )}
            />
            <formulario.Field
              name="notas"
              children={(campo) => (
                <div className="flex flex-col gap-1">
                  <label htmlFor={campo.name} className="text-sm font-medium text-gray-700">
                    Notas (opcional)
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
            />
            {crearPedido.isError && (
              <p className="text-sm text-red-600">{handleApiError(crearPedido.error)}</p>
            )}
            <Button type="submit" cargando={crearPedido.isPending}>
              Confirmar pedido
            </Button>
          </form>
        </Card>
        <Card className="h-fit">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Resumen</h2>
          <ResumenCarrito items={items} total={total} />
          <Link to="/carrito" className="mt-4 block text-sm text-orange-600 hover:underline">
            Modificar carrito
          </Link>
        </Card>
      </div>
    </div>
  )
}

export default CheckoutPage
