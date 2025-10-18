// routes/AdminRoutes.tsx
import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout.js";
import { Spinner } from "@/components/utilities-components/Spinner.js";

const routes = [
  // ======== 📊 Panel principal ========
  { path: "/", component: lazy(() => import("@/views/DashboardView.js")), roles: [] },

  // ======== 🔐 Gestión de Roles ========
  { path: "/rol", component: lazy(() => import("@/views/adminPanel/TableRoleView.js")), roles: [] },
  { path: "/rol/create", component: lazy(() => import("@/views/adminPanel/CreateRol.js")), roles: [] },
  { path: "/rol/edit/:id", component: lazy(() => import("@/views/adminPanel/EditRolView.js")), roles: [] },

  // ======== 👥 Gestión de Usuarios ========
  { path: "/user", component: lazy(() => import("@/views/adminPanel/TableUserView.js")), roles: [] },
  { path: "/user/create", component: lazy(() => import("@/views/adminPanel/CreateUserView.js")), roles: [] },

  // ======== 📦 Pedidos (lista + editor) ========
  { path: "/pedidos", component: lazy(() => import("@/pages/PedidosPage.jsx")), roles: [] },
  { path: "/pedidos/:id", component: lazy(() => import("@/pages/pedidos/PedidoEditor.jsx")), roles: [] },
  { path: "/order/create", component: lazy(() => import("@/pages/pedidos/PedidoEditor.jsx")), roles: [] },

  // ======== 💳 Cobros ========
  { path: "/cobros/:id", component: lazy(() => import("@/pages/cobros/CobroPage.jsx")), roles: [] },

  // (Opcional/legacy)
  { path: "/order/:orderId", component: lazy(() => import("@/views/orders/OrderDetailsView.js")), roles: [] },
  { path: "/order/:orderId/edit", component: lazy(() => import("@/views/orders/EditOrderView.js")), roles: [] },

  // ======== 🛍️ Productos ========
  { path: "/products", component: lazy(() => import("@/components/products/ProductsTable.js")), roles: [] },
  { path: "/products/create", component: lazy(() => import("@/components/products/ProductForm.js")), roles: [] },

  // ======== 🧰 Inventario (nuevo) ========
  // Asegúrate de que el componente por defecto esté exportado en "@/pages/inventario/Inventario.jsx"
  { path: "/inventario", component: lazy(() => import("@/pages/inventario/Inventario.jsx")), roles: [] },
];

export default function AdminRoutes() {
  return (
    <Route element={<AppLayout />}>
      {routes.map(({ path, component: Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <Suspense fallback={<Spinner />}>
              <Component />
            </Suspense>
          }
        />
      ))}
    </Route>
  );
}
