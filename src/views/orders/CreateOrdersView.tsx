import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import PaniniOrderForm from "../../components/orders/OrderForm.js";
import { createOrder } from "@/api/OrdersAPI.js";
import type { OrderFormData } from "@/schemas/types.js";

export default function CreateOrderView() {
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: createOrder,
    onError: (error: any) => toast.error(error.message),
    onSuccess: () => {
      toast.success("Pedido creado correctamente");
      navigate("/");
    }
  });

  const handleForm = (data: OrderFormData) => {
    console.log("Payload que se envía:", data);
    mutate(data);
  };

  return (
    <div className="w-full mx-auto">
      <h1 className="text-5xl font-black">Crear pedido</h1>
      <p className="text-2xl text-gray-500 mt-2">Llena el formulario para crear un nuevo pedido</p>

      <div className="mt-6">
        <PaniniOrderForm onSubmit={handleForm} />
      </div>
    </div>
  );
}
