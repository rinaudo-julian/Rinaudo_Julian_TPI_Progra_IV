import type { ButtonHTMLAttributes } from 'react'

type Variante = 'primario' | 'secundario' | 'peligro'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
  cargando?: boolean
}

const ESTILOS_POR_VARIANTE: Record<Variante, string> = {
  primario: 'bg-orange-500 text-white hover:bg-orange-600',
  secundario: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
  peligro: 'bg-red-600 text-white hover:bg-red-700',
}

function Button({
  variante = 'primario',
  cargando = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || cargando}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${ESTILOS_POR_VARIANTE[variante]} ${className}`}
      {...props}
    >
      {cargando ? 'Procesando...' : children}
    </button>
  )
}

export default Button
