import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const ProductsTable = () => {
  const [products] = useState([
    {
      id: 1,
      nombre: "Pan Ciabatta",
      categoria: "Panadería",
      costoCompra: 0.5,
      precioVenta: 1.0,
      unidadMedida: "Pieza",
      activo: true,
      fechaCreacion: "2024-01-15",
    },
    {
      id: 2,
      nombre: "Jamón Cocido",
      categoria: "Embutidos",
      costoCompra: 5.0,
      precioVenta: 8.0,
      unidadMedida: "Kg",
      activo: true,
      fechaCreacion: "2024-01-20",
    },
    {
      id: 3,
      nombre: "Queso Mozzarella",
      categoria: "Lácteos",
      costoCompra: 6.0,
      precioVenta: 9.5,
      unidadMedida: "Kg",
      activo: true,
      fechaCreacion: "2024-01-25",
    },
    {
      id: 4,
      nombre: "Tomate",
      categoria: "Verduras",
      costoCompra: 1.2,
      precioVenta: 2.5,
      unidadMedida: "Kg",
      activo: true,
      fechaCreacion: "2024-01-28",
    },
    {
      id: 5,
      nombre: "Lechuga",
      categoria: "Verduras",
      costoCompra: 0.8,
      precioVenta: 1.8,
      unidadMedida: "Kg",
      activo: false,
      fechaCreacion: "2024-01-30",
    },
  ]);

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              📦 Productos para Paninos
            </h2>
            <Link
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm"
              to="/products/create"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Nuevo Producto</span>
            </Link>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  {[
                    "ID",
                    "Nombre",
                    "Categoría",
                    "Costo",
                    "Precio",
                    "Unidad",
                    "Estado",
                    "Fecha",
                    "Acciones",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-slate-200"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <tr
                    key={product.id}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                    } hover:bg-slate-100 transition-colors`}
                  >
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                      {product.id}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                      {product.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {product.categoria}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      ${product.costoCompra.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      ${product.precioVenta.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {product.unidadMedida}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          product.activo
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {product.fechaCreacion}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          title="Editar"
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          title="Eliminar"
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsTable;
