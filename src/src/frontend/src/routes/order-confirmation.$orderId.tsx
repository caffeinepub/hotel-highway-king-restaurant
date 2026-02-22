import { createFileRoute } from "@tanstack/react-router";
import { OrderConfirmationPage } from "@/components/pages/OrderConfirmationPage";

export const Route = createFileRoute("/order-confirmation/$orderId")({
  component: OrderConfirmationPage,
});
