import { useEffect, useState, useCallback } from "react";
import { createPedido, getNextOrderNumber } from "../../api/pedidos";

export default function NewOrderModal({ open, onClose, onCreated, navigate }) {
  const [nextNumber, setNextNumber] = useState(null);
  const [cliente, setCliente] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadNextNumber = useCallback(async () => {
    try {
      if (typeof getNextOrderNumber === "function") {
        const n = await getNextOrderNumber();
        setNextNumber(n ?? null);
      } else {
        setNextNumber(null); // fallback si no existe el endpoint aún
      }
    } catch {
      setNextNumber(null);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setCliente("");
    setSubmitting(false);
    loadNextNumber();
  }, [open, loadNextNumber]);

  if (!open) return null;

  const handleStart = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const nombre = cliente?.trim() || "Sin nombre";
      const out = await createPedido({ cliente: nombre });
      onCreated?.();                 // refresca tabla de pedidos
      navigate?.(`/pedidos/${out.id}`); // abre editor por id
      onClose?.();                   // cierra modal
    } catch (e) {
      console.error(e);
      alert("No se pudo iniciar el pedido");
    } finally {
      setSubmitting(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleStart();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Iniciar nuevo pedido</h2>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">N° de orden del día (auto)</label>
            <div className="mt-1 font-mono text-lg">
              {nextNumber != null ? `#${String(nextNumber).padStart(2, "0")}` : "—"}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Nombre del cliente</label>
            <input
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Escribir nombre aquí…"
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring"
              autoFocus
              disabled={submitting}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg border hover:bg-gray-50"
            onClick={onClose}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            onClick={handleStart}
            disabled={submitting}
          >
            {submitting ? "Creando…" : "Iniciar pedido"}
          </button>
        </div>
      </div>
    </div>
  );
}
