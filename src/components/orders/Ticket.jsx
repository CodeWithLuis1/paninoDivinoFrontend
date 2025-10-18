import React from "react";

export default function Ticket({
  items = [],
  serviceRate = 0.10,
  onRemove,      // (item) => void
  onQtyChange,   // (item, nextQty) => void
  onModify,      // () => void   ← NUEVO (antes era onAddMore)
  onConfirm,     // () => void
}) {
  const parents = items.filter((it) => !it.parent_item_id);
  const childrenBy = items.reduce((acc, it) => {
    if (it.parent_item_id) {
      (acc[it.parent_item_id] ||= []).push(it);
    }
    return acc;
  }, {});

  const subtotal = parents.reduce((a, it) => a + (it.total || 0), 0);
  const servicio = Number((subtotal * serviceRate).toFixed(2));
  const total = Number((subtotal + servicio).toFixed(2));

  return (
    <div className="card p-4 rounded-2xl border">
      <div className="text-lg font-semibold mb-3">Ticket</div>

      <div className="space-y-3">
        {parents.map((it) => {
          const unit = it.qty > 0 ? (it.total || 0) / it.qty : (it.total || 0);
          return (
            <div key={it.id} className="pb-3 border-b last:border-none">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium break-words">
                    {it.nombre || "Item"}
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

                  <div className="text-xs text-gray-500 mt-1">
                    Unit: Q{unit.toFixed(2)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold">Q{(it.total || 0).toFixed(2)}</div>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <button
                      className="px-2 py-1 rounded border hover:bg-gray-50"
                      onClick={() => onQtyChange?.(it, Math.max(1, (it.qty || 1) - 1))}
                      title="Disminuir"
                    >−</button>
                    <span className="px-2 text-sm">{it.qty || 1}</span>
                    <button
                      className="px-2 py-1 rounded border hover:bg-gray-50"
                      onClick={() => onQtyChange?.(it, (it.qty || 1) + 1)}
                      title="Aumentar"
                    >+</button>
                    <button
                      className="ml-2 px-2 py-1 rounded border hover:bg-red-50 text-red-600"
                      onClick={() => onRemove?.(it)}
                      title="Eliminar"
                    >🗑</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {parents.length === 0 && (
          <div className="text-sm text-gray-500">Aún no hay productos.</div>
        )}
      </div>

      <div className="mt-4 space-y-1 text-sm text-ink-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Q{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Servicio 10%</span>
          <span>Q{servicio.toFixed(2)}</span>
        </div>
      </div>
      <div className="mt-1 pt-2 border-t flex justify-between items-center">
        <span className="font-semibold">Total</span>
        <span className="text-lg font-bold">Q{total.toFixed(2)}</span>
      </div>

      {/* Solo dos acciones: Modificar y Confirmar */}
      <div className="mt-4 flex flex-col gap-2">
        <button
          className="btn w-full"
          onClick={onModify}
        >
          Modificar pedido
        </button>
        <button
          className="btn-gradient w-full"
          onClick={onConfirm}
          disabled={parents.length === 0}
        >
          Confirmar pedido
        </button>
      </div>
    </div>
  );
}
