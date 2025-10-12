import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { ProductFormData } from "@/schemas/types.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "@/api/ProductsAPI.js";
import { toast } from "react-toastify";

type EditProductFormProps = {
  data: ProductFormData;
  productId: number;
};

export default function EditProductForm({ data, productId }: EditProductFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      nombre: data.nombre,
      categoria: data.categoria,
      costoCompra: data.costoCompra,
      precioVenta: data.precioVenta,
      unidadMedida: data.unidadMedida,
      activo: data.activo,
      fechaCreacion: data.fechaCreacion,
    },
  });

  const { mutate } = useMutation({
    mutationFn: updateProduct,
    onError: (error: any) => {
      toast.error(error.message || "Error al actualizar producto");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      toast.success("Producto actualizado correctamente");
      navigate("/products");
    },
  });

  const handleForm = (formData: ProductFormData) => {
    mutate({ formData, productId });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-black">Editar Producto</h1>
      <p className="text-lg text-gray-600 mt-2">
        Modifica la información del producto y guarda los cambios
      </p>

      <nav className="my-5">
        <Link
          className="bg-slate-500 hover:bg-slate-600 px-6 py-2 text-white font-semibold rounded-lg transition-colors"
          to="/products"
        >
          Volver a productos
        </Link>
      </nav>

      <form
        className="mt-8 bg-white shadow-md p-8 rounded-lg"
        onSubmit={handleSubmit(handleForm)}
        noValidate
      >
        {/* Nombre */}
        <div className="mb-4">
          <label className="block text-gray-700">Nombre</label>
          <input
            type="text"
            {...register("nombre", { required: "El nombre es obligatorio" })}
            className="w-full border px-3 py-2 rounded mt-1"
          />
          {errors.nombre && (
            <p className="text-red-600 text-sm">{errors.nombre.message}</p>
          )}
        </div>

        {/* Categoría */}
        <div className="mb-4">
          <label className="block text-gray-700">Categoría</label>
          <input
            type="text"
            {...register("categoria", { required: "La categoría es obligatoria" })}
            className="w-full border px-3 py-2 rounded mt-1"
          />
          {errors.categoria && (
            <p className="text-red-600 text-sm">{errors.categoria.message}</p>
          )}
        </div>

        {/* Costo de Compra */}
        <div className="mb-4">
          <label className="block text-gray-700">Costo de Compra</label>
          <input
            type="number"
            step="0.01"
            {...register("costoCompra", { required: "El costo de compra es obligatorio" })}
            className="w-full border px-3 py-2 rounded mt-1"
          />
          {errors.costoCompra && (
            <p className="text-red-600 text-sm">{errors.costoCompra.message}</p>
          )}
        </div>

        {/* Precio de Venta */}
        <div className="mb-4">
          <label className="block text-gray-700">Precio de Venta</label>
          <input
            type="number"
            step="0.01"
            {...register("precioVenta", { required: "El precio de venta es obligatorio" })}
            className="w-full border px-3 py-2 rounded mt-1"
          />
          {errors.precioVenta && (
            <p className="text-red-600 text-sm">{errors.precioVenta.message}</p>
          )}
        </div>

        {/* Unidad de Medida */}
        <div className="mb-4">
          <label className="block text-gray-700">Unidad de Medida</label>
          <input
            type="text"
            {...register("unidadMedida", { required: "La unidad de medida es obligatoria" })}
            className="w-full border px-3 py-2 rounded mt-1"
          />
          {errors.unidadMedida && (
            <p className="text-red-600 text-sm">{errors.unidadMedida.message}</p>
          )}
        </div>

        {/* Activo */}
        <div className="mb-4 flex items-center gap-2">
          <input type="checkbox" {...register("activo")} />
          <label className="text-gray-700">Activo</label>
        </div>

        {/* Fecha de Creación */}
        <div className="mb-6">
          <label className="block text-gray-700">Fecha de Creación</label>
          <input
            type="date"
            {...register("fechaCreacion", { required: "La fecha es obligatoria" })}
            className="w-full border px-3 py-2 rounded mt-1"
          />
          {errors.fechaCreacion && (
            <p className="text-red-600 text-sm">{errors.fechaCreacion.message}</p>
          )}
        </div>

        <input
          type="submit"
          value="Guardar Cambios"
          className="bg-blue-600 hover:bg-blue-700 w-full p-3 text-white font-bold rounded-lg cursor-pointer transition-colors"
        />
      </form>
    </div>
  );
}
