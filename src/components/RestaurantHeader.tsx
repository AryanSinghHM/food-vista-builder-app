import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu } from 'lucide-react';

export const RestaurantHeader = () => {
  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">3D</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">FoodCraft 3D</h1>
                <p className="text-sm text-muted-foreground">Interactive Dining Experience</p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden md:flex">
              🏨 Hotel & Restaurant Chains
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Menu className="mr-2 h-4 w-4" />
              Menu
            </Button>
            <Button variant="outline" size="sm">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart (0)
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};