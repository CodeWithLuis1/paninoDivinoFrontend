import api from "@/lib/axios.js";
import { isAxiosError } from "axios";
import { getRoleSchema, createUserSchema } from "@/schemas/typesAdmin.js";
import type { CreateRolFormData, createUserFormData, GetRolesResponse,GetUsersResponse } from "@/schemas/typesAdmin.js";
import {getUserSchema} from "@/schemas/typesAdmin.js";
import { backendSuccessSchema, backendErrorSchema} from "@/schemas/typesAdmin.js";

// ✅ Crear rol
export async function createRoleAPI(formData: CreateRolFormData) {
  try {
    const { data } = await api.post("/role", { name: formData.name });
    const parsed = backendSuccessSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error("Respuesta inesperada del servidor.");
    }
    return parsed.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const parsedError = backendErrorSchema.safeParse(error.response.data);
      const msg = parsedError.success
        ? parsedError.data.error
        : "Error al crear el rol.";
      throw new Error(msg);
    }
    throw new Error("Error desconocido al crear el rol.");
  }
}

// ✅ Obtener roles 
export async function getRoleAPI(page: number = 1): Promise<GetRolesResponse> {
  try {
    const limit = 10;
    const offset = page;
    const { data } = await api.get("/role", { params: { limit, offset } });
    const parsed = getRoleSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error("Respuesta inesperada del servidor al obtener roles.");
    }
    return parsed.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const backendMsg =
        error.response.data.error || "Error al obtener los roles.";
      console.error("Error en getRoleAPI:", backendMsg);
      throw new Error(backendMsg);
    }
    console.error("Error desconocido en getRoleAPI:", error);
    throw new Error("Error inesperado al obtener roles.");
  }
}
// ✅ Editar rol
export async function updateRoleAPI(id: number, formData: CreateRolFormData) {
  try {
    const { data } = await api.put(`/role/${id}`, { name: formData.name });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error al actualizar el rol");
    }
    throw error;
  }
}

// ✅ Eliminar rol
export async function deleteRoleAPI(id: number) {
  try {
    const { data } = await api.delete(`/role/${id}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error al eliminar el rol");
    }
    throw error;
  }
}


export async function createUserAPI(formData: createUserFormData) {
  try {
    const validatedData = createUserSchema.parse(formData);
    const { data } = await api.post("/users"  , validatedData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error al crear el rol");
    }
    throw error;
  }
}

export async function getUserAPI(page: number = 1): Promise<GetUsersResponse> {
  try {
    const limit = 10;
    const { data } = await api.get("/users", { params: { page, limit } }); // ✅ usa 'page' en lugar de 'offset'
    console.log("Datos recibidos de getUserAPI:", data);

    const parsed = getUserSchema.safeParse(data);

    if (!parsed.success) {
      console.error("Error de validación:", parsed.error.format());
      throw new Error("Los datos recibidos del servidor no son válidos");
    }

    return parsed.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error("Error del servidor:", error.response.data);
      throw new Error(
        error.response.data.error || "Error al obtener los usuarios"
      );
    }
    throw error;
  }
}




