// src/pages/inventario/Inventario.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { INVENTARIO_ITEMS, categoriasInventario } from "../../data/inventario";
import StockBadge from "../../components/inventory/StockBadge";

function currency(n) { return `Q${Number(n || 0).toFixed(2)}`; }

export default function Inventario() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todos");
  const [sort, setSort] = useState({ by: "nombre", dir: "asc" });
  const [rows, setRows] = useState(INVENTARIO_ITEMS);

  const filtered = useMemo(() => {
    const qn = q.trim().toUpperCase();
    let list = rows.filter(r => {
      const byText = !qn || `${r.nombre} ${r.categoria} ${r.proveedor}`.toUpperCase().includes(qn);
      const byCat  = cat === "Todos" || r.categoria === cat;
      return byText && byCat;
    });
    list.sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      if (sort.by === "stock") return (a.stock - b.stock) * dir;
      if (sort.by === "costoUnit") return (a.costoUnit - b.costoUnit) * dir;
      return a.nombre.localeCompare(b.nombre) * dir;
    });
    return list;
  }, [q, cat, rows, sort]);

  const alerts = useMemo(() => {
    const low  = rows.filter(r => r.stock > 0 && r.stock <= r.stockMin);
    const out  = rows.filter(r => r.stock <= 0);
    return { low, out, total: low.length + out.length };
  }, [rows]);

  const inc = (id, delta) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, stock: Math.max(0, Number((r.stock + delta).toFixed(2))) } : r));
  };

  const toggleSort = (field) => {
    setSort(s => s.by === field ? { by: field, dir: s.dir === "asc" ? "desc" : "asc" } : { by: field, dir: "asc" });
  };

  return (
    <div className="app-container py-4 md:py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">Inventario</h1>
        <Link to="/pedidos" className="text-blue-600 hover:text-blue-700 text-sm md:text-base">← Volver a pedidos</Link>
      </div>

      {/* Panel de alertas */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-sm">
            {alerts.total === 0 ? (
              <span className="text-emerald-700">Todo en orden. Sin alertas de stock.</span>
            ) : (
              <>
                {alerts.out.length > 0 && (
                  <span className="mr-4 inline-flex items-center text-rose-700">
                    <span className="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
                    {alerts.out.length} agotado(s)
                  </span>
                )}
                {alerts.low.length > 0 && (
                  <span className="inline-flex items-center text-amber-800">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                    {alerts.low.length} con stock bajo
                  </span>
                )}
              </>
            )}
          </div>
          <div className="ml-auto flex gap-2">
            <select value={cat} onChange={e => setCat(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
              {categoriasInventario.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Buscar insumo..."
              className="rounded-lg border px-3 py-2 text-sm w-56"
            />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr className="text-slate-600">
                <th className="text-left px-4 py-3 cursor-pointer" onClick={() => toggleSort("nombre")}>
                  Insumo {sort.by === "nombre" ? (sort.dir === "asc" ? "↑" : "↓") : ""}
                </th>
                <th className="text-left px-4 py-3">Categoría</th>
                <th className="text-left px-4 py-3">Proveedor</th>
                <th className="text-right px-4 py-3 cursor-pointer" onClick={() => toggleSort("stock")}>
                  Stock {sort.by === "stock" ? (sort.dir === "asc" ? "↑" : "↓") : ""}
                </th>
                <th className="text-right px-4 py-3">Mínimo</th>
                <th className="text-center px-4 py-3">Estado</th>
                <th className="text-right px-4 py-3 cursor-pointer" onClick={() => toggleSort("costoUnit")}>
                  Costo unit. {sort.by === "costoUnit" ? (sort.dir === "asc" ? "↑" : "↓") : ""}
                </th>
                <th className="text-right px-4 py-3">Valorización</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const valorizacion = r.costoUnit * r.stock;
                return (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{r.nombre}</td>
                    <td className="px-4 py-3 text-slate-600">{r.categoria}</td>
                    <td className="px-4 py-3 text-slate-600">{r.proveedor}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{r.stock} {r.unidad}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{r.stockMin} {r.unidad}</td>
                    <td className="px-4 py-3 text-center"><StockBadge stock={r.stock} min={r.stockMin} /></td>
                    <td className="px-4 py-3 text-right">{currency(r.costoUnit)}</td>
                    <td className="px-4 py-3 text-right">{currency(valorizacion)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => inc(r.id, -1)} className="btn border hover:bg-slate-50">– 1</button>
                        <button onClick={() => inc(r.id, +1)} className="btn bg-blue-600 text-white hover:bg-blue-700">+ 1</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-slate-500">
                    No hay insumos que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

