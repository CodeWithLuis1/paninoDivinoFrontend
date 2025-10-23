import type { CreateProduct,BackendSuccess } from "@/schemas/types.js";
import { createProductSchema, backendSuccessSchema} from "@/schemas/types.js";
import api from "@/lib/axios.js";


export const createProductAPI = async (formData: CreateProduct): Promise<BackendSuccess> => {
  try {
    const validated = createProductSchema.parse(formData);
    const { data } = await api.post("/products", validated);
    const parsed = backendSuccessSchema.safeParse(data);
    if (!parsed.success) {
      console.error("Error en la validación del backend:", parsed.error.format());
      throw new Error("Respuesta del servidor no válida");
    }
    return parsed.data;
  } catch (error: any) {
    if (error.name === "ZodError") {
      console.error("Error de validación del cliente:", error.errors);
      throw new Error("Datos inválidos al crear el producto");
    }
    if (error.response) {
      console.error("Error de API:", error.response.data);
      throw new Error(error.response.data.message || "Error al crear el producto");
    }
    console.error("Error inesperado:", error);
    throw new Error("Ocurrió un error inesperado");
  }
};

