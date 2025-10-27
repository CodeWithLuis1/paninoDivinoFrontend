//agregar aca el consumo de la api para las categorias
import api from "@/lib/axios.js";
import { isAxiosError } from "axios";
import type { ProductCategoryFormData } from "@/schemas/types.js";
import {getCategoriesSchema} from "@/schemas/types.js"

export async function ProductCategoryAPI(formData:ProductCategoryFormData) {
    try {
        const {data} = await api.post("/category", formData);
        return data;
    } catch (error) {
            if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}
export async function getCategoriesAPI(page:number = 1 ){
    try {
        const limit = 10;
        const offset = page;
        const {data} = await api.get("/category",{params:{limit, offset}})
        const response = getCategoriesSchema.safeParse(data);
        // console.log(response)
        if(response.success){
            return response.data;
        }

    } catch (error) {
            if(isAxiosError(error) && error.response){
                throw new Error(error.response.data.error);
            }
    }
}
