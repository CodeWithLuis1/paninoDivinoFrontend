import React, { useState } from "react";
import { createIngredientsAPI } from "@/api/IngredientsAPI.js";
import type { IngredientFormData } from "@/schemas/types.js";
import { toast } from "react-toastify";

interface IngredientModalProps {
  idProduct: number;
  onClose: () => void;
}

export function IngredientModal({ idProduct, onClose }: IngredientModalProps) {
  const [ingredients, setIngredients] = useState<IngredientFormData[]>([]);
  const [current, setCurrent] = useState<IngredientFormData>({
    id_product: idProduct,
    name: "",
    quantity_per_product: null,
    unit: "",
  });

  const handleAdd = () => {
    if (!current.name.trim()) {
      toast.warn("El nombre del ingrediente es obligatorio");
      return;
    }
    setIngredients([...ingredients, current]);
    setCurrent({
      id_product: idProduct,
      name: "",
      quantity_per_product: null,
      unit: "",
    });
  };

  const handleSave = async () => {
    if (ingredients.length === 0) {
      toast.warn("Agrega al menos un ingrediente antes de guardar");
      return;
    }
    try {
      await createIngredientsAPI({
        id_product: idProduct,
        ingredients,
      });
      toast.success("Ingredientes guardados correctamente");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar ingredientes");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[500px] p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Agregar Ingredientes
        </h2>

        <div className="flex gap-2 mb-3">
          <input
            className="border rounded p-2 flex-1"
            placeholder="Nombre del ingrediente"
            value={current.name}
            onChange={(e) => setCurrent({ ...current, name: e.target.value })}
          />
          <input
            className="border rounded p-2 w-24"
            type="number"
            placeholder="Cant."
            value={current.quantity_per_product ?? ""}
            onChange={(e) =>
              setCurrent({
                ...current,
                quantity_per_product: Number(e.target.value),
              })
            }
          />
          <input
            className="border rounded p-2 w-24"
            placeholder="Unidad"
            value={current.unit ?? ""}
            onChange={(e) => setCurrent({ ...current, unit: e.target.value })}
          />
          <button
            onClick={handleAdd}
            className="bg-[var(--color-primary)] text-white px-3 rounded hover:bg-[var(--color-primary-dark)]"
          >
            +
          </button>
        </div>

        <ul className="max-h-40 overflow-y-auto border p-2 rounded mb-4">
          {ingredients.map((ing, i) => (
            <li key={i} className="flex justify-between text-sm py-1">
              <span>
                {ing.name}{" "}
                {ing.quantity_per_product
                  ? `(${ing.quantity_per_product} ${ing.unit})`
                  : ""}
              </span>
              <button
                className="text-red-500 hover:underline"
                onClick={() =>
                  setIngredients(ingredients.filter((_, idx) => idx !== i))
                }
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
