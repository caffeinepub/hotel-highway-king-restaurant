import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "./__root";
import { TermsPage } from "@/components/pages/TermsPage";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/terms",
  component: TermsPage,
});
