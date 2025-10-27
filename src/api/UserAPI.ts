import type { UserFormData } from "@/schemas/typesAdmin.js";
import api  from "@/lib/axios.js";
import { isAxiosError } from "axios";
import { getUserSchema } from "@/schemas/typesAdmin.js";

//this comes from createUserView (UserFormData)
//formData it´s just a name we assinged to the parameter. FormData are data that the user inputs in the form 
export async function createUserAPI(formData: UserFormData) {
  try {
    const { data } = await api.post("/users", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const { data } = error.response;
      // Si vienen errores de validación (express-validator)
      if (Array.isArray(data.errors)) {
        const mensajes = data.errors.map((err: { msg: string }) => err.msg).join("\n");
        throw new Error(mensajes);
      }
      //Si viene un error general (como "usuario ya existe")
      throw new Error(data.error || data.message || "Error desconocido");
    } else {
      //Error de red o desconocido
      throw new Error("Error de red o desconocido");
    }
  }
}

export async function getUserAPI(page:number=1){
    try {
        const limit = 10;
        const offset = page;
        const {data} = await api.get("/users",{params:{limit, offset}})
        const response = getUserSchema.safeParse(data);
        // console.log("getUserAPI - response:", response); //** Always use this line to confirm our zod validation is right  **/
        if(response.success){
            return response.data; //this helps to send the correct data to data in the TableUserView
        }
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}