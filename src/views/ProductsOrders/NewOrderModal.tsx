import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderFormSchema } from "@/schemas/types.js";
import type { OrderFormData } from "@/schemas/types.js";
import { createOrderAPI } from "@/api/OrdersAPI.js";
// Lightweight local toast fallback to avoid requiring 'react-toastify' here.
// If you add react-toastify to the project later, you can restore the import.
const toast = {
  success: (msg: string) => {
    // Prefer an in-app non-blocking handler if provided, otherwise log
    if (typeof window !== "undefined" && (window as any).toastFallback) {
      (window as any).toastFallback(msg, "success");
    } else {
      console.log("Success:", msg);
    }
  },
  error: (msg: string) => {
    if (typeof window !== "undefined" && (window as any).toastFallback) {
      (window as any).toastFallback(msg, "error");
    } else {
      console.error("Error:", msg);
    }
  },
};
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const NewOrderModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
  });

const { mutateAsync } = useMutation({
  mutationFn: createOrderAPI,
  onSuccess: (response) => {
    toast.success(response.message || "Pedido iniciado correctamente");
    queryClient.invalidateQueries({ queryKey: ["orders"] });
    reset();
    onSuccess();
    onClose();
    navigate("/orders/menu", {
      state: {
        orderNumber: response.data.order.order_number,
        clientName: response.data.client.client_name,
        idOrder: response.data.order.id_order,
      },
    });
  },
  onError: (error: any) => {
    toast.error(error.message || "Error al crear pedido");
  },
});


  const onSubmit = async (data: OrderFormData) => {
    await mutateAsync(data);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Iniciar Nuevo Pedido</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Cliente
            </label>
            <input
              type="text"
              {...register("client_name")}
              placeholder="Ej. Luis González"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.client_name && (
              <p className="text-sm text-red-600 mt-1">
                {errors.client_name.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {isSubmitting ? "Creando..." : "Iniciar Pedido"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOrderModal;
