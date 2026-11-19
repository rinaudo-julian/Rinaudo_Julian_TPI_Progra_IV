import { useState } from "react";

import { handleApiError } from "@/shared/api/handleApiError";
import EstadoError from "@/shared/components/EstadoError";
import EstadoVacio from "@/shared/components/EstadoVacio";
import Skeleton from "@/shared/components/Skeleton";
import Button from "@/shared/ui/Button";
import Modal from "@/shared/ui/Modal";
import DetallePedido from "@/features/pedidos/components/DetallePedido";
import TablaPedidos from "@/features/pedidos/components/TablaPedidos";
import { useCambiarEstadoPedido } from "@/features/pedidos/hooks/useCambiarEstadoPedido";
import { usePedidos } from "@/features/pedidos/hooks/usePedidos";
import {
  ESTADOS_PEDIDO,
  type EstadoPedido,
  type Pedido
} from "@/features/pedidos/types/pedido";

const LIMITE_DEL_PANEL = 100;

const AdminPedidosPage = () => {
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoPedido | undefined>(
    undefined
  );
  const [pedidoEnDetalle, setPedidoEnDetalle] = useState<Pedido | null>(null);
  const [pedidoACancelar, setPedidoACancelar] = useState<Pedido | null>(null);

  const pedidos = usePedidos({
    skip: 0,
    limit: LIMITE_DEL_PANEL,
    estado: estadoFiltro
  });
  const cambiarEstado = useCambiarEstadoPedido();

  const pedidoEnProcesoId = cambiarEstado.isPending
    ? cambiarEstado.variables.id
    : null;

  const cambiarFiltro = (valor: string) => {
    setEstadoFiltro(valor === "" ? undefined : (valor as EstadoPedido));
  };

  const avanzar = (pedido: Pedido, nuevoEstado: EstadoPedido) => {
    cambiarEstado.mutate({ id: pedido.id, estado: nuevoEstado });
  };

  const abrirCancelacion = (pedido: Pedido) => {
    cambiarEstado.reset();
    setPedidoACancelar(pedido);
  };

  const confirmarCancelacion = (pedido: Pedido) => {
    cambiarEstado.mutate(
      { id: pedido.id, estado: ESTADOS_PEDIDO.CANCELADO },
      { onSuccess: () => setPedidoACancelar(null) }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Pedidos</h1>
        <select
          aria-label="Filtrar por estado"
          value={estadoFiltro ?? ""}
          onChange={(evento) => cambiarFiltro(evento.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="">Todos los estados</option>
          {Object.values(ESTADOS_PEDIDO).map((estado) => (
            <option key={estado}>{estado}</option>
          ))}
        </select>
      </div>

      {cambiarEstado.isError && pedidoACancelar === null && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {handleApiError(cambiarEstado.error)}
        </p>
      )}

      {pedidos.isPending && <Skeleton className="h-64" />}
      {pedidos.isError && (
        <EstadoError
          mensaje={handleApiError(pedidos.error)}
          onReintentar={() => void pedidos.refetch()}
        />
      )}
      {pedidos.isSuccess && pedidos.data.items.length === 0 && (
        <EstadoVacio mensaje="No hay pedidos para mostrar." />
      )}
      {pedidos.isSuccess && pedidos.data.items.length > 0 && (
        <div className={`transition-opacity ${pedidos.isPlaceholderData ? 'opacity-60' : ''}`}>
          <TablaPedidos
            pedidos={pedidos.data.items}
            pedidoEnProcesoId={pedidoEnProcesoId}
            onVerDetalle={setPedidoEnDetalle}
            onAvanzar={avanzar}
            onCancelar={abrirCancelacion}
          />
        </div>
      )}

      <Modal
        titulo={pedidoEnDetalle ? `Pedido #${pedidoEnDetalle.id}` : ""}
        abierto={pedidoEnDetalle !== null}
        onCerrar={() => setPedidoEnDetalle(null)}
      >
        {pedidoEnDetalle && <DetallePedido pedido={pedidoEnDetalle} />}
      </Modal>

      <Modal
        titulo={pedidoACancelar ? `Cancelar pedido #${pedidoACancelar.id}` : ""}
        abierto={pedidoACancelar !== null}
        onCerrar={() => setPedidoACancelar(null)}
      >
        {pedidoACancelar && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-700">
              ¿Seguro que querés cancelar este pedido? El stock de sus productos
              se va a restituir.
            </p>
            {cambiarEstado.isError && (
              <p className="text-sm text-red-600">
                {handleApiError(cambiarEstado.error)}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                variante="peligro"
                cargando={cambiarEstado.isPending}
                onClick={() => confirmarCancelacion(pedidoACancelar)}
              >
                Sí, cancelar
              </Button>
              <Button
                variante="secundario"
                onClick={() => setPedidoACancelar(null)}
              >
                Volver
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminPedidosPage;
