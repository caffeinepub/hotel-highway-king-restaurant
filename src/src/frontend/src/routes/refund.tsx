import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "./__root";
import { RefundPage } from "@/components/pages/RefundPage";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/refund",
  component: RefundPage,
});
