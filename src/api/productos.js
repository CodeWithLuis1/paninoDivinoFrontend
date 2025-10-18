// src/api/productos.js
// Catálogo mock con casos que necesitas probar:
// - Paninis con variantes/extras/removibles (incluye "Panza Llena")
// - Bebidas calientes duplicadas 8oz/12oz para unificación
// - Bebidas frías 12oz (excluir 8oz en frías)
// - Smoothies 12oz
// - Bagels

const CATALOG = [
  // ---------- PANINIS ----------
  { id: 1, nombre: "Santo Porco", categoria: "Panini", precio: 30 },
  { id: 2, nombre: "Santo Bocado", categoria: "Panini", precio: 28 },
  { id: 3, nombre: "Pecado Perfecto", categoria: "Panini", precio: 32 },
  { id: 4, nombre: "Terra y Cielo", categoria: "Panini", precio: 31 },
  { id: 5, nombre: "Panza Llena", categoria: "Panini", precio: 25 },

  // ---------- BEBIDAS CALIENTES (duplicadas 8oz/12oz para unificar) ----------
  { id: 101, nombre: "Chai 8oz", categoria: "Caliente", precio: 20 },
  { id: 102, nombre: "Chai 12oz", categoria: "Caliente", precio: 24 },

  { id: 103, nombre: "Dirty Chai 8oz", categoria: "Caliente", precio: 23 },
  { id: 104, nombre: "Dirty Chai 12oz", categoria: "Caliente", precio: 27 },

  { id: 105, nombre: "Té Sabores 8oz", categoria: "Caliente", precio: 16 },
  { id: 106, nombre: "Té Sabores 12oz", categoria: "Caliente", precio: 19 },

  // ---------- BEBIDAS FRÍAS (solo 12oz deben mostrarse en 'frías') ----------
  { id: 201, nombre: "Chai Frío 12oz", categoria: "Fría", precio: 24 },
  { id: 202, nombre: "Dirty Chai Frío 12oz", categoria: "Fría", precio: 27 },
  { id: 203, nombre: "Té Sabores Frío 12oz", categoria: "Fría", precio: 19 },
  // (si tuvieras “8oz” frías, se excluirán por la lógica del editor)

  // ---------- SMOOTHIES 12oz ----------
  { id: 301, nombre: "Smoothie Fresa 12oz", categoria: "Smoothie", precio: 22 },
  { id: 302, nombre: "Smoothie Mango 12oz", categoria: "Smoothie", precio: 22 },

  // ---------- BAGELS ----------
  { id: 401, nombre: "Bagel Clásico", categoria: "Bagel", precio: 15 },
  { id: 402, nombre: "Bagel con Queso Crema", categoria: "Bagel", precio: 18 },
];

export async function getProductos() {
  // Para simular latencia:
  await new Promise(r => setTimeout(r, 150));
  // Devuelve un arreglo simple (tu editor soporta {data:[...]} o [...])
  return CATALOG;
}
