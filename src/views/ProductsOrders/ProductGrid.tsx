import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import CategoryMenu from "./CategoryMenu.js";
import Ticket from "./Ticket.js";
import { getProductsByCategoryAPI } from "@/api/ProductsAPI.js";
import type { CreateProduct } from "@/schemas/types.js"; // ⬅️ importamos el tipo del schema

export default function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: () => getProductsByCategoryAPI(selectedCategory!),
    enabled: !!selectedCategory,
  });
  const products: CreateProduct[] = data?.data?.products || [];
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* MENÚ DE CATEGORÍAS */}
      <CategoryMenu onCategorySelect={setSelectedCategory} />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="container mx-auto flex flex-col lg:flex-row gap-6 px-4 py-8">
        {/* PRODUCTOS */}
        <div className="flex-1">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-3 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm"
            />
          </div>

          {isLoading && <p className="text-center py-10">Cargando productos...</p>}
          {isError && (
            <p className="text-center text-red-500">
              {data?.message || "Error al cargar productos."}
            </p>
          )}

          {!isLoading && !isError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.length === 0 ? (
                <p className="col-span-full text-center text-gray-400">
                  No hay productos disponibles.
                </p>
              ) : (
                filteredProducts.map((product: CreateProduct) => ( // ⬅️ Tipado explícito
                  <div
                    key={product.id_product}
                    className="bg-white border border-amber-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-slate-800 mb-2">
                        {product.name}
                      </h3>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-orange-600">
                          {/* Q{product.price?.toFixed(2) || "—"} */}
                        </span>

                        <button className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-500 hover:via-amber-400 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-md">
                          <Plus size={18} />
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* TICKET */}
        <div className="lg:w-96 w-full">
          <Ticket />
        </div>
      </div>
    </div>
  );
}
