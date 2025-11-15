
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import CategoryMenu from "./CategoryMenu.js";
import Ticket from "./Ticket.js";
import { getProductsByCategoryAPI } from "@/api/ProductsAPI.js";
import { getProductIngredientsAPI } from "@/api/ProductIngredientAPI.js";
import ProductIngredientsModal from "../productsIngredients/ProductIngredientsModal.js";
import type { CreateProduct, ProductIngredientItem } from "@/schemas/types.js";

export default function ProductGrid() {

  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Estado del modal
  const [selectedProduct, setSelectedProduct] = useState<CreateProduct | null>(null);
  const [showIngredients, setShowIngredients] = useState(false);

  // Ingredientes cargados del backend
  const [ingredients, setIngredients] = useState<ProductIngredientItem[]>([]);
  const [finalPrice, setFinalPrice] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: () => getProductsByCategoryAPI(selectedCategory!),
    enabled: !!selectedCategory,
  });

  const products: CreateProduct[] = data?.data?.products || [];

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //Función al presionar AGREGAR
  const handleAddProduct = async (product: CreateProduct) => {
    try {
      const response = await getProductIngredientsAPI(product.id_product);

      setSelectedProduct(product);
      setIngredients(response.ingredients);
      setFinalPrice(response.price);

      setShowIngredients(true);
    } catch (error: any) {
      console.error(error);
    }
  };

  // Toggle de ingredientes dentro del modal
  const handleToggleIngredient = (id: number) => {
    setIngredients((prev) =>
      prev.map((ing) =>
        ing.id_ingredient === id
          ? { ...ing, is_default_selected: !ing.is_default_selected }
          : ing
      )
    );

    // Recalcular precio
    const priceBase = selectedProduct?.price ?? 0;
    const extra = ingredients
      .filter((i) => i.is_default_selected)
      .reduce((sum, i) => sum + i.additional_price, 0);

    setFinalPrice(priceBase + extra);
  };

return (
  <div className="min-h-screen bg-white flex flex-col">

    <CategoryMenu onCategorySelect={setSelectedCategory} />

    <div className="container mx-auto flex flex-col lg:flex-row gap-6 px-4 py-8">

      {/* PRODUCTOS */}
      <div className="flex-1">

        {/* BUSCADOR */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-3 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm"
          />
        </div>

        {/* GRID */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">

            {filteredProducts.map((product) => (
              <div
                key={product.id_product}
                className="bg-white border border-amber-100 rounded-2xl shadow-sm hover:shadow-xl 
                           transition-all duration-300 overflow-hidden group"
              >
                {/* IMAGEN — DISEÑO DEL PRIMER GRID */}
                <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* CONTENIDO */}
                <div className="p-4 flex flex-col gap-3">

                  {/* NOMBRE */}
                  <h3 className="font-semibold text-lg text-slate-800">
                    {product.name}
                  </h3>

                  {/* DESCRIPCIÓN */}
                  <p className="text-sm text-gray-600 leading-snug">
                    {product.description}
                  </p>

                  {/* PRECIO — ESTILO ORIGINAL */}
                  <span className="text-2xl font-extrabold text-orange-600 bg-orange-100 px-3 py-1 rounded-lg shadow-sm w-fit">
                    Q{Number(product.price).toFixed(2)}
                  </span>

                  {/* BOTÓN AGREGAR — ESTÉTICA DEL PRIMER DISEÑO */}
                  <button
                    onClick={() => handleAddProduct(product)}
                    className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 text-white px-4 py-2 rounded-lg 
                               font-semibold hover:from-orange-500 hover:via-amber-400 hover:to-orange-600 
                               transition-all duration-200 transform hover:scale-105 active:scale-95 
                               flex items-center justify-center gap-2 shadow-md mt-1"
                  >
                    <Plus size={18} />
                    Agregar
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* TICKET */}
      <div className="lg:w-96 w-full">
        <Ticket />
      </div>

    </div>

    {/* MODAL DE INGREDIENTES */}
    <ProductIngredientsModal
      open={showIngredients}
      product={selectedProduct}
      ingredients={ingredients}
      price={finalPrice}
      onToggle={handleToggleIngredient}
      onClose={() => setShowIngredients(false)}
      onConfirm={() => {
        console.log("Producto agregado al ticket con:", ingredients);
        setShowIngredients(false);
      }}
    />
  </div>
);
}
