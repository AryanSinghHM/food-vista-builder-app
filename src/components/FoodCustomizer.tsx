import { useState } from 'react';
import { Food3DViewer } from './Food3DViewer';
import { IngredientPanel } from './IngredientPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export const FoodCustomizer = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
    'bun', 'meat', 'cheese', 'lettuce', 'tomato', 'bun'
  ]);

  const handleIngredientToggle = (ingredient: string) => {
    setSelectedIngredients(prev => [...prev, ingredient]);
    toast(`Added ${ingredient} to your burger!`, {
      description: "Watch the 3D model update in real-time",
    });
  };

  const handleIngredientRemove = (ingredient: string) => {
    setSelectedIngredients(prev => {
      const index = prev.findIndex(item => item === ingredient);
      if (index !== -1) {
        const newIngredients = [...prev];
        newIngredients.splice(index, 1);
        return newIngredients;
      }
      return prev;
    });
    toast(`Removed ${ingredient} from your burger!`, {
      description: "See the change in your 3D model",
    });
  };

  const handleIngredientClick = (ingredient: string) => {
    // Remove ingredient when clicked in 3D view
    handleIngredientRemove(ingredient);
    toast(`Removed ${ingredient} by clicking!`, {
      description: "Click ingredients in 3D view to remove them",
    });
  };

  const handleAddToCart = () => {
    toast.success("Added to cart!", {
      description: `Custom burger with ${selectedIngredients.length} ingredients`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* 3D Viewer */}
          <div className="space-y-6">
            <Card className="shadow-food border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-center">
                  🍔 Interactive 3D Food Model
                </CardTitle>
                <p className="text-center text-muted-foreground">
                  Rotate, zoom, and click on ingredients to explore your custom creation
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="aspect-square w-full">
                  <Food3DViewer 
                    ingredients={selectedIngredients}
                    onIngredientClick={handleIngredientClick}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="shadow-food">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-food-primary">
                    {selectedIngredients.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Ingredients
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-food">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-food-secondary">
                    3D
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Live Preview
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Ingredient Panel */}
          <div>
            <IngredientPanel
              selectedIngredients={selectedIngredients}
              onIngredientToggle={handleIngredientToggle}
              onIngredientRemove={handleIngredientRemove}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};