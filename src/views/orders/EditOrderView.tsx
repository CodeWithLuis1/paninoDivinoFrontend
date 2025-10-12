import { Navigate,useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "@/api/OrdersAPI.js";
import EditAppointmentForm from "@/components/orders/EditOrderForm.js";

export default function EditOrder() {

  const params = useParams();
  const { orderId } = useParams<{ orderId: string }>();
  // Aseguramos que siempre sea número válido
  const id = Number(orderId);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["editAppointment", orderId],
    queryFn: () => getOrderById(id),
    enabled: !isNaN(id),
    retry: 3 //This will retry 3 times to get the data and if it fails it will show the error message.
  });

  if (isLoading) return 'Cargando...';
  if (isError) return <Navigate to='/404'/>;
  if(data) return <EditAppointmentForm  data={data.data} orderId = {orderId} />
}
