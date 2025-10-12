import type { Order, OrderFormData } from "@/schemas/types.js";
import api from "@/lib/axios.js";
import { isAxiosError } from "axios";
import { dashboardOrderSchema } from "@/schemas/types.js";

/**
 * Crear un pedido
 */
export async function createOrder(formData: OrderFormData) {
  try {
    const { data } = await api.post('/order', formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Error desconocido al crear pedido');
    }
    throw error;
  }
}

/**
 * Obtener todos los pedidos validados por Zod
 */
export async function getOrders() {
  try {
    const { data } = await api.get('/order');
    const parsed = dashboardOrderSchema.safeParse(data.data || []);
    if (!parsed.success) {
      console.error("Error validando datos de la API:", parsed.error);
      return [];
    }
    return parsed.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Error desconocido al obtener pedidos');
    }
    throw error;
  }
}

/**
 * Obtener un pedido por id
 */
export async function getOrderById(id: Order['id']) {
  try {
    const { data } = await api.get(`/order/${id}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Error desconocido al obtener pedido');
    }
    throw error;
  }
}

/**
 * Actualizar un pedido
 */
type OrderAPIType = {
  formData: OrderFormData;
  orderId: Order['id'];
};

export async function updateOrder({ formData, orderId }: OrderAPIType) {
  try {
    const { data } = await api.put(`/order/${orderId}`, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Error desconocido al actualizar pedido');
    }
    throw error;
  }
}

/**
 * Eliminar un pedido
 */
export async function deleteOrder(id: Order['id']) {
  try {
    const { data } = await api.delete(`/order/${id}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Error desconocido al eliminar pedido');
    }
    throw error;
  }
}
