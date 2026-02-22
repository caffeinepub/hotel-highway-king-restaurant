import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "./__root";
import { PrivacyPage } from "@/components/pages/PrivacyPage";

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/privacy",
  component: PrivacyPage,
});
