import React from 'react';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';

export default function Ticket() {
  const items = [
    { id: 1, name: 'Santo Porco', price: 30, quantity: 1 },
    { id: 2, name: 'Smoothie Tropical', price: 25, quantity: 2 },
  ];

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const servicio = subtotal * 0.1;
  const total = subtotal + servicio;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl p-6 sticky top-6 border border-amber-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-orange-400 to-amber-400 p-3 rounded-lg shadow-md">
          <ShoppingCart className="text-white" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Ticket</h2>
      </div>

      {/* Items */}
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-amber-100"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-semibold text-slate-700">{item.name}</span>
            <span className="text-orange-600 font-bold">
              Q{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>

          <div className="text-sm text-gray-500 mb-3">
            Unit: Q{item.price.toFixed(2)}
          </div>

          <div className="flex items-center justify-center gap-3 bg-amber-50 rounded-lg p-2">
            <button className="w-8 h-8 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors flex items-center justify-center">
              <Minus size={16} />
            </button>
            <span className="font-semibold text-lg w-8 text-center">
              {item.quantity}
            </span>
            <button className="w-8 h-8 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors flex items-center justify-center">
              <Plus size={16} />
            </button>
            <button className="ml-2 w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}

      {/* Totales */}
      <div className="border-t-2 border-dashed border-amber-200 my-4"></div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-slate-700">
          <span>Subtotal</span>
          <span className="font-semibold">Q{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-700">
          <span>Servicio 10%</span>
          <span className="font-semibold">Q{servicio.toFixed(2)}</span>
        </div>
      </div>

      {/* Total destacado */}
      <div className="flex justify-between items-center text-xl font-bold mb-6 bg-gradient-to-r from-orange-100 via-amber-100 to-orange-200 p-3 rounded-lg">
        <span>Total</span>
        <span className="text-orange-600">Q{total.toFixed(2)}</span>
      </div>

      {/* Botones */}
      <div className="space-y-3">
        <button className="w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-sky-500 hover:to-blue-600 transition-all duration-200 transform hover:scale-105">
          Modificar pedido
        </button>
        <button className="w-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-orange-500 hover:via-amber-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg">
          Confirmar pedido
        </button>
      </div>
    </div>
  );
}
