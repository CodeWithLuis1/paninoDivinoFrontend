import { useQuery } from "@tanstack/react-query";
import { getIngredientAPI } from "@/api/IngredientsAPI.js";
import { X } from "lucide-react";
import { useState } from "react";
import type { ProductIngredient } from "@/schemas/types.js";

type IngredientModalProps = {
  idProduct?: number;
  standalone?: boolean;
  onClose: (ingredients: ProductIngredient[] | null) => void;
};
type IngredientConfig = Partial<ProductIngredient> & {
  selected?: boolean;
};

export function IngredientModal({ idProduct, onClose }: IngredientModalProps) {
  const [ingredientsState, setIngredientsState] =
    useState<Record<number, IngredientConfig>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["ingredients"],
    queryFn: () => getIngredientAPI(1),
  });
  const ingredientsList = data?.data || [];

  const updateField = (
    id: number,
    field: keyof ProductIngredient,
    value: any
  ) => {
    setIngredientsState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const toggleSelect = (id: number, isSelected: boolean) => {
    setIngredientsState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        selected: isSelected,
      },
    }));
  };

  const handleSubmit = () => {
    const formatted: ProductIngredient[] = Object.entries(ingredientsState)
      .filter(([_, v]) => v.selected)
      .map(([id, v]) => ({
        ingredient_id: Number(id),
        ingredient_role: v.ingredient_role ?? "extra",
        is_default_selected: v.is_default_selected ?? false,
        is_removable: v.is_removable ?? true,
        additional_price: Number(v.additional_price) || 0,
        is_active: v.is_active ?? true,
      }));

    onClose(formatted);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 relative animate-fadeIn">

        {/* Botón cerrar */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => onClose(null)}
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-5">
          Seleccionar Ingredientes del Producto
        </h2>

        {isLoading ? (
          <p>Cargando ingredientes...</p>
        ) : (
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th>El producto
                     usará el ingrediente</th>
                  <th>Ingrediente</th>
                  <th>Rol</th>
                  <th>Base(No se puede elimina)</th>
                  <th>Removable</th>
                  <th>Precio Extra</th>
                  <th>Activo</th>
                </tr>
              </thead>

              <tbody>
                {ingredientsList.map((ing) => (
                  <tr
                    key={ing.ingredient_id}
                    className="text-center border-b"
                  >
                    <td>
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          toggleSelect(ing.ingredient_id, e.target.checked)
                        }
                      />
                    </td>

                    <td>{ing.ingredient_name}</td>

                    <td>
                      <select
                        onChange={(e) =>
                          updateField(
                            ing.ingredient_id,
                            "ingredient_role",
                            e.target.value
                          )
                        }
                        className="border px-2 py-1 rounded"
                      >
                        <option value="extra">Extra</option>
                        <option value="base">Base</option>
                      </select>
                    </td>

                    <td>
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          updateField(
                            ing.ingredient_id,
                            "is_default_selected",
                            e.target.checked
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        defaultChecked
                        onChange={(e) =>
                          updateField(
                            ing.ingredient_id,
                            "is_removable",
                            e.target.checked
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="border px-2 py-1 w-20 rounded"
                        onChange={(e) =>
                          updateField(
                            ing.ingredient_id,
                            "additional_price",
                            Number(e.target.value)
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="checkbox"
                        defaultChecked
                        onChange={(e) =>
                          updateField(ing.ingredient_id, "is_active", e.target.checked)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          onClick={handleSubmit}
        >
          Guardar Ingredientes
        </button>
      </div>
    </div>
  );
}
