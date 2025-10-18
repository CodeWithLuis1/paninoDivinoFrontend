// src/pages/PedidosPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrdersTable from "../components/orders/OrdersTable";
import NewOrderModal from "../components/orders/NewOrderModal";
import { getPedidos } from "../api/pedidos";

export default function PedidosPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openNew, setOpenNew] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const r = await getPedidos(); // puedes pasar { estado: 'ABIERTO' | 'LISTO' }
      setRows(r?.data || r || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <button
          className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => setOpenNew(true)}
        >
          + Nuevo pedido
        </button>
      </div>

      <OrdersTable
        rows={rows}
        loading={loading}
        onResume={(r) => navigate(`/pedidos/${r.id}`)}
        onClose={(r) => navigate(`/pedidos/${r.id}?accion=cerrar`)} // placeholder
      />

      <NewOrderModal
        open={openNew}
        onClose={() => setOpenNew(false)}
        onCreated={() => load()}
        navigate={navigate}
      />
    </div>
  );
}
