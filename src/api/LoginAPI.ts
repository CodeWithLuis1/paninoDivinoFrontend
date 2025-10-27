import api from "@/lib/axios.js";
import { isAxiosError } from "axios";
import type { LoginRequest,LoginResponse } from "@/schemas/typesAdmin.js";
import { loginRequestSchema,loginResponseSchema } from "@/schemas/typesAdmin.js";

export async function loginApi(formData: LoginRequest): Promise<LoginResponse> {
  try {
    const parsedData = loginRequestSchema.parse(formData);
    const { data } = await api.post("/auth/login", parsedData);
    const parsedResponse = loginResponseSchema.parse(data);
    return parsedResponse;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error en el login");
    }
    throw error;
  }
}

