import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  useCart,
  useMenuItems,
  usePlaceOrder,
  useUserProfile,
  useSaveUserProfile,
  useIsStripeConfigured,
  useCreateCheckoutSession,
} from "@/hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { OrderType, PaymentMethod } from "@/backend.d";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cart = [] } = useCart();
  const { data: menuItems = [] } = useMenuItems();
  const { data: userProfile } = useUserProfile();
  const saveProfile = useSaveUserProfile();
  const placeOrder = usePlaceOrder();
  const { data: isStripeConfigured = false } = useIsStripeConfigured();
  const createCheckoutSession = useCreateCheckoutSession();

  const [orderType, setOrderType] = useState<OrderType>(OrderType.delivery);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.cash
  );
  const [saveInfo, setSaveInfo] = useState(false);

  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    email: userProfile?.email || "",
    phone: userProfile?.phone || "",
    address: userProfile?.address || "",
  });

  // Calculate totals
  const cartWithDetails = cart
    .map((cartItem) => {
      const menuItem = menuItems.find((m) => m.id === cartItem.itemId);
      if (!menuItem) return null;
      return {
        ...menuItem,
        quantity: Number(cartItem.quantity),
      };
    })
    .filter(Boolean);

  const subtotal = cartWithDetails.reduce(
    (sum, item) => sum + Number(item!.price) * item!.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.05);
  const deliveryFee = orderType === OrderType.delivery ? 30 : 0;
  const total = subtotal + tax + deliveryFee;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return false;
    }
    if (orderType === OrderType.delivery && !formData.address.trim()) {
      toast.error("Please enter your delivery address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      // Save profile if checkbox is checked
      if (saveInfo) {
        await saveProfile.mutateAsync({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        });
      }

      // For online payment with Stripe
      if (paymentMethod === PaymentMethod.online && isStripeConfigured) {
        const items = cartWithDetails.map((item) => ({
          productName: item!.name,
          productDescription: item!.description || "",
          priceInCents: BigInt(Number(item!.price) * 100),
          quantity: BigInt(item!.quantity),
          currency: "INR",
        }));

        const sessionUrl = await createCheckoutSession.mutateAsync({
          items,
          successUrl: `${window.location.origin}/order-confirmation`,
          cancelUrl: `${window.location.origin}/checkout`,
        });

        window.location.href = sessionUrl;
        return;
      }

      // For cash on delivery
      const orderId = await placeOrder.mutateAsync({
        items: cart,
        customerDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },
        orderType,
        paymentMethod,
      });

      toast.success("Order placed successfully!");
      navigate({ to: `/order-confirmation/${orderId}` });
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <h2 className="font-display font-bold text-2xl mb-3">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Add items to your cart before checking out
          </p>
          <Button onClick={() => navigate({ to: "/" })}>Browse Menu</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: "/cart" })}
          className="mb-4 -ml-3"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>

        <h1 className="font-display font-bold text-3xl mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Customer Details & Order Options */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="save-info"
                      checked={saveInfo}
                      onCheckedChange={(checked) =>
                        setSaveInfo(checked as boolean)
                      }
                    />
                    <Label htmlFor="save-info" className="text-sm cursor-pointer">
                      Save my information for faster checkout next time
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Order Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={orderType}
                    onValueChange={(value) =>
                      setOrderType(value as OrderType)
                    }
                  >
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={OrderType.delivery} id="delivery" />
                      <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Delivery</div>
                        <div className="text-sm text-muted-foreground">
                          Delivery fee: ₹30
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={OrderType.pickup} id="pickup" />
                      <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Pickup</div>
                        <div className="text-sm text-muted-foreground">
                          Pick up from restaurant
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Delivery Address - only show for delivery */}
              {orderType === OrderType.delivery && (
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="address">Full Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder="Street address, city, postal code"
                        required={orderType === OrderType.delivery}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) =>
                      setPaymentMethod(value as PaymentMethod)
                    }
                  >
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={PaymentMethod.cash} id="cash" />
                      <Label htmlFor="cash" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Cash on Delivery</div>
                        <div className="text-sm text-muted-foreground">
                          Pay when you receive your order
                        </div>
                      </Label>
                    </div>
                    {isStripeConfigured && (
                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={PaymentMethod.online} id="online" />
                        <Label htmlFor="online" className="flex-1 cursor-pointer">
                          <div className="font-semibold">Online Payment</div>
                          <div className="text-sm text-muted-foreground">
                            Pay securely with UPI or Card
                          </div>
                        </Label>
                      </div>
                    )}
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {cartWithDetails.map((item) => (
                      <div
                        key={item!.id.toString()}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {item!.name} x {item!.quantity}
                        </span>
                        <span className="font-semibold">
                          ₹{Number(item!.price) * item!.quantity}
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
                      <span className="text-muted-foreground">Tax (5%)</span>
                      <span className="font-semibold">₹{tax}</span>
                    </div>
                    {orderType === OrderType.delivery && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Delivery Fee
                        </span>
                        <span className="font-semibold">₹{deliveryFee}</span>
                      </div>
                    )}
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
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full shadow-warm hover:shadow-warm-lg transition-all"
                    disabled={
                      placeOrder.isPending || createCheckoutSession.isPending
                    }
                  >
                    {placeOrder.isPending || createCheckoutSession.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
