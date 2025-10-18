// src/pages/pedidos/PedidoEditor.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getPedidoById,
  getPedidoItems,
  addPedidoItem,
  removePedidoItem,
  updatePedidoItem,
  confirmPedido,
} from "../../api/pedidos";
import { getProductos } from "../../api/productos";
import CategoryTabs from "../../components/orders/CategoryTabs";
import ProductCard from "../../components/orders/ProductCard";
import ProductConfigModal from "../../components/orders/ProductConfigModal";
import Ticket from "../../components/orders/Ticket";
import OrderSummaryModal from "../../components/orders/OrderSummaryModal";
import { getProductUIConfig } from "../../config/productOptions";

/* ---------------- helpers ---------------- */
const strip = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

const norm = (s) => strip(s).replace(/\s+/g, " ").trim();

const normalizeProduct = (raw) => ({
  ...raw,
  id: raw?.id ?? raw?.id_producto ?? null,
  nombre: raw?.nombre ?? "",
  categoria: raw?.categoria ?? "",
  precio: Number(raw?.precio ?? 0),
});

// Etiquetas de BD -> pestaña
const CAT_KEY_BY_DB_LABEL = {
  PANINI: "paninis",
  PANINIS: "paninis",
  BAGEL: "bagels",
  BAGELS: "bagels",
  SMOOTHIE: "smoothies",
  "SMOOTHIES 12OZ": "smoothies",
  "SMOOTHIE 12OZ": "smoothies",
  "BEBIDA CALIENTE": "calientes",
  "BEBIDAS CALIENTES": "calientes",
  "BEBIDA FRIA": "frias",
  "BEBIDA FRÍA": "frias",
  "BEBIDAS FRIAS": "frias",
  "BEBIDAS FRÍAS": "frias",
};

const NAME_KEYWORDS = {
  paninis: ["SANTO PORCO", "SANTO BOCADO", "PECADO PERFECTO", "TERRA Y CIELO", "PANZA LLENA"],
  bagels: ["DOLCE ENCANTO", "PANQUEQUES CELESTIALES","SAN SERRANO", "BAGEL MISTICO", "SANTO FUNGHI"],
  smoothies: ["LIMONADA ROSA DIVINA", "SAN DETOX", "TROPICAL DIVINO", "CIOCCOLATOSO", "SIMPLE CON AGUA", "SIMPLE CON LECHE"],
  calientes: ["ESPRESSO", "AMERICANO", "LATTE", "MOCHA", "CAPUCHINO", "CORTADITO", "TE CHAI", "TÉ CHAI", "DIRTY CHAI", "COCOA", "TE SABORES", "TÉ SABORES"],
  frias: ["CAFE FRIO", "CAFÉ FRIO", "CAFÉ FRÍO", "LATTE FRIO", "LATTE FRÍO", "DIRTY CHAI", "TE SABORES", "TÉ SABORES", "TE CHAI", "TÉ CHAI"],
};

// Fallback base (paninis) — se mantiene
const FALLBACK_MENU = [
  { id: "f1", nombre: "SANTO PORCO", precio: 35, categoria: "PANINIS" },
  { id: "f2", nombre: "SANTO BOCADO", precio: 40, categoria: "PANINIS" },
  { id: "f3", nombre: "PECADO PERFECTO", precio: 40, categoria: "PANINIS" },
  { id: "f4", nombre: "TERRA Y CIELO", precio: 45, categoria: "PANINIS" },
  { id: "f5", nombre: "PANZA LLENA", precio: 25, categoria: "PANINIS" },
];

// 🔥 Fallbacks “quemados” para asegurar 5 bagels visibles
const BAGEL_MIN_SET = [
  { id: "b1", nombre: "DOLCE ENCANTO",           precio: 30, categoria: "BAGELS" },
  { id: "b2", nombre: "PANQUEQUES CELESTIALES",  precio: 30, categoria: "BAGELS" },
  { id: "b3", nombre: "SAN SERRANO",             precio: 35, categoria: "BAGELS" },
  { id: "b4", nombre: "BAGEL MISTICO",           precio: 35, categoria: "BAGELS" },
  { id: "b5", nombre: "SANTO FUNGHI",            precio: 40, categoria: "BAGELS" },
];

// Pistas para bebidas frías por precio
const COLD_PRICE_HINTS = [
  { match: ["TE CHAI", "TÉ CHAI"], price: 25 },
  { match: ["DIRTY CHAI"], price: 26 },
  { match: ["TE SABORES", "TÉ SABORES"], price: 16 },
];

/** Tamaño detectado en el nombre: "8oz" | "12oz" | null */
function detectSize(nameRaw) {
  const name = norm(nameRaw);
  const m = name.match(/(?:^|\s)(8|12)\s*(?:OZ|ONZ)\b/);
  if (!m) return null;
  return `${m[1]}oz`;
}

/** Resuelve pestaña destino del producto */
function resolveCategory(p) {
  const name = norm(p?.nombre);
  const price = Number(p?.precio ?? 0);

  // Forzar BAGELS por nombre (si contiene "BAGEL" o coincide con keywords)
  if (name.includes("BAGEL") || NAME_KEYWORDS.bagels.some((w) => name.includes(norm(w)))) {
    return "bagels";
  }

  // FRÍO explícito → frías
  if (/(FRIO|FRÍA|FRIA|FRÍO)\b/.test(name)) return "frias";

  // Categoría de BD, con override por pistas de “frías”
  const cat = norm(p?.categoria);
  if (cat) {
    for (const hint of COLD_PRICE_HINTS) {
      if (hint.match.some((m) => name.includes(m)) && price === hint.price) return "frias";
    }
    for (const label of Object.keys(CAT_KEY_BY_DB_LABEL)) {
      if (cat === label || cat.startsWith(label)) return CAT_KEY_BY_DB_LABEL[label];
    }
    if (cat.includes("BEBIDA") && cat.includes("CALIENT")) return "calientes";
    if (cat.includes("BEBIDA") && (cat.includes("FRIA") || cat.includes("FRÍA"))) return "frias";
    if (cat.includes("PANINI")) return "paninis";
    if (cat.includes("BAGEL")) return "bagels";
    if (cat.includes("SMOOTH")) return "smoothies";
  }

  // Sin categoría: decidir por nombre
  for (const key of Object.keys(NAME_KEYWORDS)) {
    if (NAME_KEYWORDS[key].some((w) => name.includes(norm(w)))) {
      if (key !== "frias") {
        for (const hint of COLD_PRICE_HINTS) {
          if (hint.match.some((m) => name.includes(m)) && price === hint.price) return "frias";
        }
      }
      return key;
    }
  }
  return "extras";
}

/** Dedupe por (pestaña + nombre normalizado) */
function dedupeByCategoryAndName(list) {
  const seen = new Map();
  for (const raw of list || []) {
    const p = normalizeProduct(raw);
    const catKey = resolveCategory(p);
    const key = `${catKey}::${norm(p.nombre)}`;
    if (!seen.has(key)) seen.set(key, p);
  }
  return Array.from(seen.values());
}

/** Asegura que haya al menos 5 bagels añadiendo los “quemados” que falten */
function ensureFiveBagels(list) {
  const out = [...list];
  const existingBagelNames = new Set(
    out.filter((x) => resolveCategory(x) === "bagels").map((x) => norm(x.nombre))
  );
  for (const b of BAGEL_MIN_SET) {
    if (!existingBagelNames.has(norm(b.nombre))) {
      out.push(b);
      existingBagelNames.add(norm(b.nombre));
    }
  }
  return out;
}

/* ==================== UNIFICADOR BEBIDAS CALIENTES (8oz/12oz) ==================== */
function splitSize(nameRaw) {
  const name = norm(nameRaw);
  const m = name.match(/(?:^|\s)(8|12)\s*(?:OZ|ONZ)\b/);
  if (!m) return { base: name, size: null };
  const size = `${m[1]}oz`;
  const base = name.replace(/(?:^|\s)(8|12)\s*(?:OZ|ONZ)\b/g, "").trim();
  return { base, size };
}

function unifyHotDrinks(hotProducts) {
  const map = new Map();
  for (const raw of hotProducts) {
    const p = normalizeProduct(raw);
    const { base, size } = splitSize(p.nombre);
    const baseKey = base;

    if (!map.has(baseKey)) {
      map.set(baseKey, {
        ...p,
        nombre: base,
        precio: p.precio,
        __hotVariants: {},
      });
    }
    const bucket = map.get(baseKey);
    if (size === "8oz" || size === "12oz") {
      bucket.__hotVariants[size] = { id: p.id, price: Number(p.precio) };
    } else {
      if (!bucket.__hotVariants["8oz"]) {
        bucket.__hotVariants["8oz"] = { id: p.id, price: Number(p.precio) };
      }
    }
    const prices = Object.values(bucket.__hotVariants).map((v) => v.price);
    if (prices.length) bucket.precio = Math.min(...prices);
  }
  return Array.from(map.values());
}
/* ================================================================================ */

export default function PedidoEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  const [products, setProducts] = useState([]);
  const [productsError, setProductsError] = useState(null);
  const [active, setActive] = useState("paninis");
  const [q, setQ] = useState("");

  const [cfgOpen, setCfgOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [uiConfig, setUiConfig] = useState(null);

  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  // Modal de resumen
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryData, setSummaryData] = useState(null);

  /* ---------- cargar pedido ---------- */
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoadingOrder(true);
      try {
        const data = await getPedidoById(id);
        if (alive) setOrder(data);
      } finally {
        if (alive) setLoadingOrder(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  /* ---------- cargar productos + dedupe + asegurar 5 bagels ---------- */
  useEffect(() => {
    let alive = true;
    (async () => {
      setProductsError(null);
      try {
        const data = await getProductos();
        const raw = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        const base = raw?.length ? raw : FALLBACK_MENU;
        const deduped = dedupeByCategoryAndName(base);
        const withBagels = ensureFiveBagels(deduped); // ← añade los bagels faltantes
        if (alive) setProducts(withBagels);
      } catch (e) {
        console.error("[getProductos] error:", e);
        if (alive) {
          const withBagels = ensureFiveBagels(dedupeByCategoryAndName(FALLBACK_MENU));
          setProducts(withBagels);
          setProductsError(e?.message || "Error cargando productos");
        }
      }
    })();
    return () => { alive = false; };
  }, []);

  /* ---------- cargar ítems del ticket ---------- */
  const loadItems = useCallback(async () => {
    setLoadingItems(true);
    try {
      const r = await getPedidoItems(id);
      const list = Array.isArray(r?.data) ? r.data : r;
      setItems(list || []);
    } finally {
      setLoadingItems(false);
    }
  }, [id]);
  useEffect(() => { loadItems(); }, [loadItems]);

  /* ---------- agrupación por categoría ---------- */
  const groupedRaw = useMemo(() => {
    const g = { paninis: [], bagels: [], smoothies: [], calientes: [], frias: [] };
    const qn = norm(q);

    for (const raw of products) {
      const p = normalizeProduct(raw);
      const key = resolveCategory(p);

      if (key === "extras") continue;

      if (key === "frias") {
        const size = detectSize(p.nombre);
        if (size === "8oz") continue;
      }

      if (norm(p?.nombre).includes(qn)) g[key].push(p);
    }
    return g;
  }, [products, q]);

  const grouped = useMemo(
    () => ({ ...groupedRaw, calientes: unifyHotDrinks(groupedRaw.calientes) }),
    [groupedRaw]
  );

  const counts = useMemo(
    () => Object.fromEntries(Object.entries(grouped).map(([k, v]) => [k, v.length])),
    [grouped]
  );

  /* ---------- abrir modal con defaults (maneja calientes 8/12 oz) ---------- */
  const onAdd = (p) => {
    const baseCfg = getProductUIConfig(p);

    if (resolveCategory(p) === "calientes" && p.__hotVariants) {
      const v8 = p.__hotVariants["8oz"];
      const v12 = p.__hotVariants["12oz"];

      const variants = [];
      const variantIds = {};
      if (v8) {
        variants.push({ key: "8oz", label: `8 oz Q${Number(v8.price).toFixed(2)}`, price: v8.price });
        variantIds["8oz"] = v8.id;
      }
      if (v12) {
        variants.push({ key: "12oz", label: `12 oz Q${Number(v12.price).toFixed(2)}`, price: v12.price });
        variantIds["12oz"] = v12.id;
      }

      const defKey = v8 ? "8oz" : (variants[0]?.key || "8oz");

      setUiConfig({
        ...baseCfg,
        variants,
        defaults: { ...(baseCfg?.defaults || {}), variant: defKey },
        meta: { ...(baseCfg?.meta || {}), variantIds },
      });
    } else {
      setUiConfig(baseCfg);
    }

    setSelected(p);
    setCfgOpen(true);
  };

  /* ---------- confirmar y enviar al backend ---------- */
  const onConfirm = async ({ product, options, total }) => {
    try {
      let productIdToSend = product.id;
      if (uiConfig?.meta?.variantIds && options?.variant) {
        productIdToSend = uiConfig.meta.variantIds[options.variant] ?? productIdToSend;
      }

      const displayChoices = [];
      if (options?.choices && Array.isArray(uiConfig?.choiceGroups)) {
        for (const g of uiConfig.choiceGroups) {
          const chosenKey = options.choices[g.key];
          const opt = (g.options || []).find((o) => o.key === chosenKey);
          if (opt) displayChoices.push(`${g.label}: ${opt.label}`);
        }
      }
      const removiblesWithChoices = [
        ...(Array.isArray(options?.removibles) ? options.removibles : []),
        ...displayChoices,
      ];

      await addPedidoItem(id, {
        product_id: productIdToSend,
        product: !productIdToSend ? { nombre: product.nombre } : undefined,
        qty: 1,
        name: product?.nombre,
        subtotal: Number(total) || 0,
        variant: options.variant,
        sauce: options.sauce || null,
        removibles: removiblesWithChoices,
        extras: options.extras,
        extras_detalle: options.extras_detalle,
        choices: options.choices || {},
      });

      await loadItems();
      setCfgOpen(false);
      setSelected(null);
      setUiConfig(null);
    } catch (e) {
      console.error(e);
      alert("No se pudo agregar el ítem");
    }
  };

  /* ---------- acciones del Ticket ---------- */
  const handleRemove = async (item) => {
    await removePedidoItem(id, item.id);
    await loadItems();
  };

  const handleQtyChange = async (item, nextQty) => {
    await updatePedidoItem(id, item.id, { qty: nextQty });
    await loadItems();
  };

  // “Modificar pedido” → enfoca el buscador
  const handleModifyOrder = () => {
    document.querySelector("input[placeholder='Buscar producto…']")?.focus();
  };

  const handleConfirmOrder = async () => {
    const r = await confirmPedido(id, { serviceRate: 0.10 });
    if (r?.ok) {
      setSummaryData(r.resumen);
      setSummaryOpen(true);
    }
  };

  const handleCharge = () => {
    setSummaryOpen(false);
    navigate(`/cobros/${id}`);
  };

  if (loadingOrder) return <div className="p-6">Cargando pedido…</div>;
  if (!order) {
    return (
      <div className="p-6">
        Pedido no encontrado. <Link to="/pedidos" className="text-blue-600">Volver</Link>
      </div>
    );
  }

  const currentList = grouped[active] || [];

  return (
    <div className="app-container py-4 md:py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight">
          Pedido #{String(order.numero_dia ?? order.numero_orden).padStart(2, "0")} — {order.cliente || "Sin nombre"}
        </h1>
        <Link to="/pedidos" className="text-blue-600 hover:text-blue-700 text-sm md:text-base">
          ← Volver
        </Link>
      </div>

      {/* Layout catálogo + ticket */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Catálogo */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <CategoryTabs active={active} onChange={setActive} counts={counts} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar producto…"
              className="rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2 w-44 sm:w-56 transition"
            />
          </div>

          {productsError && (
            <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2">
              Aviso: {productsError}. Mostrando catálogo de ejemplo local.
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {currentList.map((p) => (
              <ProductCard
                key={p.id ?? `${resolveCategory(p)}:${norm(p.nombre)}`}
                product={p}
                onAdd={onAdd}
              />
            ))}
          </div>

          {currentList.length === 0 && (
            <div className="text-gray-500 text-sm p-4 border rounded-xl">
              No hay productos para esta categoría.
            </div>
          )}
        </div>

        {/* Ticket */}
        <div className="lg:col-span-4 xl:col-span-3">
          {/* Móvil: ticket plegable */}
          <div className="block lg:hidden mb-2">
            <details className="rounded-xl border bg-white open:shadow-sm">
              <summary className="cursor-pointer select-none px-4 py-3 font-medium">Ticket</summary>
              <div className="px-4 pb-3">
                {loadingItems ? (
                  <div className="rounded-xl border bg-white p-4">Cargando ticket…</div>
                ) : (
                  <Ticket
                    items={items}
                    onRemove={handleRemove}
                    onQtyChange={handleQtyChange}
                    onModify={handleModifyOrder}
                    onConfirm={handleConfirmOrder}
                  />
                )}
              </div>
            </details>
          </div>
          {/* Desktop: sticky */}
          <div className="hidden lg:block sticky top-6">
            {loadingItems ? (
              <div className="rounded-2xl border bg-white p-4">Cargando ticket…</div>
            ) : (
              <Ticket
                items={items}
                onRemove={handleRemove}
                onQtyChange={handleQtyChange}
                onModify={handleModifyOrder}
                onConfirm={handleConfirmOrder}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      <ProductConfigModal
        open={cfgOpen}
        product={selected}
        uiConfig={uiConfig}
        onClose={() => {
          setCfgOpen(false);
          setSelected(null);
          setUiConfig(null);
        }}
        onConfirm={onConfirm}
      />

      <OrderSummaryModal
        open={summaryOpen}
        resumen={summaryData}
        onClose={() => setSummaryOpen(false)}
        onCharge={() => {
          setSummaryOpen(false);
          handleCharge();
        }}
      />
    </div>
  );
}
