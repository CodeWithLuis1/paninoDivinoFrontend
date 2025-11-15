import api from "@/lib/axios.js";
import { isAxiosError } from "axios";
import { ordersList } from "@/schemas/types.js";
import type { OrderFormData } from "@/schemas/types.js";

export async function createOrderAPI(formData: OrderFormData) {
  try {
    const { data } = await api.post("/orders", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Error al crear pedido");
    }
    throw error;
  }
}

export async function getOrderAPI() {
  try {
    const { data } = await api.get("/orders"); 
    const response = ordersList.safeParse(data.data);

    if (response.success) return response.data;
    throw new Error("Formato de respuesta no válido");
  } catch (error: any) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error al obtener pedidos");
    }
    throw error;
  }
}

export async function addOrderItemAPI(id_order: number, payload: any) {
  try {
    const { data } = await api.post(`/orders/${id_order}/items`, payload);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Error al agregar producto al pedido");
    }
    throw error;
  }
}