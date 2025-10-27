// src/schemas/pagination.schema.ts
import { z } from "zod"

// Este schema define la estructura común de paginación
export const paginationSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    statusCode: z.number(),
    data: z.array(itemSchema),
    total: z.number(),
    limit: z.number().nullable(),
    lastPage: z.number(),
  })

// Tipo genérico de respuesta paginada
export type PaginatedResponse<T> = {
  statusCode: number
  data: T[]
  total: number
  limit: number | null
  lastPage: number
}
