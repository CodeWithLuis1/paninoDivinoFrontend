// src/components/orders/ProductConfigModal.jsx
import { useEffect, useMemo, useState } from "react";

export default function ProductConfigModal({ open, product, uiConfig, onClose, onConfirm }) {
  if (!open || !product) return null;

  const ui = uiConfig || {};
  const variants = Array.isArray(ui.variants) ? ui.variants : [];
  const sauces = Array.isArray(ui.sauces) ? ui.sauces : [];
  const removiblesList = Array.isArray(ui.removibles) ? ui.removibles : [];
  const extrasListCfg = Array.isArray(ui.extras) ? ui.extras : [];
  const choiceGroups = Array.isArray(ui.choiceGroups) ? ui.choiceGroups : [];
  const defaults = ui.defaults || {};

  // --------- Estado ----------
  const [variant, setVariant] = useState(defaults.variant || variants?.[0]?.key || "individual");
  const [sauce, setSauce] = useState(defaults.sauce || sauces?.[0] || null);
  // kept = ingredientes que se mantienen (checked). "Removibles" a enviar = los que NO estén en kept.
  const [kept, setKept] = useState(() => new Set(removiblesList));
  const [extras, setExtras] = useState(() => new Set());
  const [choices, setChoices] = useState(() => {
    // defaults.choices o default de cada grupo
    if (defaults.choices) return { ...defaults.choices };
    const initial = {};
    for (const g of choiceGroups) {
      if (g?.key) initial[g.key] = g.default ?? (g.options?.[0]?.key ?? null);
    }
    return initial;
  });

  // Reset al abrir con nuevo producto / nueva config
  useEffect(() => {
    setVariant(defaults.variant || variants?.[0]?.key || "individual");
    setSauce(defaults.sauce || sauces?.[0] || null);
    setKept(new Set(removiblesList));
    setExtras(new Set());
    setChoices(() => {
      if (defaults.choices) return { ...defaults.choices };
      const initial = {};
      for (const g of choiceGroups) {
        if (g?.key) initial[g.key] = g.default ?? (g.options?.[0]?.key ?? null);
      }
      return initial;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, open, uiConfig]);

  // --------- Cálculos ----------
  const variantPrice = useMemo(() => {
    const v = variants.find((x) => x.key === variant);
    const price = v?.price ?? product?.precio ?? 0;
    return Number(price || 0);
  }, [variants, variant, product]);

  const extrasTotal = useMemo(() => {
    let t = 0;
    for (const opt of extrasListCfg) {
      if (extras.has(opt.key)) t += Number(opt.price || 0);
    }
    return t;
  }, [extrasListCfg, extras]);

  const total = useMemo(() => Number(variantPrice + extrasTotal), [variantPrice, extrasTotal]);

  // --------- Handlers ----------
  const toggleKept = (name) => {
    const next = new Set(kept);
    next.has(name) ? next.delete(name) : next.add(name);
    setKept(next);
  };

  const toggleExtra = (key) => {
    const next = new Set(extras);
    next.has(key) ? next.delete(key) : next.add(key);
    setExtras(next);
  };

  const selectChoice = (groupKey, optionKey) => {
    setChoices((prev) => ({ ...prev, [groupKey]: optionKey }));
  };

  const handleConfirm = () => {
    // Ingredientes que el cliente QUITA (removibles = removidos)
    const removidos = removiblesList.filter((x) => !kept.has(x));
    const extrasKeys = Array.from(extras);
    const extras_detalle = extrasListCfg
      .filter((e) => extrasKeys.includes(e.key))
      .map((e) => ({ key: e.key, price: Number(e.price || 0) }));

    onConfirm?.({
      product,
      options: {
        variant,                 // "individual" | "con_papas" | "8oz" | "12oz" (según el producto)
        sauce,
        removibles: removidos,
        extras: extrasKeys,      // ["huevo","tocino",...]
        extras_detalle,          // [{key, price}]
        choices,                 // ← NUEVO: ej. { relleno: 'jamon' }
      },
      total,
    });
  };

  // --------- UI ----------
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="w-[95%] max-w-xl rounded-2xl bg-white p-5 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">{product?.nombre}</h3>

        {/* Variantes */}
        {variants.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Variante:</div>
            <div className="flex gap-2 flex-wrap">
              {variants.map((v) => {
                const price =
                  typeof v.price === "number" && !Number.isNaN(v.price)
                    ? ` Q${Number(v.price).toFixed(2)}`
                    : "";
                const active = variant === v.key;
                return (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => setVariant(v.key)}
                    className={`rounded-lg border px-3 py-1.5 text-sm ${
                      active ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-50"
                    }`}
                  >
                    {v.label}
                    {price}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Salsa */}
        {sauces.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Salsa / Aderezo:</div>
            <div className="flex flex-wrap gap-3">
              {sauces.map((s) => (
                <label key={String(s)} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="sauce"
                    checked={sauce === s}
                    onChange={() => setSauce(s)}
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Choice groups (segment control, p.ej. Jamón vs Frijoles) */}
        {choiceGroups.length > 0 &&
          choiceGroups.map((g) => (
            <div key={g.key} className="mb-4">
              <div className="text-sm font-medium mb-2">{g.label}</div>
              <div className="flex gap-2 flex-wrap">
                {(g.options || []).map((opt) => {
                  const active = choices[g.key] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => selectChoice(g.key, opt.key)}
                      className={`px-3 py-1.5 rounded-lg border text-sm ${
                        active ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

        {/* Removibles */}
        {removiblesList.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">
              Personalización (ingredientes removibles):
            </div>
            <div className="grid grid-cols-2 gap-2">
              {removiblesList.map((name) => (
                <label key={name} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={kept.has(name)}
                    onChange={() => toggleKept(name)}
                  />
                  {name}
                </label>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              * Marcado = mantener ingrediente. Desmarca para removerlo del panini.
            </div>
          </div>
        )}

        {/* Extras */}
        {extrasListCfg.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Extras opcionales:</div>
            <div className="grid grid-cols-2 gap-2">
              {extrasListCfg.map((e) => (
                <label
                  key={e.key}
                  className="flex items-center justify-between text-sm border rounded-lg px-3 py-2"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={extras.has(e.key)}
                      onChange={() => toggleExtra(e.key)}
                    />
                    {e.label}
                  </span>
                  <span>Q{Number(e.price || 0).toFixed(2)}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between">
          <div className="text-lg font-semibold">Subtotal: Q{total.toFixed(2)}</div>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-lg border px-3 py-1.5 hover:bg-gray-50">
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="rounded-lg bg-blue-600 text-white px-3 py-1.5 hover:bg-blue-700"
            >
              Agregar pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
