import { useNavigate } from "@tanstack/react-router";
import {
  useCart,
  useMenuItems,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
} from "@/hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";

export function CartPage() {
  const navigate = useNavigate();
  const { data: cart = [], isLoading } = useCart();
  const { data: menuItems = [] } = useMenuItems();
  const updateCart = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();
  const { loginStatus, login, identity } = useInternetIdentity();

  const isLoggedIn = loginStatus === "success" && identity;

  // Get full item details with cart quantities
  const cartWithDetails = cart
    .map((cartItem) => {
      const menuItem = menuItems.find((m) => m.id === cartItem.itemId);
      if (!menuItem) return null;
      return {
        ...menuItem,
        quantity: Number(cartItem.quantity),
        cartItemId: cartItem.itemId,
      };
    })
    .filter(Boolean);

  const subtotal = cartWithDetails.reduce(
    (sum, item) => sum + Number(item!.price) * item!.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const handleUpdateQuantity = async (itemId: bigint, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCart.mutateAsync({ itemId, quantity: BigInt(newQuantity) });
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (itemId: bigint) => {
    try {
      await removeFromCart.mutateAsync(itemId);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart.mutateAsync();
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      toast.error("Please login to proceed");
      login();
      return;
    }
    navigate({ to: "/checkout" });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-32 bg-muted animate-pulse rounded mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-20 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="font-display font-bold text-2xl mb-3">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Add some delicious items from our menu to get started!
          </p>
          <Button onClick={() => navigate({ to: "/" })} size="lg">
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/" })}
              className="mb-2 -ml-3"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
            <h1 className="font-display font-bold text-3xl">Your Cart</h1>
            <p className="text-muted-foreground">
              {cart.length} {cart.length === 1 ? "item" : "items"} in cart
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCart}
            disabled={clearCart.isPending}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartWithDetails.map((item) => (
              <Card key={item!.id.toString()}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-muted to-muted/50 shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-lg mb-1">
                        {item!.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        ₹{Number(item!.price)} each
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleUpdateQuantity(
                                item!.cartItemId,
                                item!.quantity - 1
                              )
                            }
                            disabled={
                              item!.quantity === 1 || updateCart.isPending
                            }
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-semibold">
                            {item!.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleUpdateQuantity(
                                item!.cartItemId,
                                item!.quantity + 1
                              )
                            }
                            disabled={updateCart.isPending}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemove(item!.cartItemId)}
                          disabled={removeFromCart.isPending}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-xl text-primary">
                        ₹{Number(item!.price) * item!.quantity}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="font-display font-bold text-xl mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (5%)</span>
                    <span className="font-semibold">₹{tax}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-display font-bold text-lg">
                      Total
                    </span>
                    <span className="font-display font-bold text-2xl text-primary">
                      ₹{total}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button
                  onClick={handleCheckout}
                  size="lg"
                  className="w-full shadow-warm hover:shadow-warm-lg transition-all"
                >
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
