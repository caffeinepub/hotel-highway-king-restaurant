import { useState, useRef, useEffect } from "react";
import { useMenuItems, useAddToCart } from "@/hooks/useQueries";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Search, Plus, Phone, MapPin, Clock, ChevronUp, Database } from "lucide-react";
import { Category } from "@/backend.d";
import type { MenuItem } from "@/backend.d";
import type { Backend } from "@/backend";
import { seedMenuItems } from "@/utils/seedMenu";

const categoryLabels: Record<Category, string> = {
  [Category.indianMainCourse]: "Indian Main Course",
  [Category.tandooriRoti]: "Tandoori & Roti",
  [Category.riceBiryani]: "Rice & Biryani",
  [Category.thali]: "Thali",
  [Category.chinese]: "Chinese",
  [Category.fastFood]: "Fast Food",
  [Category.soyaChaap]: "Soya Chaap",
  [Category.beverages]: "Beverages",
  [Category.sweets]: "Sweets",
};

const categoryBanners: Record<Category, string> = {
  [Category.indianMainCourse]: "/assets/generated/indian-main-banner.dim_1200x400.jpg",
  [Category.tandooriRoti]: "/assets/generated/tandoori-biryani-banner.dim_1200x400.jpg",
  [Category.riceBiryani]: "/assets/generated/tandoori-biryani-banner.dim_1200x400.jpg",
  [Category.thali]: "/assets/generated/thali-banner.dim_1200x400.jpg",
  [Category.chinese]: "/assets/generated/chinese-banner.dim_1200x400.jpg",
  [Category.fastFood]: "/assets/generated/fast-food-banner.dim_1200x400.jpg",
  [Category.soyaChaap]: "/assets/generated/soya-chaap-banner.dim_1200x400.jpg",
  [Category.beverages]: "/assets/generated/beverages-banner.dim_1200x400.jpg",
  [Category.sweets]: "/assets/generated/sweets-banner.dim_1200x400.jpg",
};

const categories: Category[] = [
  Category.indianMainCourse,
  Category.tandooriRoti,
  Category.riceBiryani,
  Category.thali,
  Category.chinese,
  Category.fastFood,
  Category.soyaChaap,
  Category.beverages,
  Category.sweets,
];

export function MenuPage() {
  const { actor, isFetching: actorFetching } = useActor();
  const { loginStatus } = useInternetIdentity();
  const { data: menuItems = [], isLoading, error } = useMenuItems();
  const addToCart = useAddToCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuickJump, setShowQuickJump] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [isSeeding, setIsSeeding] = useState(false);
  
  const categoryRefs = useRef<Record<Category, HTMLElement | null>>({} as any);
  
  const hotelImages = [
    "/assets/uploads/Screenshot_20260222-135159-1.png",
    "/assets/uploads/Screenshot_20260222-135146-2.png",
  ];

  // Hero image carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % hotelImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Show/hide quick jump on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowQuickJump(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debug logging
  console.log("MenuPage - actor:", !!actor, "actorFetching:", actorFetching);
  console.log("MenuPage - isLoading:", isLoading);
  console.log("MenuPage - menuItems count:", menuItems.length);
  console.log("MenuPage - error:", error);
  if (menuItems.length > 0) {
    console.log("MenuPage - first item:", menuItems[0]);
  }

  const scrollToCategory = (category: Category) => {
    categoryRefs.current[category]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getItemsByCategory = (category: Category) => {
    return menuItems.filter(
      (item) =>
        item.category === category &&
        item.available &&
        (searchQuery === "" ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const handleAddToCart = async (itemId: bigint) => {
    try {
      await addToCart.mutateAsync({ itemId, quantity: 1n });
      toast.success("Item added to cart!", {
        description: "View your cart to proceed with checkout.",
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      if (error instanceof Error && error.message.includes("Actor not initialized")) {
        toast.error("Please wait while we connect...", {
          description: "The app is still initializing.",
        });
      } else {
        toast.error("Failed to add to cart", {
          description: "Please login first to add items to cart.",
        });
      }
    }
  };

  const handleSeedMenu = async () => {
    if (!actor) {
      toast.error("Backend not ready");
      return;
    }

    setIsSeeding(true);
    try {
      const result = await seedMenuItems(actor as Backend);
      if (result.success) {
        toast.success("Menu seeded!", {
          description: result.message,
        });
        // Refresh page to show new items
        window.location.reload();
      } else {
        toast.error("Seed failed", {
          description: result.message,
        });
      }
    } catch (error) {
      toast.error("Error seeding menu");
      console.error(error);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Hotel Photos */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {/* Image Carousel */}
        {hotelImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentHeroImage ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={img}
              alt={`Hotel Highway King - View ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl mb-4 text-white drop-shadow-2xl">
            Hotel Highway King
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 drop-shadow-lg">
            Experience Authentic Indian Cuisine
          </p>
          
          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
            <div className="flex items-center justify-center gap-3 bg-white/95 backdrop-blur rounded-xl p-4 shadow-2xl">
              <Clock className="w-6 h-6 text-primary shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-sm">Open Daily</p>
                <p className="text-xs text-muted-foreground">7 AM - 11 PM</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white/95 backdrop-blur rounded-xl p-4 shadow-2xl">
              <Phone className="w-6 h-6 text-primary shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-sm">Call/WhatsApp</p>
                <p className="text-xs text-muted-foreground">For Orders</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white/95 backdrop-blur rounded-xl p-4 shadow-2xl">
              <MapPin className="w-6 h-6 text-primary shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-sm">Datia, MP</p>
                <p className="text-xs text-muted-foreground">222109</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {hotelImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHeroImage(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentHeroImage
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Search Bar */}
      <section className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search dishes across all categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>
      </section>

      {/* Quick Jump Navigation */}
      {showQuickJump && (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 bg-card/95 backdrop-blur border rounded-xl p-2 shadow-2xl max-h-[80vh] overflow-y-auto">
          {categories.map((cat) => {
            const itemCount = getItemsByCategory(cat).length;
            if (itemCount === 0) return null;
            return (
              <Button
                key={cat}
                variant="ghost"
                size="sm"
                onClick={() => scrollToCategory(cat)}
                className="justify-start text-xs whitespace-nowrap hover:bg-primary/10"
              >
                {categoryLabels[cat]}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {itemCount}
                </Badge>
              </Button>
            );
          })}
          <Button
            variant="default"
            size="sm"
            onClick={scrollToTop}
            className="mt-2"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Category Sections */}
      <section className="py-8 md:py-12">
        {isLoading ? (
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-3" />
                    <Skeleton className="h-6 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="container mx-auto px-4 text-center py-16">
            <p className="text-lg text-destructive mb-2">
              Error loading menu items
            </p>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="container mx-auto px-4 text-center py-16">
            <p className="text-lg text-muted-foreground mb-2">
              No menu items available
            </p>
            <p className="text-sm text-muted-foreground">
              Please check back later or contact the restaurant.
            </p>
          </div>
        ) : (
          <>
            {categories.map((category) => {
              const categoryItems = getItemsByCategory(category);
              if (categoryItems.length === 0) return null;

              return (
                <div
                  key={category}
                  ref={(el) => {
                    categoryRefs.current[category] = el;
                  }}
                  className="mb-16"
                >
                  {/* Category Banner */}
                  <div className="relative h-48 md:h-64 mb-8 overflow-hidden">
                    <img
                      src={categoryBanners[category]}
                      alt={categoryLabels[category]}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                    <div className="absolute inset-0 flex items-center">
                      <div className="container mx-auto px-4">
                        <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-2xl">
                          {categoryLabels[category]}
                        </h2>
                        <p className="text-white/90 text-lg mt-2 drop-shadow-lg">
                          {categoryItems.length} {categoryItems.length === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Category Items Grid */}
                  <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {categoryItems.map((item) => (
                        <MenuItemCard
                          key={item.id.toString()}
                          item={item}
                          onAddToCart={handleAddToCart}
                          isAdding={addToCart.isPending}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </section>

      {/* Find Us Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Admin Seed Button (hidden, only shows when no menu items) */}
          {loginStatus === "success" && menuItems.length === 0 && !isLoading && (
            <div className="max-w-2xl mx-auto mb-12">
              <Card className="border-dashed border-2 border-primary/50 bg-primary/5">
                <CardContent className="p-6 text-center">
                  <Database className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-display font-bold text-xl mb-2">
                    No Menu Items Found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Seed the database with 45+ dishes and AI-generated images
                  </p>
                  <Button
                    onClick={handleSeedMenu}
                    disabled={isSeeding}
                    size="lg"
                    className="w-full md:w-auto"
                  >
                    {isSeeding ? "Seeding..." : "Seed Menu Items"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-center mb-8">
              Find Us
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Map */}
              <div className="rounded-xl overflow-hidden shadow-warm-lg h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.4!2d78.4629!3d25.6672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDQwJzAyLjAiTiA3OMKwMjcnNDYuNCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hotel Highway King Location"
                ></iframe>
              </div>
              
              {/* Address Details */}
              <div className="flex flex-col justify-center space-y-6">
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Address</h3>
                    <p className="text-muted-foreground">
                      Bypass Road, Datia<br />
                      Madhya Pradesh 222109
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Clock className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Hours</h3>
                    <p className="text-muted-foreground">
                      Open Daily<br />
                      7:00 AM - 11:00 PM
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Phone className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Contact</h3>
                    <p className="text-muted-foreground">
                      Call or WhatsApp for orders
                    </p>
                  </div>
                </div>
                
                <Button
                  asChild
                  size="lg"
                  className="mt-4"
                >
                  <a
                    href="https://maps.app.goo.gl/heER6s3eRvZxkmGb9"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Directions
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MenuItemCard({
  item,
  onAddToCart,
  isAdding,
}: {
  item: MenuItem;
  onAddToCart: (itemId: bigint) => void;
  isAdding: boolean;
}) {
  const [isAddingThis, setIsAddingThis] = useState(false);

  const handleClick = async () => {
    setIsAddingThis(true);
    try {
      await onAddToCart(item.id);
    } finally {
      setIsAddingThis(false);
    }
  };

  const categoryColor: Record<Category, string> = {
    [Category.indianMainCourse]: "bg-primary/10 text-primary",
    [Category.tandooriRoti]: "bg-secondary/10 text-secondary",
    [Category.riceBiryani]: "bg-accent/10 text-accent",
    [Category.thali]: "bg-warning/10 text-warning",
    [Category.chinese]: "bg-chart-2/10 text-chart-2",
    [Category.fastFood]: "bg-chart-3/10 text-chart-3",
    [Category.soyaChaap]: "bg-chart-4/10 text-chart-4",
    [Category.beverages]: "bg-chart-5/10 text-chart-5",
    [Category.sweets]: "bg-primary/10 text-primary",
  };

  return (
    <Card className="group hover:shadow-warm-lg transition-all duration-300 overflow-hidden">
      <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <Badge
          className={`absolute top-3 right-3 ${
            categoryColor[item.category]
          } border-0`}
        >
          {categoryLabels[item.category]}
        </Badge>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display font-bold text-white text-lg line-clamp-1">
            {item.name}
          </h3>
        </div>
      </div>
      <CardContent className="p-4">
        {item.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {item.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-2xl text-primary">
            ₹{Number(item.price)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleClick}
          disabled={isAdding || isAddingThis}
          className="w-full group-hover:shadow-warm transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isAddingThis ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
