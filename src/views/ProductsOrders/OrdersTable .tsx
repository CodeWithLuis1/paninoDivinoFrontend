import React, { useState } from "react";
import { RefreshCw, X, Eye, Plus } from "lucide-react";
import NewOrderModal from "@/views/ProductsOrders/NewOrderModal.js";
import { getOrderAPI } from "@/api/OrdersAPI.js";
import type { OrderListFormData } from "@/schemas/types.js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const OrdersTable = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<OrderListFormData[]>({
    queryKey: ["orders"],
    queryFn: getOrderAPI,
  });

  const [showModal, setShowModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "pending":
        return "bg-orange-100 text-orange-800 border border-orange-300";
      case "completed":
        return "bg-green-100 text-green-800 border border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  if (isLoading) return <p>Cargando pedidos...</p>;
  if (isError) return <p>Error al cargar los pedidos</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="max-w-6xl w-full">
        <div className="table-container">
          {/* Header */}
          <div className="table-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="table-title">Lista de Pedidos</h2>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary whitespace-nowrap flex items-center gap-2"
            >
              <Plus size={18} />
              Nuevo Pedido
            </button>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            {data && data.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>N° Orden</th>
                    <th>Cliente</th>
                    <th>Estado</th>
                    <th>Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((order) => (
                    <tr
                      key={order.id_order}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-gray-800 font-semibold text-center">
                        {order.order_number}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {order.client?.client_name || "—"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-800 font-bold text-center">
                        Q{(order.total_cents / 100).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                        <Link
                          to="/orders/menu"
                          state={{
                            orderNumber: order.order_number,
                            clientName: order.client?.client_name,
                            idOrder: order.id_order,
                          }}
                          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                        >
                          <RefreshCw size={16} />
                          <span className="hidden lg:inline">Reanudar</span>
                        </Link>
                          <button className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium">
                            <X size={16} />
                            <span className="hidden lg:inline">Cerrar</span>
                          </button>
                          <button className="flex items-center gap-1.5 bg-slate-600 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-sm font-medium">
                            <Eye size={16} />
                            <span className="hidden lg:inline">Detalle</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center py-10 text-gray-500">
                No hay pedidos registrados.
              </p>
            )}
          </div>

          <div className="mt-4 text-center text-gray-500 text-sm">
            Mostrando {data?.length || 0} pedidos
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <NewOrderModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default OrdersTable;
