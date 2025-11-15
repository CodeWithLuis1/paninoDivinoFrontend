import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ProductIngredientItem {
  id_ingredient: number;
  ingredient_name: string;
  ingredient_role: string;
  is_default_selected: boolean;
  is_removable: boolean;
  additional_price: number;
  is_active: boolean;
}

interface Props {
  open: boolean;
  product: { id_product: number; name: string } | null;
  ingredients: ProductIngredientItem[];
  onSave: (updated: ProductIngredientItem[]) => void;
  onClose: () => void;
}

export default function ProductIngredientsEditorModal({
  open,
  product,
  ingredients,
  onSave,
  onClose,
}: Props) {
  const [rows, setRows] = useState<ProductIngredientItem[]>([]);

  useEffect(() => {
    if (open) setRows(ingredients);
  }, [open, ingredients]);

  if (!open || !product) return null;

  const toggleIngredient = (id: number) => {
    setRows((prev) =>
      prev.map((ing) =>
        ing.id_ingredient === id && ing.is_removable === true

          ? { ...ing, is_default_selected: !ing.is_default_selected }
          : ing
      )
    );
  };

  const baseIngredients = rows.filter(ing => ing.ingredient_role === "base" && ing.is_active);
  const extraIngredients = rows.filter(ing => ing.ingredient_role === "extra" && ing.is_active);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-white border-b p-6 relative">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            onClick={onClose}
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Personalización (ingredientes base removibles) */}
          {baseIngredients.some(ing => ing.is_removable) && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Personalización (ingredientes removibles):
              </h3>
              <div className="space-y-2">
                {baseIngredients.filter(ing => ing.is_removable).map((ing) => (
                  <label
                    key={ing.id_ingredient}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={ing.is_default_selected}
                      onChange={() => toggleIngredient(ing.id_ingredient)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="flex-1 text-gray-900">{ing.ingredient_name}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * Marcado = mantener ingrediente. Desmarca para removerlo del panini.
              </p>
            </div>
          )}

          {/* Extras opcionales */}
          {extraIngredients.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Extras opcionales:
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {extraIngredients.map((ing) => (
                  <label
                    key={ing.id_ingredient}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                      ing.is_default_selected
                        ? 'bg-blue-50 border-blue-200 hover:border-blue-300'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={ing.is_default_selected}
                        onChange={() => toggleIngredient(ing.id_ingredient)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-900 text-sm">{ing.ingredient_name}</span>
                    </div>
                    {ing.additional_price > 0 && (
                      <span className="text-sm font-medium text-gray-700">
                        Q{ing.additional_price.toFixed(2)}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Ingredientes base (solo info) */}
          {baseIngredients.some(ing => !ing.is_removable) && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-2 text-sm">
                Ingredientes incluidos:
              </h3>
              <p className="text-sm text-gray-600">
                {baseIngredients
                  .filter(ing => !ing.is_removable)
                  .map(ing => ing.ingredient_name)
                  .join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-white p-6 space-y-3">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
              onClick={() => onSave(rows)}
            >
              Agregar pedido lll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}