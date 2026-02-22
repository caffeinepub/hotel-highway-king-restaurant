import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Order {
    id: bigint;
    tax: bigint;
    status: OrderStatus;
    total: bigint;
    paymentStatus?: boolean;
    paymentMethod: PaymentMethod;
    deliveryFee: bigint;
    userId: Principal;
    createdAt: bigint;
    orderType: OrderType;
    customerDetails: CustomerDetails;
    items: Array<CartItem>;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface MenuItem {
    id: bigint;
    name: string;
    description: string;
    available: boolean;
    imageUrl: string;
    category: Category;
    price: bigint;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface CartItem {
    itemId: bigint;
    quantity: bigint;
}
export interface UserProfile {
    name: string;
    email: string;
    address: string;
    phone: string;
}
export interface CustomerDetails {
    name: string;
    email: string;
    address: string;
    phone: string;
}
export enum Category {
    riceBiryani = "riceBiryani",
    thali = "thali",
    chinese = "chinese",
    fastFood = "fastFood",
    tandooriRoti = "tandooriRoti",
    indianMainCourse = "indianMainCourse",
    beverages = "beverages",
    sweets = "sweets",
    soyaChaap = "soyaChaap"
}
export enum OrderStatus {
    preparing = "preparing",
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    ready = "ready"
}
export enum OrderType {
    pickup = "pickup",
    delivery = "delivery"
}
export enum PaymentMethod {
    cash = "cash",
    online = "online"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMenuItem(item: MenuItem): Promise<bigint>;
    addToCart(itemId: bigint, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelOrder(orderId: bigint): Promise<void>;
    clearCart(): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    getActiveOrders(): Promise<Array<Order>>;
    getAllOrders(): Promise<Array<Order>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getMenuItems(): Promise<Array<MenuItem>>;
    getMenuItemsByCategory(category: Category): Promise<Array<MenuItem>>;
    getOrder(orderId: bigint): Promise<Order>;
    getOrdersForCaller(): Promise<Array<Order>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    markOrderAsPaid(orderId: bigint): Promise<void>;
    placeOrder(items: Array<CartItem>, customerDetails: CustomerDetails, orderType: OrderType, paymentMethod: PaymentMethod): Promise<bigint>;
    removeFromCart(itemId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    toggleAvailability(itemId: bigint): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateCartItem(itemId: bigint, quantity: bigint): Promise<void>;
    updateMenuItem(item: MenuItem): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
}
