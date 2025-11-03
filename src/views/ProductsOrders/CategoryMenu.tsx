import { useQuery } from "@tanstack/react-query";
import { getCategoriesAPI } from "@/api/ProductCategoriesAPI.js";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import type { ProductCategoryFormData } from "@/schemas/types.js";

interface CategoryMenuProps {
  onCategorySelect: (id: number) => void;
}

export default function CategoryMenu({ onCategorySelect }: CategoryMenuProps) {
  const { state } = useLocation();
  const navigate = useNavigate();

  const orderNumber = state?.orderNumber || "—";
  const clientName = state?.clientName || "—";

  // ✅ tipamos correctamente lo que devuelve la API
  const { data, isLoading, isError } = useQuery<
    | {
        statusCode: number;
        data: ProductCategoryFormData[];
        total?: number;
        limit?: number | null;
        lastPage?: number;
      }
    | undefined
  >({
    queryKey: ["categories"],
    queryFn: () => getCategoriesAPI(),
  });
  const [activeCategory, setActiveCategory] = React.useState<number>(1);
  
  const handleSelect = (id: number) => {
    setActiveCategory(id);
    onCategorySelect(id);
  };
  if (isLoading) return <p>Cargando categorías...</p>;
  if (isError) return <p>Error al cargar las categorías.</p>;
  
  const categories = data?.data || [];
  return (
    <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 shadow-lg mt-4 rounded-b-3xl">
      <div className="container mx-auto px-6 py-5">
        {/* encabezado */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow-md">
              Pedido #{orderNumber}
            </h1>
            <p className="text-amber-100 text-sm">{clientName}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-amber-100 transition-colors font-medium"
          >
            ← Volver
          </button>
        </div>

        {/* botones de categoría */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const isActive = activeCategory === category.id_category;
            return (
              <button
                key={category.id_category}
                onClick={() => handleSelect(category.id_category)}
                className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-200 border ${
                  isActive
                    ? "bg-gradient-to-r from-amber-100 via-amber-50 to-white text-orange-700 border-amber-300 shadow-md transform scale-105"
                    : "bg-gradient-to-r from-orange-200 via-amber-200 to-orange-100 text-amber-900 border-transparent hover:from-orange-300 hover:via-amber-300 hover:to-orange-200"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
