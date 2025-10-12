import axios from "../lib/axios.js";
import { isAxiosError } from "axios";
import type { LoginRequest } from "../schemas/login.js";
import type{ LoginResponse } from "../schemas/login.js";
import { loginRequestSchema,loginResponseSchema } from "../schemas/login.js";

export async function loginApi(formData: LoginRequest): Promise<LoginResponse> {
  try {
    const parsedData = loginRequestSchema.parse(formData);
    const { data } = await axios.post("/auth/login", parsedData);
    const parsedResponse = loginResponseSchema.parse(data);
    return parsedResponse;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error en el login");
    }
    throw error;
  }
}