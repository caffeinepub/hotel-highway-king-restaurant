import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "./__root";
import { CheckoutPage } from "@/components/pages/CheckoutPage";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/checkout",
  component: CheckoutPage,
});
