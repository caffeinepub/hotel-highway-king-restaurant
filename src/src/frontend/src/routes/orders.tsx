import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "./__root";
import { OrdersPage } from "@/components/pages/OrdersPage";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/orders",
  component: OrdersPage,
});
