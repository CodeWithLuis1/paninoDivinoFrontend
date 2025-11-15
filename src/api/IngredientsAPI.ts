import api from "@/lib/axios.js";
import type { IngredientFormData } from "@/schemas/types.js";
import { getIngredientSchema } from "@/schemas/types.js";
import { isAxiosError } from "axios";


export async function createIngredientAPI(formData: IngredientFormData) {
  try {
    const { data } = await api.post("/ingredients", formData);
    return data;
  } catch (error) {
            if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function getIngredientAPI(page: number = 1) {
  try {
    const limit = 10;
    const { data } = await api.get("/ingredients", {params: { page, limit },});
    const response = getIngredientSchema.safeParse(data);
    console.log("This are the ingredients", response)
      return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Error en la API");
    }
  }
}
