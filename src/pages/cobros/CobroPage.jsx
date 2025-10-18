// src/pages/cobros/CobroPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPedidoById, getPedidoItems } from "../../api/pedidos";
import {
  Wallet,
  CreditCard,
  Split,
  ChevronLeft,
  CheckCircle2,
  Info,
  Eraser,
  Printer,
  ReceiptText,
} from "lucide-react";

// ⬇️ Importa el modal de impresión
import TicketPreviewModal from "../../components/print/TicketPreviewModal";

export default function CobroPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pago
  const [method, setMethod] = useState("efectivo"); // efectivo | tarjeta | mixto
  const [cashIn, setCashIn] = useState(""); // efectivo recibido
  const [cardRef, setCardRef] = useState(""); // referencia tarjeta
  const [mixCash, setMixCash] = useState(""); // efectivo en mixto
  const [mixCardRef, setMixCardRef] = useState(""); // referencia tarjeta en mixto
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // ⬇️ Estado para el modal de impresión
  const [printOpen, setPrintOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const p = await getPedidoById(id);
        const it = await getPedidoItems(id);
        if (!alive) return;
        setOrder(p || null);
        setItems(Array.isArray(it?.data) ? it.data : it || []);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  // Sólo líneas padre (las hijas son extras)
  const parents = useMemo(() => items.filter((it) => !it.parent_item_id), [items]);

  const subtotal = useMemo(
    () => parents.reduce((acc, it) => acc + (Number(it.total) || 0), 0),
    [parents]
  );
  const service = useMemo(() => Number((subtotal * 0.1).toFixed(2)), [subtotal]);
  const total = useMemo(() => Number((subtotal + service).toFixed(2)), [subtotal, service]);

  // Helpers
  const toNum = (v) =>
    v === "" || v === null || typeof v === "undefined" ? NaN : Number(v);

  const change = useMemo(() => {
    if (method !== "efectivo") return 0;
    const n = toNum(cashIn);
    if (Number.isNaN(n)) return 0;
    return Math.max(0, Number((n - total).toFixed(2)));
  }, [cashIn, total, method]);

  const mixCardAmount = useMemo(() => {
    if (method !== "mixto") return 0;
    const c = toNum(mixCash);
    if (Number.isNaN(c)) return 0;
    return Math.max(0, Number((total - c).toFixed(2)));
  }, [mixCash, total, method]);

  // Quick buttons
  const setExact = () => setCashIn(String(total.toFixed(2)));
  const quickAdd = (inc) => {
    const base = Number.isNaN(toNum(cashIn)) ? 0 : toNum(cashIn);
    setCashIn(String(Number((base + inc).toFixed(2))));
  };
  const clearCash = () => setCashIn("");

  // Validación
  const validate = () => {
    setError("");
    if (parents.length === 0 || total <= 0) {
      setError("No hay ítems para cobrar.");
      return false;
    }
    if (method === "efectivo") {
      const n = toNum(cashIn);
      if (Number.isNaN(n)) return (setError("Ingresa el efectivo recibido."), false);
      if (n < total) return (setError("El efectivo recibido no cubre el total."), false);
      return true;
    }
    if (method === "tarjeta") {
      if (!cardRef.trim()) return (setError("Ingresa una referencia de tarjeta."), false);
      return true;
    }
    if (method === "mixto") {
      const c = toNum(mixCash);
      if (Number.isNaN(c)) return (setError("Ingresa el efectivo del pago mixto."), false);
      if (c < 0 || c > total)
        return (setError("El efectivo mixto debe estar entre 0 y el total."), false);
      const card = mixCardAmount;
      if (card > 0 && !mixCardRef.trim())
        return (setError("Ingresa la referencia para la parte en tarjeta."), false);
      if (Number((c + card).toFixed(2)) !== total)
        return (setError("Efectivo + tarjeta debe igualar el total."), false);
      return true;
    }
    return false;
  };

  const handlePay = async () => {
    if (!validate()) return;
    setProcessing(true);
    try {
      // Simulación de cobro/registro
      await new Promise((r) => setTimeout(r, 500));
      // Si quieres abrir impresión automáticamente después de cobrar:
      // setPrintOpen(true);
      navigate("/pedidos", { state: { paid: true, orderId: id } });
    } catch (e) {
      console.error(e);
      setError("No se pudo completar el cobro. Inténtalo de nuevo.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="app-container py-6">Cargando datos del pedido…</div>;
  }

  if (!order) {
    return (
      <div className="app-container py-6">
        <div className="card p-4 rounded-2xl">
          <div className="text-lg font-semibold mb-2">Pedido no encontrado</div>
          <Link className="text-blue-600" to="/pedidos">
            ← Volver a Pedidos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/pedidos" className="hover:text-blue-600 inline-flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Pedidos
            </Link>
            <span>•</span>
            <span className="truncate">Cobro</span>
          </div>
          <h1 className="mt-1 text-xl md:text-2xl font-semibold tracking-tight">
            Pedido #{String(order.numero_dia ?? order.numero_orden).padStart(2, "0")}
          </h1>
          <p className="text-sm text-gray-600 truncate">
            Cliente: <span className="font-medium">{order.cliente || "—"}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="btn"
            onClick={() => setPrintOpen(true)}
            title="Imprimir ticket"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimir ticket
          </button>
          <Link className="btn" to={`/pedidos/${id}`} title="Volver al pedido">
            Volver
          </Link>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Izquierda: métodos + formularios */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Selector método */}
          <div className="card p-3 rounded-2xl">
            <div className="text-sm text-gray-600 mb-2">Método de pago</div>
            <div className="inline-flex rounded-xl border bg-white overflow-hidden shadow-sm">
              {[
                { key: "efectivo", label: "Efectivo", icon: Wallet },
                { key: "tarjeta", label: "Tarjeta", icon: CreditCard },
                { key: "mixto", label: "Mixto", icon: Split },
              ].map(({ key, label, icon: Icon }) => {
                const active = method === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setMethod(key);
                      setError("");
                    }}
                    className={`px-4 py-2 flex items-center gap-2 border-r last:border-r-0 transition ${
                      active ? "bg-brand/10 text-brand" : "hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* EFECTIVO */}
          {method === "efectivo" && (
            <div className="card p-4 rounded-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="label">Efectivo recibido</label>
                  <input
                    className="input w-full"
                    inputMode="decimal"
                    placeholder={`Q${total.toFixed(2)}`}
                    value={cashIn}
                    onChange={(e) => setCashIn(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Total a cobrar</label>
                  <input className="input w-full" value={`Q${total.toFixed(2)}`} disabled />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="btn" onClick={setExact}>Exacto</button>
                {[1, 5, 10, 20, 50].map((n) => (
                  <button key={n} className="btn" onClick={() => quickAdd(n)}>
                    + Q{n}
                  </button>
                ))}
                <button className="btn" onClick={clearCash}>
                  <Eraser className="h-4 w-4 mr-1" />
                  Borrar
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Info className="h-4 w-4 text-gray-400" />
                <span>
                  Cambio: <span className="font-semibold">Q{change.toFixed(2)}</span>
                </span>
              </div>
            </div>
          )}

          {/* TARJETA */}
          {method === "tarjeta" && (
            <div className="card p-4 rounded-2xl space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label">Importe</label>
                  <input className="input w-full" value={`Q${total.toFixed(2)}`} disabled />
                </div>
                <div>
                  <label className="label">Referencia (últimos 4 / voucher)</label>
                  <input
                    className="input w-full"
                    placeholder="****"
                    value={cardRef}
                    onChange={(e) => setCardRef(e.target.value)}
                  />
                </div>
              </div>
              <div className="help">Usa la referencia del POS bancario para trazabilidad.</div>
            </div>
          )}

          {/* MIXTO */}
          {method === "mixto" && (
            <div className="card p-4 rounded-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="label">Efectivo</label>
                  <input
                    className="input w-full"
                    inputMode="decimal"
                    placeholder="Q0.00"
                    value={mixCash}
                    onChange={(e) => setMixCash(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Tarjeta (calculado)</label>
                  <input className="input w-full" value={`Q${mixCardAmount.toFixed(2)}`} disabled />
                </div>
                <div>
                  <label className="label">Ref. Tarjeta</label>
                  <input
                    className="input w-full"
                    placeholder="****"
                    value={mixCardRef}
                    onChange={(e) => setMixCardRef(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[1, 5, 10, 20, 50].map((n) => (
                  <button
                    key={n}
                    className="btn"
                    onClick={() =>
                      setMixCash((prev) => {
                        const base = Number.isNaN(toNum(prev)) ? 0 : toNum(prev);
                        return String(Number((base + n).toFixed(2)));
                      })
                    }
                  >
                    + Q{n}
                  </button>
                ))}
                <button className="btn" onClick={() => setMixCash(String(total.toFixed(2)))}>
                  Efectivo = total
                </button>
                <button className="btn" onClick={() => setMixCash("")}>
                  <Eraser className="h-4 w-4 mr-1" />
                  Borrar
                </button>
              </div>

              <div className="help">La suma de efectivo + tarjeta debe igualar el total.</div>
            </div>
          )}

          {/* Mensaje de error */}
          {error && (
            <div className="p-3 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-sm">
              {error}
            </div>
          )}

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3">
            <button className="btn" onClick={() => setPrintOpen(true)}>
              <ReceiptText className="h-4 w-4 mr-2" />
              Imprimir ticket
            </button>
            <Link to={`/pedidos/${id}`} className="btn">
              Cancelar
            </Link>
            <button
              className="btn-gradient"
              onClick={handlePay}
              disabled={processing}
            >
              {processing ? "Procesando…" : (
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Guardar y cobrar
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Derecha: Resumen + Ítems */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <div className="card p-4 rounded-2xl sticky top-6">
            <div className="text-lg font-semibold mb-3">Resumen del pedido</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Q{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Servicio 10%</span>
                <span>Q{service.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold">Q{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="card p-4 rounded-2xl">
            <div className="text-lg font-semibold mb-3">Ítems</div>
            <div className="space-y-3">
              {parents.length === 0 && (
                <div className="text-sm text-gray-500">Aún no hay productos.</div>
              )}
              {parents.map((it) => (
                <div key={it.id} className="flex items-start justify-between">
                  <div className="min-w-0">
                    <div className="font-medium break-words">{it.nombre}</div>
                    <div className="text-xs text-gray-500">Cant: {it.qty || 1}</div>
                  </div>
                  <div className="font-semibold">
                    Q{Number(it.total || 0).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nota pequeña */}
          <div className="text-xs text-gray-500 px-1">
            Tip: puedes imprimir el ticket antes o después de cobrar; el contenido es el mismo.
          </div>
        </div>
      </div>

      {/* ⬇️ Modal de previsualización / impresión del ticket */}
      <TicketPreviewModal
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        order={order}
        items={items}
        subtotal={subtotal}
        service={service}
        total={total}
        businessName="PANINODIVINO"
        logoSrc="/logo2.png"
      />
    </div>
  );
}
