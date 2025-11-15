// routes/AdminRoutes.tsx
import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout.js";
import { Spinner } from "@/components/utilities-components/Spinner.js";

const routes = [
  { path: "/404", component: lazy(() => import("@/views/NotFound404/NotFound404.js")), roles: [] },
  { path: "*", component: lazy(() => import("@/views/NotFound404/NotFound404.js")), roles: [] },
  // ======== Gestión de Roles ========
  { path: "/rol", component: lazy(() => import("@/views/adminPanel/TableRoleView.js")), roles: [] },
  { path: "/rol/create", component: lazy(() => import("@/views/adminPanel/CreateRol.js")), roles: [] },
  { path: "/rol/edit/:id", component: lazy(() => import("@/views/adminPanel/EditRolView.js")), roles: [] },

  // ======== Gestión de Usuarios ========
  { path: "/user", component: lazy(() => import("@/views/adminPanel/TableUserView.js")), roles: [] },
  { path: "/user/create", component: lazy(() => import("@/views/adminPanel/CreateUserView.js")), roles: [] },

  // ========Productos ========
  { path: "/products", component: lazy(() => import("@/views/Product/TableProduct.js")), roles: [] },
  { path: "/products/create", component: lazy(() => import("@/views/Product/CreateProductView.js")), roles: [] },

    // ======== categorias ========
  { path: "/categories", component: lazy(() => import("@/views/Product/TableProductCategories.js")), roles: [] },
  { path: "/categories/create", component: lazy(() => import("@/views/Product/CreateProductCategories.js")), roles: [] },

  { path: "/orders", component: lazy(() => import("@/views/ProductsOrders/OrdersTable .js")), roles: [] },
  { path: "/orders/start", component: lazy(() => import("@/views/ProductsOrders/NewOrderModal.js")), roles: [] },
  { path: "/orders/menu", component: lazy(() => import("@/views/ProductsOrders/ProductGrid.js")), roles: [] },

  { path: "/ingredients", component: lazy(() => import("@/views/ingredients/TableIngredient.js")), roles: [] },
  { path: "/ingredients/create", component: lazy(() => import("@/views/ingredients/CreateIngredient.js")), roles: [] },

  { path: "/productsIngredients", component: lazy(() => import("@/views/productsIngredients/ProductIngredientsModal.js")), roles: [] },

  
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
