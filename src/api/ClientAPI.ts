import api from "@/lib/axios.js";
import { isAxiosError } from "axios";
import type { ClientFormData } from "@/schemas/types.js";
import {getClientSchema} from "@/schemas/types.js"


export async function createClientAPI(formData: ClientFormData) {
  try {
    const { data } = await api.post("/client", formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getClientAPI(page: number = 1) {
  try {
    const limit = 10;
    const { data } = await api.get("/client", {params: { page, limit },});
    const response = getClientSchema.safeParse(data);
      return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Error en la API");
    }
  }
}
