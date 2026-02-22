import { useParams, useNavigate } from "@tanstack/react-router";
import { useOrder } from "@/hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, Package, Truck, ArrowLeft } from "lucide-react";
import { OrderStatus } from "@/backend.d";

export function OrderConfirmationPage() {
  const { orderId } = useParams({ from: "/order-confirmation/$orderId" });
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(BigInt(orderId));

  const statusConfig = {
    [OrderStatus.pending]: {
      icon: Clock,
      color: "bg-warning text-warning-foreground",
      label: "Pending",
      description: "We've received your order and will confirm shortly",
    },
    [OrderStatus.preparing]: {
      icon: Package,
      color: "bg-primary text-primary-foreground",
      label: "Preparing",
      description: "Your delicious meal is being prepared",
    },
    [OrderStatus.ready]: {
      icon: CheckCircle,
      color: "bg-success text-success-foreground",
      label: "Ready",
      description: "Your order is ready for pickup or delivery",
    },
    [OrderStatus.completed]: {
      icon: CheckCircle,
      color: "bg-success text-success-foreground",
      label: "Completed",
      description: "Order delivered successfully",
    },
    [OrderStatus.cancelled]: {
      icon: Clock,
      color: "bg-destructive text-destructive-foreground",
      label: "Cancelled",
      description: "This order has been cancelled",
    },
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="h-8 w-64 bg-muted animate-pulse rounded mb-6" />
          <Card>
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="h-6 bg-muted animate-pulse rounded" />
                <div className="h-6 bg-muted animate-pulse rounded" />
                <div className="h-6 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-2xl mb-3">
            Order not found
          </h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find the order you're looking for
          </p>
          <Button onClick={() => navigate({ to: "/" })}>Back to Menu</Button>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  const subtotal = Number(order.total) - Number(order.tax) - Number(order.deliveryFee);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: "/orders" })}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            View All Orders
          </Button>

          {/* Success Message */}
          <Card className="mb-6 border-2 border-success/20 shadow-warm-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h1 className="font-display font-bold text-3xl mb-2">
                Order Confirmed!
              </h1>
              <p className="text-muted-foreground mb-4">
                Thank you for your order. We'll prepare it with care.
              </p>
              <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
                <span className="text-sm text-muted-foreground">Order ID:</span>
                <span className="font-mono font-bold">#{order.id.toString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full ${status.color} flex items-center justify-center shrink-0`}>
                  <StatusIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-bold text-lg">
                      {status.label}
                    </h3>
                    <Badge className={status.color}>{status.label}</Badge>
                  </div>
                  <p className="text-muted-foreground">{status.description}</p>
                  {order.status === OrderStatus.preparing && (
                    <p className="text-sm text-primary mt-2 font-medium">
                      Estimated time: 30-40 minutes
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                {order.orderType === "delivery" ? (
                  <Truck className="w-5 h-5 text-primary mt-0.5" />
                ) : (
                  <Package className="w-5 h-5 text-primary mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">
                    {order.orderType === "delivery"
                      ? "Home Delivery"
                      : "Pickup from Restaurant"}
                  </p>
                  {order.orderType === "delivery" && (
                    <p className="text-sm text-muted-foreground">
                      {order.customerDetails.address}
                    </p>
                  )}
                </div>
              </div>
              <Separator />
              <div>
                <p className="font-semibold">{order.customerDetails.name}</p>
                <p className="text-sm text-muted-foreground">
                  {order.customerDetails.phone}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.customerDetails.email}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Item #{item.itemId.toString()} x {item.quantity.toString()}
                    </span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-semibold">₹{Number(order.tax)}</span>
                </div>
                {order.orderType === "delivery" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-semibold">
                      ₹{Number(order.deliveryFee)}
                    </span>
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-display font-bold text-lg">Total</span>
                <span className="font-display font-bold text-2xl text-primary">
                  ₹{Number(order.total)}
                </span>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-semibold">Payment Method:</p>
                <p className="text-sm text-muted-foreground">
                  {order.paymentMethod === "cash"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                  {order.paymentStatus && " (Paid)"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate({ to: "/orders" })}
              variant="outline"
              className="flex-1"
            >
              View All Orders
            </Button>
            <Button onClick={() => navigate({ to: "/" })} className="flex-1">
              Order Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
