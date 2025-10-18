import React from "react";

export default function OrderSummaryModal({ open, resumen, onClose, onCharge }) {
  if (!open) return null;
  const { numero = "00", cliente = "Sin nombre", items = [], subtotal = 0, servicio = 0, total = 0 } = resumen || {};

  const parents = items.filter((it) => !it.parent_item_id);
  const childrenBy = items.reduce((acc, it) => {
    if (it.parent_item_id) (acc[it.parent_item_id] ||= []).push(it);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold">Confirmar pedido</h2>
        <div className="text-sm text-gray-600 mt-1">N° #{numero} — {cliente}</div>

        <div className="mt-4 max-h-72 overflow-auto space-y-3">
          {parents.map((it) => (
            <div key={it.id} className="border-b pb-2 last:border-none">
              <div className="flex justify-between">
                <div className="font-medium">{it.nombre}</div>
                <div>Q{(it.total || 0).toFixed(2)}</div>
              </div>
              {Array.isArray(childrenBy[it.id]) && childrenBy[it.id].length > 0 && (
                <ul className="mt-1 text-sm text-ink-600 space-y-0.5">
                  {childrenBy[it.id].map((ch) => (
                    <li key={ch.id} className="flex justify-between">
                      <span>{ch.nombre}</span>
                      <span>Q{(ch.total || 0).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>Q{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Servicio 10%</span><span>Q{servicio.toFixed(2)}</span></div>
          <div className="flex justify-between font-semibold pt-1 border-t">
            <span>Total</span><span>Q{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button className="px-4 py-2 rounded-lg border hover:bg-gray-50" onClick={onClose}>Cancelar</button>
          <button className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            onClick={onCharge}>
            Guardar y cobrar
          </button>
        </div>
      </div>
    </div>
  );
}
