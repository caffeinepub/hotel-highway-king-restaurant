import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import AccessControl "authorization/access-control";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  ///////////////////////
  // TYPES & CONSTANTS
  ///////////////////////
  public type Category = {
    #indianMainCourse;
    #tandooriRoti;
    #riceBiryani;
    #thali;
    #chinese;
    #fastFood;
    #soyaChaap;
    #beverages;
    #sweets;
  };

  public type MenuItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : Category;
    imageUrl : Text;
    available : Bool;
  };

  public type CartItem = {
    itemId : Nat;
    quantity : Nat;
  };

  public type OrderType = { #pickup; #delivery };
  public type PaymentMethod = { #cash; #online };
  public type OrderStatus = {
    #pending;
    #preparing;
    #ready;
    #completed;
    #cancelled;
  };

  public type CustomerDetails = {
    name : Text;
    phone : Text;
    email : Text;
    address : Text;
  };

  public type Order = {
    id : Nat;
    userId : Principal;
    items : [CartItem];
    customerDetails : CustomerDetails;
    orderType : OrderType;
    paymentMethod : PaymentMethod;
    status : OrderStatus;
    total : Nat;
    tax : Nat;
    deliveryFee : Nat;
    paymentStatus : ?Bool;
    createdAt : Int;
  };

  module OrderModule {
    public func compare(o1 : Order, o2 : Order) : Order.Order {
      Nat.compare(o1.id, o2.id);
    };
  };

  public type CalculateTotalResult = {
    subtotal : Nat;
    tax : Nat;
    deliveryFee : Nat;
    total : Nat;
  };

  public type UserProfile = {
    name : Text;
    phone : Text;
    email : Text;
    address : Text;
  };

  let TAX_RATE = 0.05;
  let DELIVERY_FEE = 30;

  ///////////////////////
  // GLOBAL STATE
  ///////////////////////
  let menuItems = Map.empty<Nat, MenuItem>();
  let carts = Map.empty<Principal, [CartItem]>();
  let orders = Map.empty<Nat, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextMenuItemId = 1;
  var nextOrderId = 1;

  ///////////////////////
  // AUTHORIZATION
  ///////////////////////
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  ///////////////////////
  // USER PROFILE FUNCTIONS
  ///////////////////////
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  ///////////////////////
  // MENU FUNCTIONS
  ///////////////////////
  public query func getMenuItems() : async [MenuItem] {
    menuItems.values().toArray();
  };

  public query func getMenuItemsByCategory(category : Category) : async [MenuItem] {
    menuItems.values().toArray().filter(
      func(item) { item.category == category }
    );
  };

  public shared ({ caller }) func addMenuItem(item : MenuItem) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add menu items");
    };

    let itemId = nextMenuItemId;
    nextMenuItemId += 1;

    let newItem : MenuItem = {
      item with id = itemId;
    };
    menuItems.add(itemId, newItem);
    itemId;
  };

  public shared ({ caller }) func updateMenuItem(item : MenuItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update menu items");
    };
    switch (menuItems.get(item.id)) {
      case (null) { Runtime.trap("Menu item not found") };
      case (?_) {
        menuItems.add(item.id, item);
      };
    };
  };

  public shared ({ caller }) func toggleAvailability(itemId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can toggle availability");
    };
    switch (menuItems.get(itemId)) {
      case (null) { Runtime.trap("Menu item not found") };
      case (?item) {
        let updatedItem = { item with available = not item.available };
        menuItems.add(itemId, updatedItem);
      };
    };
  };

  ///////////////////////
  // CART FUNCTIONS
  ///////////////////////
  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access cart");
    };
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };
  };

  public shared ({ caller }) func addToCart(itemId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };
    switch (menuItems.get(itemId)) {
      case (null) { Runtime.trap("Menu item not found") };
      case (?item) {
        if (not item.available) {
          Runtime.trap("Item not available");
        };

        let currentCart = switch (carts.get(caller)) {
          case (null) { [] };
          case (?items) { items };
        };

        type MutableCart =
          [var {
            itemId : Nat;
            quantity : Nat;
          }];

        func findExistingItemIndex(cart : [CartItem], itemId : Nat) : Nat {
          var i = 0;
          while (i < cart.size()) {
            if (cart[i].itemId == itemId) {
              return i;
            };
            i += 1;
          };
          cart.size();
        };

        let existingItemIndex = findExistingItemIndex(currentCart, itemId);

        let newCart : [CartItem] = if (existingItemIndex == currentCart.size()) {
          // Item not in cart, append new item
          currentCart.concat([{
            itemId;
            quantity;
          }]);
        } else {
          // Item already exists, update quantity
          let mutableCart : MutableCart = currentCart.toVarArray();
          mutableCart[existingItemIndex] := {
            mutableCart[existingItemIndex] with quantity = mutableCart[existingItemIndex].quantity + quantity
          };
          mutableCart.toArray();
        };
        carts.add(caller, newCart);
      };
    };
  };

  public shared ({ caller }) func updateCartItem(itemId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update cart");
    };

    let currentCart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?items) { items };
    };

    let newCart = currentCart.map(
      func(item) {
        if (item.itemId == itemId) {
          { item with quantity };
        } else { item };
      }
    );
    carts.add(caller, newCart);
  };

  public shared ({ caller }) func removeFromCart(itemId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from cart");
    };

    let currentCart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?items) { items };
    };

    let newCart = currentCart.filter(
      func(item) { item.itemId != itemId }
    );
    carts.add(caller, newCart);
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear cart");
    };
    carts.add(caller, []);
  };

  ///////////////////////
  // ORDER FUNCTIONS
  ///////////////////////
  func calculateTotal(items : [CartItem], orderType : OrderType) : CalculateTotalResult {
    var subtotal = 0;
    for (cartItem in items.vals()) {
      let menuItem = switch (menuItems.get(cartItem.itemId)) {
        case (null) { Runtime.trap("Menu item not found") };
        case (?item) { item };
      };
      subtotal += menuItem.price * cartItem.quantity;
    };

    let taxFloat = subtotal.toFloat() * TAX_RATE;
    let tax = Int.abs(taxFloat.toInt());
    let deliveryFee = switch (orderType) {
      case (#delivery) { DELIVERY_FEE };
      case (#pickup) { 0 };
    };
    let total = subtotal + tax + deliveryFee;
    {
      subtotal;
      tax;
      deliveryFee;
      total;
    };
  };

  public shared ({ caller }) func placeOrder(
    items : [CartItem],
    customerDetails : CustomerDetails,
    orderType : OrderType,
    paymentMethod : PaymentMethod
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    if (items.size() == 0) {
      Runtime.trap("Cannot place order with empty cart");
    };

    let totalResult = calculateTotal(items, orderType);
    let orderId = nextOrderId;
    nextOrderId += 1;

    let newOrder : Order = {
      id = orderId;
      userId = caller;
      items;
      customerDetails;
      orderType;
      paymentMethod;
      status = #pending;
      total = totalResult.total;
      tax = totalResult.tax;
      deliveryFee = totalResult.deliveryFee;
      paymentStatus = null;
      createdAt = Time.now();
    };
    orders.add(orderId, newOrder);
    carts.add(caller, []);
    orderId;
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (order.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
    };
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = { order with status };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public shared ({ caller }) func cancelOrder(orderId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can cancel orders");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (order.userId != caller) {
          Runtime.trap("Unauthorized: Can only cancel your own orders");
        };
        if (order.status != #pending) {
          Runtime.trap("Order cannot be cancelled");
        };
        let updatedOrder = { order with status = #cancelled };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public shared ({ caller }) func markOrderAsPaid(orderId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can mark orders as paid");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = { order with paymentStatus = ?true };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public shared ({ caller }) func setOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = { order with status };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getOrdersForCaller() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their orders");
    };
    let userOrders = orders.values().toArray().filter(
      func(order) { order.userId == caller }
    );
    userOrders.sort<Order>();
  };

  public query ({ caller }) func getActiveOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view active orders");
    };
    let activeOrders = orders.values().toArray().filter(
      func(order) {
        switch (order.status) {
          case (#pending) { true };
          case (#preparing) { true };
          case (#ready) { true };
          case (_) { false };
        };
      }
    );
    activeOrders.sort<Order>();
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray().sort<Order>();
  };

  ///////////////////////
  // PAYMENT FUNCTIONS
  ///////////////////////
  var configuration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    configuration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check payment status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
