import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CreateProductForm } from "@/views/Product/CreateProductForm.js";
import type { ProductFormData } from "@/schemas/types.js";
import type { ProductIngredient } from "@/schemas/types.js";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createProductAPI } from "@/api/ProductsAPI.js";
import { createProducIngredientAPI } from "@/api/ProductIngredientAPI.js";
import { IngredientModal } from "@/views/ingredients/IngredientModalForm.js";
import React from "react";

export default function CreateProductView() {
  const navigate = useNavigate();

  const [showIngredientModal, setShowIngredientModal] = React.useState(false);

  // Estado donde guardaremos los ingredientes seleccionados del modal
  const [selectedIngredients, setSelectedIngredients] =
    React.useState<ProductIngredient[] | null>(null);

  const initialValues: ProductFormData = {
    name: "",
    description: "",
    price: 0,
    image: "",
    active: true,
    id_category: 0,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductFormData>({ defaultValues: initialValues });

  // Mutación para crear el producto
  const { mutate } = useMutation({
    mutationFn: createProductAPI,
    onSuccess: async (data) => {
      toast.success("Producto creado correctamente");

      const productId = data.data.id_product;

      // Si trae ingredientes seleccionados, enviarlos al backend
      if (selectedIngredients && selectedIngredients.length > 0) {
        await createProducIngredientAPI({
          product_id: productId,
          ingredients: selectedIngredients,
        });
      }

      navigate("/products");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al crear el producto");
    },
  });

  const handleForm = (formData: ProductFormData) => mutate(formData);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--color-primary-dark)]
             to-[var(--color-primary)] bg-clip-text text-transparent mb-3">
            Crear Nuevo Producto
          </h1>
        </div>

        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[var(--color-primary-dark)]
              font-semibold rounded-xl shadow-md hover:shadow-lg hover:bg-[var(--color-bg-secondary)]
              transition-all duration-200 border border-[var(--color-border-light)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Regresar
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-[var(--color-border-light)]
          overflow-hidden">
          <div className="bg-gradient-to-r from-[var(--color-primary)]
            to-[var(--color-primary-dark)] h-2"></div>

          <form className="p-8 space-y-6" onSubmit={handleSubmit(handleForm)} noValidate>

            <CreateProductForm
              register={register}
              errors={errors}
              setValue={setValue}
            />

            {/* Botón para abrir el modal de ingredientes */}
            <button
              type="button"
              onClick={() => setShowIngredientModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 
                rounded-lg shadow transition"
            >
              Seleccionar Ingredientes
            </button>

            <input
              type="submit"
              value="Crear Producto"
              className="w-full bg-gradient-to-r from-[var(--color-primary-dark)]
                to-[var(--color-primary)] hover:from-[var(--color-primary-darker)]
                hover:to-[var(--color-primary-dark)] text-white font-bold py-4 px-6 rounded-xl 
                shadow-lg hover:shadow-[var(--shadow-amber)] transform hover:-translate-y-0.5 
                transition-all duration-200 uppercase tracking-wide"
            />
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-[var(--color-text-tertiary)]">
          <p>Los cambios se aplicarán inmediatamente después de crear el producto</p>
        </div>
      </div>

      {/* Modal visible antes de crear el producto */}
      {showIngredientModal && (
        <IngredientModal
          standalone={true}
          onClose={(ingredients) => {
            setSelectedIngredients(ingredients);
            setShowIngredientModal(false);
          }}
        />
      )}
    </div>
  );
}
