import api from "@/lib/axios.js";
import { isAxiosError } from "axios";
import { getRoleSchema, createUserSchema } from "@/schemas/typesAdmin.js";
import type { CreateRolFormData, createUserFormData, GetRolesResponse } from "@/schemas/typesAdmin.js";
import {getUserSchema} from "@/schemas/typesAdmin.js";

// ✅ Crear rol
export async function createRoleAPI(formData: CreateRolFormData) {
  try {
    const { data } = await api.post("/role", { name: formData.name }); // correcto
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const msg = error.response.data.message || "Error al crear el rol";
      throw new Error(msg);
    }
    throw error;
  }
}

// ✅ Obtener roles 
export async function getRoleAPI(page: number = 1): Promise<GetRolesResponse> {
  try {
    const limit = 10;
    const offset = page;

    // 🔹 corregido: antes decía "/roles"
    const { data } = await api.get("/role", {
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

// ✅ Crear usuario 
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

// ✅ Obtener usuario 
export async function getUserAPI() {
  try {
    const { data } = await api.get("/users");
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


