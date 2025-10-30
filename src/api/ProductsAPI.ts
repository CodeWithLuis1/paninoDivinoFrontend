
import type { ProductFormData } from "@/schemas/types.js";
import api from "@/lib/axios.js";
import { isAxiosError } from "axios";
import { getProductSchema } from "@/schemas/types.js";

export async function createProductAPI(formData: ProductFormData) {
   console.log("Datos que se enviarán al backend:", formData);
  try {
    const { data } = await api.post("/products", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getProductsAPI(page: number = 1){
  try {
    const limit = 10;
    const offset = page;
    const {data} = await api.get("/products",{params:{limit, offset}})
    const response = getProductSchema.safeParse(data);
    console.log("backend response",response)
    if (response.success){
      return response.data;
    }
  } catch (error) {
        if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}