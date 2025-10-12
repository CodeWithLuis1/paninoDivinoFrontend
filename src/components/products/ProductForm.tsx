import { useState } from "react";
import { productSchema} from "@/schemas/types.js";
import type {ProductFormData } from "@/schemas/types.js";


const CreateProductForm = () => {
  const [form, setForm] = useState<ProductFormData>({
    nombre: "",
    categoria: "",
    costoCompra: 0,
    precioVenta: 0,
    unidadMedida: "",
    activo: true,
    fechaCreacion: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar con Zod
    const parsed = productSchema.safeParse({
      ...form,
      costoCompra: Number(form.costoCompra),
      precioVenta: Number(form.precioVenta),
    });

    if (!parsed.success) {
      const formattedErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) {
          formattedErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    setErrors({}); // limpiar errores

    try {
      const response = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const data = await response.json();
      console.log("Producto creado:", data);
      alert("Producto creado exitosamente");

      // Reset
      setForm({
        nombre: "",
        categoria: "",
        costoCompra: 0,
        precioVenta: 0,
        unidadMedida: "",
        activo: true,
        fechaCreacion: "",
      });
    } catch (error) {
      console.error("Error al crear producto:", error);
      alert("Error al crear producto");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Crear Producto</h2>

      {/* Nombre */}
      <label className="block mb-2">
        Nombre:
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded mt-1"
        />
        {errors.nombre && (
          <p className="text-red-600 text-sm">{errors.nombre}</p>
        )}
      </label>

      {/* Categoría */}
      <label className="block mb-2">
        Categoría:
        <input
          type="text"
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded mt-1"
        />
        {errors.categoria && (
          <p className="text-red-600 text-sm">{errors.categoria}</p>
        )}
      </label>

      {/* Costo de Compra */}
      <label className="block mb-2">
        Costo de Compra:
        <input
          type="number"
          step="0.01"
          name="costoCompra"
          value={form.costoCompra}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded mt-1"
        />
        {errors.costoCompra && (
          <p className="text-red-600 text-sm">{errors.costoCompra}</p>
        )}
      </label>

      {/* Precio de Venta */}
      <label className="block mb-2">
        Precio de Venta:
        <input
          type="number"
          step="0.01"
          name="precioVenta"
          value={form.precioVenta}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded mt-1"
        />
        {errors.precioVenta && (
          <p className="text-red-600 text-sm">{errors.precioVenta}</p>
        )}
      </label>

      {/* Unidad de Medida */}
      <label className="block mb-2">
        Unidad de Medida:
        <input
          type="text"
          name="unidadMedida"
          value={form.unidadMedida}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded mt-1"
        />
        {errors.unidadMedida && (
          <p className="text-red-600 text-sm">{errors.unidadMedida}</p>
        )}
      </label>

      {/* Activo */}
      <label className="flex items-center mb-2">
        <input
          type="checkbox"
          name="activo"
          checked={form.activo}
          onChange={handleChange}
          className="mr-2"
        />
        Activo
      </label>

      {/* Fecha de Creación */}
      <label className="block mb-4">
        Fecha de Creación:
        <input
          type="date"
          name="fechaCreacion"
          value={form.fechaCreacion}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded mt-1"
        />
        {errors.fechaCreacion && (
          <p className="text-red-600 text-sm">{errors.fechaCreacion}</p>
        )}
      </label>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Crear Producto
      </button>
    </form>
  );
};

export default CreateProductForm;
