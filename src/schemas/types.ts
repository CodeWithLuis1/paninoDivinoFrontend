import { z } from "zod";
import { paginationSchema } from "@/schemas/paginateSchemas.js";

export const productSchema = z.object({
  id_product: z.number(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  active: z.boolean(),
  id_category: z.number()
});

export const productsList = (
  productSchema.pick({
    id_product: true,
    name: true,
    description: true,
    image: true,
    active: true,
    id_category: true,
  })
)
export const getProductSchema = paginationSchema(productsList)

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

//orders
export const orderSchema = z.object({
  id_order: z.number(),
  order_number: z.string(),
  id_client: z.number(),
  status: z.string(),
  total_cents: z.number(),
  client: z
    .object({
      client_name: z.string(),
    })
    .nullable()
    .optional(),
  payment: z.any().nullable().optional(),
});

export const ordersList = z.array(orderSchema);
export type OrderListFormData = z.infer<typeof orderSchema>;
export const orderFormSchema = z.object({
  client_name: z.string().min(1, "El nombre del cliente es obligatorio"),
});
export type OrderFormData = z.infer<typeof orderFormSchema>;

// ingredients            
export const ingredientSchema = z.object({
  id_ingredient: z.number(),
  id_product: z.number(),
  name: z.string(),
  quantity_per_product: z.number().nullable(),
  unit: z.string().nullable(),
  track_in_inventory: z.boolean(),
});
export type Ingredient = z.infer<typeof ingredientSchema>;
export type IngredientFormData = Pick<Ingredient,"id_product" | "name" | "quantity_per_product" | "unit">;
