// src/components/clients/ClientsTable.jsx
import { useMemo } from "react";

export default function ClientsTable({ rows = [], loading }) {
  const empty = !loading && rows.length === 0;

  const body = useMemo(
    () =>
      rows.map((client) => (
        <tr key={client.id_client} className="border-b">
          {/* ID */}
          <td className="px-3 py-2 font-mono">
            #{String(client.id_client).padStart(2, "0")}
          </td>

          {/* Nombre del cliente */}
          <td className="px-3 py-2">
            {client.client_name || "—"}
          </td>
        </tr>
      )),
    [rows]
  );

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left bg-gray-50">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Cliente</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="px-3 py-6 text-center" colSpan={5}>
                  Cargando…
                </td>
              </tr>
            ) : empty ? (
              <tr>
                <td className="px-3 py-6 text-center" colSpan={5}>
                  Sin clientes
                </td>
              </tr>
            ) : (
              body
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
