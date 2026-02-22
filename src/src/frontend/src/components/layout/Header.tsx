import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useQueries";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const navigate = useNavigate();
  const { data: cart = [] } = useCart();
  const { loginStatus, clear, login, identity } = useInternetIdentity();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemCount = cart.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  const isLoggedIn = loginStatus === "success" && identity;

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-warm">
              <span className="text-xl md:text-2xl font-display font-bold text-primary-foreground">
                HK
              </span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-lg md:text-xl leading-tight text-foreground">
                Hotel Highway King
              </h1>
              <p className="text-xs text-muted-foreground">
                Restaurant & Ordering
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Menu
            </Link>
            <Link
              to="/orders"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              My Orders
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Cart Button */}
            <Button
              variant="outline"
              size="sm"
              className="relative"
              onClick={() => navigate({ to: "/cart" })}
            >
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-secondary">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden md:flex">
                    <User className="w-4 h-4 mr-2" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate({ to: "/orders" })}>
                    <User className="w-4 h-4 mr-2" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={clear}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={login}
                size="sm"
                className="hidden md:flex"
                disabled={loginStatus === "logging-in"}
              >
                {loginStatus === "logging-in" ? "Connecting..." : "Login"}
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            <Link
              to="/"
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              to="/orders"
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Orders
            </Link>
            {isLoggedIn ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  clear();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => {
                  login();
                  setMobileMenuOpen(false);
                }}
                disabled={loginStatus === "logging-in"}
              >
                {loginStatus === "logging-in" ? "Connecting..." : "Login"}
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
