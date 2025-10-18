// src/api/pedidos.js
// ========================================================
// Estado mock persistente en HMR usando globalThis
// ========================================================
const G = globalThis;

// Inicializa “singleton” de estado si no existe
if (!G.__PANINO_STATE__) {
  G.__PANINO_STATE__ = {
    counters: {
      nextOrderId: 1000,
      nextItemId: 1,
    },
    db: {
      orders: {
        1001: { id: 1001, cliente: "Ana Ruyan",  estado: "PREPARACION", numero_orden: "01", numero_dia: "01", total: 176, items: [] },
        1002: { id: 1002, cliente: "Luis Sutuj", estado: "PREPARACION", numero_orden: "20", numero_dia: "20", total: 105, items: [] },
        1003: { id: 1003, cliente: "walter s",   estado: "PREPARACION", numero_orden: "01", numero_dia: "01", total:  40, items: [] },
      },
    },
  };
}

const STATE = G.__PANINO_STATE__;
const ESTADOS = { PREPARACION: "PREPARACION", LISTO: "LISTO", CERRADO: "CERRADO" };

const asArray = (obj) => Object.values(obj || {});
const safeNum = (n) => (Number.isFinite(Number(n)) ? Number(n) : 0);

// ========================================================
// API
// ========================================================

export async function getNextOrderNumber() {
  await new Promise((r) => setTimeout(r, 60));
  // correlativo del día = (nextOrderId + 1) % 100
  return (STATE.counters.nextOrderId + 1) % 100;
}

export async function getPedidos(params = {}) {
  await new Promise((r) => setTimeout(r, 120));
  const { estado } = params;
  let rows = asArray(STATE.db.orders).map((o) => ({
    id: o.id,
    cliente: o.cliente || "—",
    estado: o.estado,
    numero_orden: o.numero_orden || "00",
    total: o.total ?? 0,
  }));
  if (estado) rows = rows.filter((r) => r.estado === estado);
  return rows;
}

export async function createPedido({ cliente = "Sin nombre" } = {}) {
  await new Promise((r) => setTimeout(r, 100));
  const id = ++STATE.counters.nextOrderId;
  const correlativo = String(id % 100).padStart(2, "0");
  STATE.db.orders[id] = {
    id,
    cliente,
    estado: ESTADOS.PREPARACION,
    numero_orden: correlativo,
    numero_dia: correlativo,
    total: 0,
    items: [],
  };
  return { id };
}

export async function getPedidoById(id) {
  await new Promise((r) => setTimeout(r, 80));
  if (!STATE.db.orders[id]) {
    const nid = ++STATE.counters.nextOrderId;
    const correlativo = String(nid % 100).padStart(2, "0");
    STATE.db.orders[id] = {
      id,
      cliente: "Sin nombre",
      estado: ESTADOS.PREPARACION,
      numero_orden: correlativo,
      numero_dia: correlativo,
      total: 0,
      items: [],
    };
  }
  const o = STATE.db.orders[id];
  return {
    id: o.id,
    cliente: o.cliente,
    estado: o.estado,
    numero_orden: o.numero_orden,
    numero_dia: o.numero_dia,
  };
}

export async function getPedidoItems(id) {
  await new Promise((r) => setTimeout(r, 80));
  const order = STATE.db.orders[id] || { items: [] };
  return order.items;
}

export async function addPedidoItem(orderId, payload) {
  await new Promise((r) => setTimeout(r, 80));
  const order =
    STATE.db.orders[orderId] ||
    (STATE.db.orders[orderId] = {
      id: orderId,
      cliente: "Sin nombre",
      estado: ESTADOS.PREPARACION,
      numero_orden: "00",
      numero_dia: "00",
      total: 0,
      items: [],
    });

  const lineTotal = safeNum(payload?.subtotal);

  // Línea padre
  const parent = {
    id: ++STATE.counters.nextItemId,
    nombre: `${payload?.name || "Item"}${
      payload?.variant ? ` (${payload.variant})` : ""
    }${
      Array.isArray(payload?.extras_detalle) && payload.extras_detalle.length
        ? " + extras"
        : ""
    }`,
    qty: payload?.qty ?? 1,
    total: lineTotal,
    options: {
      variant: payload?.variant || null,
      sauce: payload?.sauce || null,
      removibles: payload?.removibles || [],
      choices: payload?.choices || {},
    },
  };
  order.items.push(parent);

  // Extras como líneas hijas
  if (Array.isArray(payload?.extras_detalle)) {
    for (const ex of payload.extras_detalle) {
      order.items.push({
        id: ++STATE.counters.nextItemId,
        nombre: `· Extra: ${ex.label}`,
        qty: 1,
        total: safeNum(ex.price),
        parent_item_id: parent.id,
      });
    }
  }

  // Recalcula total del pedido (solo líneas padre)
  order.total = order.items
    .filter((it) => !it.parent_item_id)
    .reduce((acc, it) => acc + safeNum(it.total), 0);

  // Devuelve items para refrescar Ticket sin otra llamada
  return { ok: true, parent_id: parent.id, items: order.items };
}

// ===== Acciones de línea en Ticket =====
export async function removePedidoItem(orderId, itemId) {
  await new Promise((r) => setTimeout(r, 60));
  const order = STATE.db.orders[orderId];
  if (!order) return { ok: false };

  // borra hijas primero
  order.items = order.items.filter(
    (it) => it.id !== itemId && it.parent_item_id !== itemId
  );

  order.total = order.items
    .filter((it) => !it.parent_item_id)
    .reduce((acc, it) => acc + safeNum(it.total), 0);

  return { ok: true, items: order.items };
}

export async function updatePedidoItem(orderId, itemId, { qty }) {
  await new Promise((r) => setTimeout(r, 60));
  const order = STATE.db.orders[orderId];
  if (!order) return { ok: false };

  const it = order.items.find((x) => x.id === itemId && !x.parent_item_id);
  if (!it) return { ok: false };

  const newQty = Math.max(1, Number(qty) || 1);
  const unit = it.qty > 0 ? safeNum(it.total) / it.qty : safeNum(it.total);
  it.qty = newQty;
  it.total = Number((unit * newQty).toFixed(2));

  order.total = order.items
    .filter((n) => !n.parent_item_id)
    .reduce((acc, n) => acc + safeNum(n.total), 0);

  return { ok: true, items: order.items };
}

// ===== Confirmación de pedido =====
export async function confirmPedido(orderId, { serviceRate = 0.10 } = {}) {
  await new Promise((r) => setTimeout(r, 80));
  const o = STATE.db.orders[orderId];
  if (!o) return { ok: false };

  const subtotal = o.items
    .filter((it) => !it.parent_item_id)
    .reduce((acc, it) => acc + safeNum(it.total), 0);

  const servicio = Number((subtotal * serviceRate).toFixed(2));
  const total = Number((subtotal + servicio).toFixed(2));

  o.estado = "LISTO";
  o.total = subtotal; // mantenemos 'total' como subtotal para la tabla (mock)

  return {
    ok: true,
    resumen: {
      id: o.id,
      cliente: o.cliente || "Sin nombre",
      numero: o.numero_dia || o.numero_orden || "00",
      items: o.items,
      subtotal,
      servicio,
      total,
    },
  };
}
