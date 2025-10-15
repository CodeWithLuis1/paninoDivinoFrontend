import api from "@/lib/axios.js";
import { isAxiosError } from "axios";
import { getRoleSchema,createUserSchema } from "@/schemas/typesAdmin.js";
import type { CreateRolFormData,createUserFormData,GetRolesResponse } from "@/schemas/typesAdmin.js";

export async function createRoleAPI(formData: CreateRolFormData) {
  try {
    const { data } = await api.post("/role", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error al crear el rol");
    }
    throw error;
  }
}

export async function getRoleAPI(page: number = 1): Promise<GetRolesResponse> {
  try {
    const limit = 10;
    const offset = page;

    const { data } = await api.get("/roles", {
      params: { limit, offset },
    });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error("Error en getRoleAPI:", error.response.data);
    } else {
      console.error("Error desconocido en getRoleAPI:", error);
    }
    throw error;
  }
}

//Create user.

export async function createUserAPI(formData: createUserFormData) {
  try {
    const validatedData = createUserSchema.parse(formData);
    const { data } = await api.post("/register", validatedData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error al crear el rol");
    }
    throw error;
  }
}


export async function getUserAPI() {
  try {
    const { data } = await api.get("/register");
    const parsed = getRoleSchema.safeParse(data);
    if (!parsed.success) {
      console.error("Error de validación:", parsed.error.format());
      throw new Error("Los datos recibidos del servidor no son válidos");
    }

    return parsed.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error("Error del servidor:", error.response.data);
      throw new Error(
        error.response.data.error || "Error al obtener los roles"
      );
    }
    throw error;
  }
}