import type { CreateProduct, BackendSuccess } from "@/schemas/types.js";
import { createProductSchema, backendSuccessSchema } from "@/schemas/types.js";
import api from "@/lib/axios.js";
import { isAxiosError } from "axios";

export function createProductAPI(formData:) {
  const {data} = await api.post("/products",formData)
  try {
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
