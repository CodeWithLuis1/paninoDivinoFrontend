export default function ProductCard({ product, onAdd }) {
  return (
    <div className="card group overflow-hidden">
      <div className="aspect-[4/3] bg-slate-100 relative">
        {/* Imagen si luego la tienes */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-xs px-2 py-1 rounded-md border border-slate-200">
          Q{Number(product?.precio ?? 0).toFixed(2)}
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-2">
        <div className="font-medium line-clamp-2 min-h-[2.5rem]">{product?.nombre}</div>
        <button
          onClick={() => onAdd(product)}
          className="btn-primary w-full"
        >
          + Agregar
        </button>
      </div>
    </div>
  );
}
