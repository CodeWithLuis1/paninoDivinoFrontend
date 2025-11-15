import { boolean, number, z } from "zod";
import { paginationSchema } from "@/schemas/paginateSchemas.js";

export const productSchema = z.object({
  id_product: z.number(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  active: z.boolean(),
  id_category: z.number(),
  price: z.string().transform((v) => Number(v))
});

export const productsList = (
  productSchema.pick({
    id_product: true,
    name: true,
    description: true,
    image: true,
    active: true,
    id_category: true,
    price:true
  })
)
export const getProductSchema = paginationSchema(productsList)
export type CreateProduct = z.infer<typeof productSchema>;
export type ProductFormData = Pick<CreateProduct, "name" | "description" | "image" | "active" | "id_category" | "price">;

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
  ingredient_id: z.number(),
  ingredient_name: z.string(),
  is_active: z.boolean(),
});

export const ingredientSchemaList=(
  ingredientSchema.pick({
    ingredient_id:true,
    ingredient_name:true,
  })
)
export const getIngredientSchema = paginationSchema(ingredientSchemaList)
export type Ingredient = z.infer<typeof ingredientSchema>;
export type IngredientFormData = Pick<Ingredient,"ingredient_name">;

// productIngredient

export const productIngredient = z.object({
  ingredient_id: z.number(),
  ingredient_role: z.enum(["extra", "base"]),
  is_default_selected: z.boolean(),
  is_removable: z.boolean(),
  additional_price: z.number(), 
  is_active: z.boolean(),
});

export const createProductIngredientsSchema = z.object({
  product_id: z.number(),
  ingredients: z.array(productIngredient),
});

export type ProductIngredient = z.infer<typeof productIngredient>;
export type ProductIngredientFormData = z.infer<typeof createProductIngredientsSchema>;

// client

export const clientSchema = z.object({
  id_client : z.number(),
  client_name: z.string()
})

export const clientList = (
  clientSchema.pick({
    id_client: true,
    client_name: true,
  })
)

export const getClientSchema = paginationSchema(clientList)
export type Client = z.infer<typeof clientSchema>;
export type ClientFormData = Pick<Client, "client_name">


// Get all the product´s ingredients 
export const productIngredientItemSchema = z.object({
  id_ingredient: z.number(),
  ingredient_name: z.string(),
  ingredient_role: z.enum(["base", "extra"]),
  is_default_selected: z.boolean(),
  is_removable: z.boolean(),
  additional_price: z.number(),
  is_active: z.boolean(),
});

export const productIngredientsResponseSchema = z.object({
  statusCode: z.number(),
  data: z.object({
    id_product: z.number(),
    name: z.string(),
    price: z.number(),
    ingredients: z.array(productIngredientItemSchema)
  })
});

export type ProductIngredientItem = z.infer<typeof productIngredientItemSchema>;
export type ProductIngredientsResponse = z.infer<typeof productIngredientsResponseSchema>;
