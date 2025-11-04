import api from "@/lib/axios.js";
import type { IngredientFormData } from "@/schemas/types.js";
import { isAxiosError } from "axios";

type CreateIngredientsPayload =
  | {
      id_product: number;
      ingredients: IngredientFormData[];
    }
  | {
      id_product: number;
      ingredients: IngredientFormData;
    };

export async function createIngredientsAPI(payload: CreateIngredientsPayload) {
  try {
     console.log("📦 Payload enviado al backend:", payload);
    const { data } = await api.post("/ingredients", payload);
    console.log("Ingredientes creados:", data);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error API:", error.response?.data);
      throw new Error(error.response?.data?.message || "Error en la API");
    }
    throw error;
  }
}
