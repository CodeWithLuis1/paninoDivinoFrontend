import React, { useMemo, useRef } from "react";

/**
 * Modal de previsualización e impresión de ticket (80mm)
 * Props:
 *  - open, onClose
 *  - order: { numero_orden, cliente }
 *  - items: [{ id, nombre, qty, total, parent_item_id? }, ...]
 *  - subtotal, service, total (números)
 *  - logoSrc (string, opcional) -> ej: "/panino-logo.png"
 *  - businessName (string) -> ej: "PANINODIVIN0"
 *  - qrText (string, opcional) -> para futuro QR
 */
export default function TicketPreviewModal({
  open,
  onClose,
  order,
  items = [],
  subtotal = 0,
  service = 0,
  total = 0,
  logoSrc = "/logo2.png",
  businessName = "PANINODIVINO",
  qrText,
}) {
  const ticketRef = useRef(null);

  const parents = useMemo(
    () => (items || []).filter((it) => !it.parent_item_id),
    [items]
  );

  const now = useMemo(() => {
    const d = new Date();
    const dd = d.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const tt = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    return `${dd} ${tt}`;
  }, []);

  if (!open) return null;

  const handlePrint = () => {
    try {
      const node = ticketRef.current;
      if (!node) return;
      const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Ticket #${order?.numero_orden || "--"}</title>
  <style>
    @page { size: 80mm auto; margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji","Segoe UI Emoji"; }
    .ticket-paper { width: 80mm; padding: 10px 10px 18px; }
    .center { text-align: center; }
    .mt-8 { margin-top: 8px; }
    .mt-12 { margin-top: 12px; }
    .mt-16 { margin-top: 16px; }
    .sep { border-top: 1px dashed #999; margin: 8px 0; }
    .title { font-weight: 700; font-size: 16px; letter-spacing: .5px; }
    .muted { color: #555; font-size: 12px; }
    .row { display: flex; justify-content: space-between; font-size: 13px; }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
    .items { font-size: 13px; }
    .item { display: grid; grid-template-columns: 28px 1fr auto; gap: 6px; align-items: start; }
    .big-total { font-size: 18px; font-weight: 800; }
    img.logo { width: 42px; height: 42px; object-fit: contain; margin: 0 auto 6px; display: block; }
    .qr { width: 120px; height: 120px; margin: 10px auto 0; background: #eee; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #666; }
  </style>
</head>
<body onload="window.print(); setTimeout(()=>window.close(), 200);">
  ${node.outerHTML}
</body>
</html>
      `.trim();

      const w = window.open("", "_blank", "noopener,noreferrer,width=400");
      if (!w) return;
      w.document.open();
      w.document.write(html);
      w.document.close();
    } catch (e) {
      console.error(e);
      alert("No se pudo abrir la ventana de impresión.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        {/* Header modal */}
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="font-semibold">Vista previa del ticket</div>
          <button className="text-sm text-gray-600 hover:text-gray-800" onClick={onClose}>Cerrar</button>
        </div>

        {/* Preview */}
        <div className="px-3 py-3 max-h-[70vh] overflow-auto">
          <div ref={ticketRef} className="ticket-paper mx-auto bg-white shadow-sm">
            <img src={logoSrc} alt="logo" className="logo" />
            <div className="center title">{businessName}</div>

            <div className="center mt-8 mono">
              <div style={{ fontSize: 12, letterSpacing: 1 }}>COMANDA</div>
              <div style={{ fontSize: 13, marginTop: 2 }}>
                #{String(order?.numero_orden || "00").padStart(2, "0")}
              </div>
            </div>

            <div className="mt-12 muted">
              <div className="row"><span>CLIENTE:</span><span className="mono">{order?.cliente || "—"}</span></div>
              <div className="row"><span>FECHA:</span><span className="mono">{now}</span></div>
            </div>

            <div className="sep" />

            {/* Encabezado columnas */}
            <div className="row mono" style={{ fontWeight: 600 }}>
              <span style={{ width: 28 }}>CANT</span>
              <span style={{ flex: 1, textAlign: "left", paddingLeft: 6 }}>DETALLE</span>
              <span style={{ minWidth: 70, textAlign: "right" }}>PRECIO</span>
            </div>

            <div className="mt-8 items">
              {parents.map((it) => (
                <div key={it.id} className="item mono" style={{ marginBottom: 6 }}>
                  <div>{it.qty || 1}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{it.nombre}</div>
                    {/* si quisieras PU: <div className="muted">PUnit. {((Number(it.total)||0)/(it.qty||1)).toFixed(2)}</div> */}
                  </div>
                  <div style={{ textAlign: "right" }}>Q{Number(it.total || 0).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="sep" />

            <div className="row mono"><span>Subtotal</span><span>Q{subtotal.toFixed(2)}</span></div>
            <div className="row mono"><span>Servicio 10%</span><span>Q{service.toFixed(2)}</span></div>

            <div className="mt-12 row mono big-total">
              <span>Total</span>
              <span>Q{total.toFixed(2)}</span>
            </div>

            <div className="mt-16 muted center">
              Creado: {now}
            </div>

            {qrText ? (
              <div className="qr">
                {/* Aquí podrías integrar un QR real; por ahora placeholder */}
                QR
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer acciones */}
        <div className="px-4 py-3 border-t flex items-center justify-end gap-2">
          <button className="btn" onClick={onClose}>Cerrar</button>
          <button className="btn-gradient" onClick={handlePrint}>Imprimir</button>
        </div>
      </div>
    </div>
  );
}
