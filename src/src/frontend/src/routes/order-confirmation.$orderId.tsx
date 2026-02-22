import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "./__root";
import { OrderConfirmationPage } from "@/components/pages/OrderConfirmationPage";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/order-confirmation/$orderId",
  component: OrderConfirmationPage,
});
