import React, { useCallback } from 'react';
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema} from "@/schemas/types.js";
import type {OrderFormData } from "@/schemas/types.js";

import ErrorMessage from "../ErrorMessage.js";
import { Plus, Minus, Clock, Utensils, Hash, ShoppingCart } from 'lucide-react';

const paniniCatalog = [
  { id: 1, name: 'Italiano Clásico', description: 'Prosciutto, mozzarella, tomate, albahaca y aceite de oliva', price: 12.99, image: '🥪', cookTime: '8-10 min' },
  { id: 2, name: 'Pollo Pesto', description: 'Pechuga de pollo, pesto, mozzarella y tomates secos', price: 13.99, image: '🥪', cookTime: '10-12 min' },
  { id: 3, name: 'Vegetariano', description: 'Calabacín, pimientos, berenjena, queso de cabra y rúcula', price: 11.99, image: '🥪', cookTime: '6-8 min' },
  { id: 4, name: 'Jamón Serrano', description: 'Jamón serrano, manchego, tomate y aceite de oliva virgen', price: 14.99, image: '🥪', cookTime: '7-9 min' },
  { id: 5, name: 'Caprese', description: 'Mozzarella fresca, tomate, albahaca y vinagre balsámico', price: 10.99, image: '🥪', cookTime: '5-7 min' },
  { id: 6, name: 'Atún Mediterráneo', description: 'Atún, aceitunas, alcaparras, cebolla roja y mayonesa', price: 13.49, image: '🥪', cookTime: '8-10 min' },
];

const waiters = [
  'María García', 'Carlos López', 'Ana Martínez', 'Diego Rodríguez', 
  'Sofia Hernández', 'Miguel Torres', 'Laura Jiménez', 'Pablo Morales'
];

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => void;
}

export default function PaniniOrderForm({ onSubmit }: OrderFormProps) {
  const { register, control, handleSubmit, watch, formState: { errors }, setValue } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      tableNumber: '',
      customerName: '',
      waiter: '',
      priority: 'normal',
      specialInstructions: '',
      items: []
    }
  });

  const { fields, append, remove, update } = useFieldArray({
    name: "items",
    control
  });

  const items = watch("items");
  console.log("Errores del formulario:", errors);

  const addItem = (panini: typeof paniniCatalog[0]) => {
    const existingIndex = items.findIndex(i => i.paniniId === panini.id);
    if (existingIndex >= 0) {
      update(existingIndex, { ...items[existingIndex], quantity: items[existingIndex].quantity + 1 });
    } else {
      append({ paniniId: panini.id, name: panini.name, price: panini.price, quantity: 1 });
    }
  };

  const removeItem = (index: number) => remove(index);

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) remove(index);
    else update(index, { ...items[index], quantity });
  };

  const calculateTotal = useCallback(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  const calculateEstimatedTime = useCallback(() => {
    if (items.length === 0) return '0 min';
    const maxTime = Math.max(...items.map(i => parseInt(i.cookTime?.split('-')[1] || '0')));
    const priorityMultiplier = watch("priority") === 'urgent' ? 0.8 : watch("priority") === 'low' ? 1.2 : 1;
    return `${Math.ceil(maxTime * priorityMultiplier)} min`;
  }, [items, watch("priority")]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Información del Pedido */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center"><Hash className="mr-2 text-amber-600"/> Información del Pedido</h2>

        <div>
          <label>Número de Mesa *</label>
          <input {...register("tableNumber")} className="w-full border px-3 py-2 rounded" />
          {errors.tableNumber && <ErrorMessage>{errors.tableNumber.message}</ErrorMessage>}
        </div>

        <div>
          <label>Nombre del Cliente (opcional)</label>
          <input {...register("customerName")} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label>Mesero *</label>
          <select {...register("waiter")} className="w-full border px-3 py-2 rounded">
            <option value="">Seleccionar mesero</option>
            {waiters.map(waiter => <option key={waiter} value={waiter}>{waiter}</option>)}
          </select>
          {errors.waiter && <ErrorMessage>{errors.waiter.message}</ErrorMessage>}
        </div>

        <div>
          <label>Prioridad</label>
          <div className="flex gap-2 mt-2">
            {["low","normal","urgent"].map(p => (
              <button
                type="button"
                key={p}
                onClick={() => setValue("priority", p as any)}
                className={`px-3 py-1 border rounded ${
                  watch("priority") === p ? 'bg-amber-100 border-amber-500' : ''
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menú de Paninis */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold flex items-center mb-4"><Utensils className="mr-2 text-amber-600"/> Menú de Paninis</h2>
        {errors.items && <ErrorMessage>{errors.items.message}</ErrorMessage>}

        <div className="grid md:grid-cols-2 gap-4">
          {paniniCatalog.map(p => {
            const index = items.findIndex(i => i.paniniId === p.id);
            const quantity = index >= 0 ? items[index].quantity : 0;

            return (
              <div key={p.id} className="border p-4 rounded space-y-2 hover:shadow-md transition">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{p.name}</h3>
                    <div className="text-xs text-gray-500 flex items-center"><Clock className="w-3 h-3 mr-1"/>{p.cookTime}</div>
                    <p className="text-sm text-gray-600">{p.description}</p>
                  </div>
                  <div className="text-lg font-bold text-amber-600">Q{p.price}</div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button type="button" onClick={() => updateQuantity(index, quantity - 1)} disabled={quantity === 0} className="p-1 border rounded"><Minus/></button>
                  <span>{quantity}</span>
                  <button type="button" onClick={() => addItem(p)} className="p-1 border rounded bg-amber-500 text-white"><Plus/></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-2">
        <h2 className="text-xl font-semibold flex items-center"><ShoppingCart className="mr-2 text-amber-600"/> Resumen del Pedido</h2>
        {items.length === 0 ? <p>No hay items seleccionados</p> : (
          <>
            {items.map((item, i) => (
              <div key={item.paniniId} className="flex justify-between">
                <div>{item.name} x{item.quantity}</div>
                <div>Q{(item.price*item.quantity).toFixed(2)}</div>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-2">
              <span>Total</span>
              <span>Q{calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tiempo estimado</span>
              <span>{calculateEstimatedTime()}</span>
            </div>
          </>
        )}
      </div>

      {/* Instrucciones */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <label>Instrucciones Especiales</label>
        <textarea {...register("specialInstructions")} className="w-full border px-3 py-2 rounded" rows={3} />
      </div>

      <button type="submit" className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold">Enviar Pedido</button>
    </form>
  );
}
