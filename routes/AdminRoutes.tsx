

import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import AppLayout from '@/layouts/AppLayout.js';
import { Spinner } from "@/components/utilities-components/Spinner.js";

const routes = [
  { path: "/", component: lazy(() => import("@/views/DashboardView.js")), roles: [] },
  { path: "/order/create", component: lazy(() => import("@/views/orders/CreateOrdersView.js")), roles: [] },
  { path: "/order/:orderId", component: lazy(() => import("@/views/orders/OrderDetailsView.js")), roles: [] },
  { path: "/order/:orderId/edit", component: lazy(() => import("@/views/orders/EditOrderView.js")), roles: [] },
  { path: "/products", component: lazy(() => import("@/components/products/ProductsTable.js")), roles: [] },
  { path: "/products/create", component: lazy(() => import("@/components/products/ProductForm.js")), roles: [] },
];

export default function AdminRoutes() {
 return (
    <Route element={<AppLayout />}>
      {routes.map(({ path, component: Component}) => (
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
