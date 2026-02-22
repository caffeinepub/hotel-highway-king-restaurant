import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "./__root";
import { CartPage } from "@/components/pages/CartPage";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/cart",
  component: CartPage,
});
