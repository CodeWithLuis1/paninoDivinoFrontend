// src/data/inventario.js
// Datos quemados de ejemplo. Luego se reemplaza por la API.
export const INVENTARIO_ITEMS = [
  // ---------- Lácteos ----------
  { id: "i-001", nombre: "Queso Mozzarella", categoria: "Lácteos", unidad: "kg", stock: 4.2, stockMin: 3, costoUnit: 62.00, proveedor: "Lácteos GT" },
  { id: "i-002", nombre: "Queso Cheddar",    categoria: "Lácteos", unidad: "kg", stock: 1.1, stockMin: 2, costoUnit: 58.00, proveedor: "Lácteos GT" },
  { id: "i-003", nombre: "Queso Crema",      categoria: "Lácteos", unidad: "kg", stock: 0.0, stockMin: 1, costoUnit: 48.00, proveedor: "Lácteos GT" },

  // ---------- Panadería ----------
  { id: "i-010", nombre: "Pan Chapata",  categoria: "Panadería", unidad: "unid", stock: 18, stockMin: 15, costoUnit: 3.50, proveedor: "Pan Divino" },
  { id: "i-011", nombre: "Bagel",        categoria: "Panadería", unidad: "unid", stock: 8,  stockMin: 20, costoUnit: 3.25, proveedor: "Pan Divino" },
  { id: "i-012", nombre: "Tortitas",     categoria: "Panadería", unidad: "unid", stock: 45, stockMin: 25, costoUnit: 1.10, proveedor: "Pan Divino" },

  // ---------- Cárnicos ----------
  { id: "i-020", nombre: "Jamón de pavo", categoria: "Cárnicos", unidad: "kg",  stock: 1.9, stockMin: 2.5, costoUnit: 52.00, proveedor: "Carnes Select" },
  { id: "i-021", nombre: "Tocino",        categoria: "Cárnicos", unidad: "kg",  stock: 0.7, stockMin: 1.5, costoUnit: 55.00, proveedor: "Carnes Select" },
  { id: "i-022", nombre: "Carne de res",  categoria: "Cárnicos", unidad: "kg",  stock: 6.0, stockMin: 3.0, costoUnit: 68.00, proveedor: "Carnes Select" },

  // ---------- Verduras ----------
  { id: "i-030", nombre: "Espinaca",     categoria: "Verduras", unidad: "kg",  stock: 0.6, stockMin: 1.2, costoUnit: 24.00, proveedor: "Verde Vivo" },
  { id: "i-031", nombre: "Champiñones",  categoria: "Verduras", unidad: "kg",  stock: 2.4, stockMin: 1.0, costoUnit: 36.00, proveedor: "Verde Vivo" },
  { id: "i-032", nombre: "Tomate",       categoria: "Verduras", unidad: "kg",  stock: 3.5, stockMin: 2.0, costoUnit: 15.00, proveedor: "Verde Vivo" },

  // ---------- Otros ----------
  { id: "i-040", nombre: "Camarón",     categoria: "Mar",      unidad: "kg",  stock: 1.0, stockMin: 1.0, costoUnit: 95.00, proveedor: "Mar Abierto" },
  { id: "i-041", nombre: "Salsa Pesto", categoria: "Salsas",    unidad: "lt",  stock: 0.9, stockMin: 1.5, costoUnit: 80.00, proveedor: "Salsarte" },
  { id: "i-042", nombre: "Aderezo casa",categoria: "Salsas",    unidad: "lt",  stock: 1.8, stockMin: 1.0, costoUnit: 60.00, proveedor: "Salsarte" },
];

export const categoriasInventario = [
  "Todos",
  ...Array.from(new Set(INVENTARIO_ITEMS.map(i => i.categoria)))
];
