import { createFileRoute } from "@tanstack/react-router";
import { RefundPage } from "@/components/pages/RefundPage";

export const Route = createFileRoute("/refund")({
  component: RefundPage,
});
