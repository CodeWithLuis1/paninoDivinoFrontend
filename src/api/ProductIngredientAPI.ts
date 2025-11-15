
import type { ProductIngredientFormData } from "@/schemas/types.js";
import api from "@/lib/axios.js";
import { isAxiosError } from "axios";
import { productIngredientsResponseSchema } from "@/schemas/types.js";


export async function createProducIngredientAPI(formData: ProductIngredientFormData) {
  try {
    const { data } = await api.post("/productIngredient", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

// export async function getProductIngredientAPI()

export async function getProductIngredientsAPI(id_product: number) {
  try {
    const { data } = await api.get(`/products/${id_product}/ingredients`);

    const response = productIngredientsResponseSchema.safeParse(data);
    console.log("This is the thing that the backen return ",response)

    if (!response.success) {
      console.error("Error de validación Zod:", response.error);
      throw new Error("La respuesta del servidor no es válida");
    }

    return response.data.data; 
    // Retorna SOLO lo útil: {id_product, name, price, ingredients}
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Error en la API");
    }
    throw error;
  }
}