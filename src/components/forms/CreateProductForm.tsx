import { ErrorMessage } from "../utilities-components/ErrorMessage.js";
import type { UseFormRegister, FieldErrors,UseFormSetValue  } from "react-hook-form";
import type { ProductFormData } from "@/schemas/types.js";
import {UploadImages} from "../utilities-components/UploadImages.js";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesAPI } from "@/api/ProductCategoriesAPI.js";

type CreateProductFormProps = {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
};
export function CreateProductForm({errors,register,setValue }: CreateProductFormProps) {

  const {data: categories, isLoading} = useQuery({
      queryKey: ["categories"],
      queryFn: () => getCategoriesAPI(),
    });

  return (
    <>
      <div className="mb-5 space-y-3">
        <label htmlFor="name" className="text-sm uppercase font-bold">
          Nombre del Producto
        </label>
        <input
          id="name"
          className="w-full p-3  border border-gray-200"
          type="text"
          placeholder="Nombre del Producto"
          {...register("name", {
            required: "El nombre del producto es obligatorio",
          })}
        />
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
      </div>

      <div className="mb-5 space-y-3">
        <label htmlFor="description" className="text-sm uppercase font-bold">
          Descripcion
        </label>
        <input
          id="description"
          className="w-full p-3  border border-gray-200"
          type="text"
          placeholder="Descripción del Producto"
          {...register("description", {
            required: "La descripción es obligatorio",
          })}
        />
        {errors.description && (
          <ErrorMessage>{errors.description.message}</ErrorMessage>
        )}
      </div>
    <div className="mb-5">
        <UploadImages
          label="Imagen del Producto"
          onChange={(base64) => setValue("image", base64 || "")}
          error={errors.image?.message?? ""}
        />
      </div>
      {/* This div element (Status) uses Tailwind CSS styles.  */}
      <div className="mb-5">
        <label
          htmlFor="active"
          className="block text-sm font-semibold text-gray-700 uppercase mb-2"
        >
          Estado
        </label>
        <div className="relative">
          <select
            id="active"
            {...register("active", {
              required: "El estado es obligatorio",
              setValueAs: (v) => v === "true",
            })}
            className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-gray-800 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none hover:border-gray-400"
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>

          {/* Flechita custom para el select */}
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {errors.active && (
          <ErrorMessage>{errors.active.message}</ErrorMessage>
        )}
    </div>

    <div>
        <label className="block text-sm font-medium mb-1">Categoría</label>
        {isLoading ? (
          <p>Cargando categorías...</p>
        ) : (
          <select
            {...register("id_category", {
              required: "Debes seleccionar una categoría",
              valueAsNumber: true,
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Seleccione una categoría</option>
            {categories?.data?.map((cat) => (
              <option key={cat.id_category} value={cat.id_category}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
        {errors.id_category && (
          <p className="text-red-500 text-sm">{errors.id_category.message}</p>
        )}
    </div>
    </>
  );
}
