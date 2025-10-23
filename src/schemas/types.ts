import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string(),
  active: z.boolean(),
  id_category: z.number()
});
export const backendSuccessSchema = z.object({
  statusCode: z.number(),
  message: z.string().optional(),
  data: z.object({
    id_product: z.number(),
    name: z.string(),
    description: z.string(),
    image: z.string().url(),
    active: z.boolean(),
    id_category: z.number(),
  }),
});

export type CreateProduct = z.infer<typeof createProductSchema>;
export type BackendSuccess = z.infer<typeof backendSuccessSchema>;



