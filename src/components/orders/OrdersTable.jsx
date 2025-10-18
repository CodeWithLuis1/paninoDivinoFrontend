// src/components/orders/OrdersTable.jsx
import { useMemo } from "react";

export default function OrdersTable({ rows = [], loading, onResume, onClose }) {
  const empty = !loading && rows.length === 0;

  const body = useMemo(
    () =>
      rows.map((r) => (
        <tr key={r.id} className="border-b">
          <td className="px-3 py-2 font-mono">#{String(r.numero_dia ?? r.numero_orden).padStart(2,"0")}</td>
          <td className="px-3 py-2">{r.cliente || "—"}</td>
          <td className="px-3 py-2">{r.estado}</td>
          <td className="px-3 py-2">Q{Number(r.total || 0).toFixed(2)}</td>
          <td className="px-3 py-2 flex gap-2">
            <button
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => onResume?.(r)}
            >
              Reanudar
            </button>
            {r.estado !== "LISTO" && (
              <button
                className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                onClick={() => onClose?.(r)}
              >
                Cerrar
              </button>
            )}
          </td>
        </tr>
      )),
    [rows, onResume, onClose]
  );

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left bg-gray-50">
            <tr>
              <th className="px-3 py-2">N° Orden</th>
              <th className="px-3 py-2">Cliente</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-3 py-6 text-center" colSpan={5}>Cargando…</td></tr>
            ) : empty ? (
              <tr><td className="px-3 py-6 text-center" colSpan={5}>Sin pedidos</td></tr>
            ) : (
              body
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
