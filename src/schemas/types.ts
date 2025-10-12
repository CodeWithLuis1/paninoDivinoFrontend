import { z } from "zod";

export const orderSchema = z.object({
  tableNumber: z.string().min(1, "El número de mesa es requerido"),
  customerName: z.string().optional(),
  waiter: z.string().min(1, "Debe seleccionar un mesero"),
  priority: z.enum(["low", "normal", "urgent"]),
  specialInstructions: z.string().optional(),
  items: z
    .array(
      z.object({
        paniniId: z.number(), // <-- cambió de id a paniniId
        name: z.string(),
        price: z.number(),
        quantity: z.number().min(1),
      })
    )
    .min(1, "Debe seleccionar al menos un panini"),
});

// Para el dashboard, solo incluimos lo más relevante
export const dashboardOrderSchema = z.array(
  orderSchema
    .pick({
      tableNumber: true,
      customerName: true,
      waiter: true,
      priority: true,
      items: true,
    })
    
    .extend({
      id: z.number(),
      items: z
        .array(
          z.object({
            paniniId: z.number(),
            name: z.string(),
            price: z.number(),
            quantity: z.number(),
          })
        )
        .default([]),
    })
);

// Tipos
export type Order = z.infer<typeof orderSchema>;

// Datos que se usarán en el formulario
export type OrderFormData = Pick<
  Order,
  | "tableNumber"
  | "customerName"
  | "waiter"
  | "priority"
  | "specialInstructions"
  | "items"
>;


//Validacion para producto.

export const productSchema = z.object({
  id: z.number().optional(), // generado por la DB
  nombre: z.string().min(1, "El nombre es obligatorio").max(100),
  categoria: z.string().min(1, "La categoría es obligatoria").max(50),
  costoCompra: z.number().positive("El costo de compra debe ser mayor a 0"),
  precioVenta: z.number().positive("El precio de venta debe ser mayor a 0"),
  unidadMedida: z.string().min(1, "La unidad de medida es obligatoria").max(20),
  activo: z.boolean().default(true),
  fechaCreacion: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    "La fecha de creación debe ser válida (YYYY-MM-DD)"
  ),
});

export const dashboardProductSchema = z.array(
  productSchema.pick({
    id: true,
    nombre: true,
    categoria: true,
    precioVenta: true,
    activo: true,
    fechaCreacion: true,
  })
);

// Tipos
export type Product = z.infer<typeof productSchema>;
export type ProductFormData = Omit<Product, "id">;


  