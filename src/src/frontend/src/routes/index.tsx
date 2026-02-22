import { createFileRoute } from "@tanstack/react-router";
import { MenuPage } from "@/components/pages/MenuPage";

export const Route = createFileRoute("/")({
  component: MenuPage,
});
