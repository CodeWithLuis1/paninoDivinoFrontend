// src/components/inventory/StockBadge.jsx
export default function StockBadge({ stock, min }) {
  const status = stock <= 0 ? "out" : (stock <= min ? "low" : "ok");
  const map = {
    ok:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    low: "bg-amber-50 text-amber-800 border-amber-200",
    out: "bg-rose-50 text-rose-700 border-rose-200",
  };
  const label = status === "ok" ? "OK" : status === "low" ? "Bajo" : "Agotado";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${map[status]}`}>
      {label}
    </span>
  );
}
