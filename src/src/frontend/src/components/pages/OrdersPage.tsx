import { useNavigate } from "@tanstack/react-router";
import { useOrdersForCaller, useCancelOrder } from "@/hooks/useQueries";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { ShoppingBag, Package, Clock, CheckCircle, X, Loader2 } from "lucide-react";
import { OrderStatus } from "@/backend.d";
import type { Order } from "@/backend.d";

export function OrdersPage() {
  const navigate = useNavigate();
  const { loginStatus, login, identity } = useInternetIdentity();
  const { data: orders = [], isLoading } = useOrdersForCaller();
  const cancelOrder = useCancelOrder();

  const isLoggedIn = loginStatus === "success" && identity;

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="font-display font-bold text-2xl mb-3">
            Login to view orders
          </h2>
          <p className="text-muted-foreground mb-6">
            Please login to see your order history
          </p>
          <Button onClick={login} size="lg">
            {loginStatus === "logging-in" ? "Connecting..." : "Login"}
          </Button>
        </div>
      </div>
    );
  }

  const handleCancelOrder = async (orderId: bigint) => {
    try {
      await cancelOrder.mutateAsync(orderId);
      toast.success("Order cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel order");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-6 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <Package className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="font-display font-bold text-2xl mb-3">
            No orders yet
          </h2>
          <p className="text-muted-foreground mb-6">
            Start ordering delicious food from our menu!
          </p>
          <Button onClick={() => navigate({ to: "/" })} size="lg">
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  // Sort orders by date (newest first)
  const sortedOrders = [...orders].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display font-bold text-3xl mb-2">My Orders</h1>
        <p className="text-muted-foreground mb-8">
          Track and manage your orders
        </p>

        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <OrderCard
              key={order.id.toString()}
              order={order}
              onCancel={handleCancelOrder}
              isCancelling={cancelOrder.isPending}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function OrderCard({
  order,
  onCancel,
  isCancelling,
}: {
  order: Order;
  onCancel: (orderId: bigint) => void;
  isCancelling: boolean;
}) {
  const navigate = useNavigate();

  const statusConfig = {
    [OrderStatus.pending]: {
      icon: Clock,
      color: "bg-warning/10 text-warning border-warning/20",
      label: "Pending",
    },
    [OrderStatus.preparing]: {
      icon: Package,
      color: "bg-primary/10 text-primary border-primary/20",
      label: "Preparing",
    },
    [OrderStatus.ready]: {
      icon: CheckCircle,
      color: "bg-success/10 text-success border-success/20",
      label: "Ready",
    },
    [OrderStatus.completed]: {
      icon: CheckCircle,
      color: "bg-success/10 text-success border-success/20",
      label: "Completed",
    },
    [OrderStatus.cancelled]: {
      icon: X,
      color: "bg-destructive/10 text-destructive border-destructive/20",
      label: "Cancelled",
    },
  };

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  const date = new Date(Number(order.createdAt) / 1000000);
  const canCancel = order.status === OrderStatus.pending;

  return (
    <Card className="hover:shadow-warm transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-display font-bold text-lg">
                Order #{order.id.toString()}
              </h3>
              <Badge className={`${status.color} border`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {status.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {date.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display font-bold text-2xl text-primary">
              ₹{Number(order.total)}
            </p>
            <p className="text-xs text-muted-foreground">
              {order.items.length}{" "}
              {order.items.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Separator />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Order Type</p>
            <p className="font-semibold">
              {order.orderType === "delivery" ? "Delivery" : "Pickup"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Payment</p>
            <p className="font-semibold">
              {order.paymentMethod === "cash" ? "Cash" : "Online"}
              {order.paymentStatus && " ✓"}
            </p>
          </div>
        </div>
        {order.orderType === "delivery" && (
          <div className="bg-muted/50 p-3 rounded-lg text-sm">
            <p className="text-muted-foreground mb-1">Delivery Address</p>
            <p className="font-medium">{order.customerDetails.address}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() =>
            navigate({ to: `/order-confirmation/${order.id}` })
          }
        >
          View Details
        </Button>
        {canCancel && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isCancelling}>
                {isCancelling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Cancel Order"
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel this order? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Order</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onCancel(order.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, Cancel Order
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
}
