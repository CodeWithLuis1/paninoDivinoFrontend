// import { Link, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import AppointmentForm from "@/components/orders/OrderForm.js";
// import type { OrderFormData } from "@/schemas/types.js";
// import { useMutation,useQueryClient } from "@tanstack/react-query";
// import { updateOrder } from "@/api/OrdersAPI.js";
// import {toast} from 'react-toastify'

// type EditAppointmentFormProps = {
//   data: OrderFormData;
//   appointmentId: number
// };

// export default function EditAppointmentForm({
//   data, appointmentId
// }: EditAppointmentFormProps) {
//   console.log(data);
//   const initialValues: OrderFormData = {
//     clientName:data.clientName,
//     clientEmail:data.clientEmail,
//     clientPhone:data.clientPhone,
//   };
//   const navigate = useNavigate();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },

//   } = useForm<OrderFormData>({
//     defaultValues: {
//       clientName: data.clientName,
//       clientEmail: data.clientEmail,
//       clientPhone: data.clientPhone,
//     },
//   });

//   const queryClient = useQueryClient()

//   const {mutate} = useMutation({
//     mutationFn: updateOrder,
//     onError:(error) => {
//       toast.error(error.message)
//     },
//     onSuccess: (data) =>{
//       queryClient.invalidateQueries({queryKey: ['appointment1']})
//       queryClient.invalidateQueries({queryKey: ["editAppointment", appointmentId]}) //we get the appointmentId from EditAppointmentView.tsx
//       toast.success("Cita actualizada correctamente")
//       navigate('/')
//     }
//   })

//   const handleForm = (formData:OrderFormData) => {
//     const data = {
//       formData,
//       appointmentId
//     }
//     mutate(data)
//   };

//   return (
//     <>
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-5xl font-black">Editar Cita</h1>
//         <p className="text-2xl font-light text-gray-500 mt-5">
//           Llena el siguiente formulario para editar la cita
//         </p>

//         <nav className="my-5">
//           <Link
//             className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
//             to="/"
//           >
//             Volver a citas
//           </Link>
//         </nav>
//         <form
//           className="mt-10 bg-white shadow-lg p-10 rounded-lg"
//           onSubmit={handleSubmit(handleForm)}
//           noValidate
//         >
//           <AppointmentForm
//             register={register} //we get register and errors from line 19 and 23
//             errors={errors}
//           />
//           <input
//             type="submit"
//             value="Guardar Cambios"
//             className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
//           />
//         </form>
//       </div>
//     </>
//   );
// }
