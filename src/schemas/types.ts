import { z } from "zod";
import { paginationSchema } from "@/schemas/paginateSchemas.js";


export const productSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string(),
  active: z.boolean(),
  id_category: z.number()
});

export type CreateProduct = z.infer<typeof productSchema>;
export type ProductFormData = Pick<CreateProduct, "name" | "description" | "image" | "active" | "id_category">;

//product category
export const productCategorySchema = z.object({
  id_category: z.number(),
  name: z.string(),
})

export const productCategoriesList=(
  productCategorySchema.pick({
    id_category:true,
    name:true,
  })
)

export const getCategoriesSchema = paginationSchema(productCategoriesList)
export type CreateProductCategory = z.infer<typeof productCategorySchema>;
export type ProductCategoryFormData = Pick<CreateProductCategory, "id_category"|"name" >;
