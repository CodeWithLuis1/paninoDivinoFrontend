import { ErrorMessage } from "../utilities-components/ErrorMessage.js";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

type CreateProductFormProps = {
  register: UseFormRegister<{
    name: string;
    description: string;
    image: string;
    active: string;
    id_category: string;
  }>;
  errors: FieldErrors<{
    name: string;
    description: string;
    image: string;
    active: string;
    id_category: string;
  }>;
};
export function CreateProductForm({
  errors,
  register,
}: CreateProductFormProps) {
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

      <div className="mb-5 space-y-3">
        <label htmlFor="image" className="text-sm uppercase font-bold">
          Imagen
        </label>
        <textarea
          id="image"
          className="w-full p-3  border border-gray-200"
          {...register("image", {
            required: "La imagen es obligatoria",
          })}
        />
        {errors.image && <ErrorMessage>{errors.image.message}</ErrorMessage>}
      </div>
      <div className="mb-5 space-y-3">
        <label htmlFor="active" className="text-sm uppercase font-bold">
          Activo
        </label>
        <textarea
          id="active"
          className="w-full p-3  border border-gray-200"
          {...register("active", {
            required: "La activen es obligatoria",
          })}
        />
        {errors.active && <ErrorMessage>{errors.active.message}</ErrorMessage>}
      </div>

      <div className="mb-5 space-y-3">
        <label htmlFor="active" className="text-sm uppercase font-bold">
          Activo
        </label>
        <textarea
          id="active"
          className="w-full p-3  border border-gray-200"
          {...register("active", {
            required: "La activen es obligatoria",
          })}
        />
        {errors.active && <ErrorMessage>{errors.active.message}</ErrorMessage>}
      </div>
    </>
  );
}
