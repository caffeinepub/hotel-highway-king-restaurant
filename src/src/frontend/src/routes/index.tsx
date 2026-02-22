import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "./__root";
import { MenuPage } from "@/components/pages/MenuPage";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: MenuPage,
});
