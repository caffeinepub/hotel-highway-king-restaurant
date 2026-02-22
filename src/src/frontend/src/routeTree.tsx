import { Route as rootRoute } from "./routes/__root";
import { Route as indexRoute } from "./routes/index";
import { Route as cartRoute } from "./routes/cart";
import { Route as checkoutRoute } from "./routes/checkout";
import { Route as orderConfirmationRoute } from "./routes/order-confirmation.$orderId";
import { Route as ordersRoute } from "./routes/orders";
import { Route as termsRoute } from "./routes/terms";
import { Route as privacyRoute } from "./routes/privacy";
import { Route as refundRoute } from "./routes/refund";

export const routeTree = rootRoute.addChildren([
  indexRoute,
  cartRoute,
  checkoutRoute,
  orderConfirmationRoute,
  ordersRoute,
  termsRoute,
  privacyRoute,
  refundRoute,
]);
