import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout.js";
import { Spinner } from "@/components/utilities-components/Spinner.js";

const routes = [
  // ======== 📊 Panel principal ========
  {
    path: "/",
    component: lazy(() => import("@/views/DashboardView.js")),
    roles: [],
  },

  // ======== 🔐 Gestión de Roles ========
  {
    path: "/rol",
    component: lazy(() => import("@/views/adminPanel/TableRoleView.js")),
    roles: [],
  },
  {
    path: "/rol/create",
    component: lazy(() => import("@/views/adminPanel/CreateRol.js")),
    roles: [],
  },
  {
    path: "/rol/edit/:id", // ✅ nueva ruta para editar roles
    component: lazy(() => import("@/views/adminPanel/EditRolView.js")),
    roles: [],
  },

  // ======== 👥 Gestión de Usuarios ========
  {
    path: "/user",
    component: lazy(() => import("@/views/adminPanel/TableUserView.js")),
    roles: [],
  },
  {
    path: "/user/create", // ✅ corregido: apuntar a la vista, no al componente
    component: lazy(() => import("@/views/adminPanel/CreateUserView.js")),
    roles: [],
  },

  // ======== 📦 Gestión de Órdenes ========
  {
    path: "/order/create",
    component: lazy(() => import("@/views/orders/CreateOrdersView.js")),
    roles: [],
  },
  {
    path: "/order/:orderId",
    component: lazy(() => import("@/views/orders/OrderDetailsView.js")),
    roles: [],
  },
  {
    path: "/order/:orderId/edit",
    component: lazy(() => import("@/views/orders/EditOrderView.js")),
    roles: [],
  },

  // ======== 🛍️ Gestión de Productos ========
  {
    path: "/products",
    component: lazy(() => import("@/components/products/ProductsTable.js")),
    roles: [],
  },
  {
    path: "/products/create",
    component: lazy(() => import("@/components/products/ProductForm.js")),
    roles: [],
  },
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
