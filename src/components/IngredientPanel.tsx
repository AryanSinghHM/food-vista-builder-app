import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface Ingredient {
  id: string;
  name: string;
  category: string;
  price: number;
  emoji: string;
}

interface IngredientPanelProps {
  selectedIngredients: string[];
  onIngredientToggle: (ingredient: string) => void;
  onAddToCart: () => void;
}

const availableIngredients: Ingredient[] = [
  { id: 'bun', name: 'Sesame Bun', category: 'Base', price: 0, emoji: '🍞' },
  { id: 'meat', name: 'Beef Patty', category: 'Protein', price: 3.50, emoji: '🥩' },
  { id: 'cheese', name: 'Cheddar Cheese', category: 'Dairy', price: 1.00, emoji: '🧀' },
  { id: 'lettuce', name: 'Fresh Lettuce', category: 'Vegetables', price: 0.50, emoji: '🥬' },
  { id: 'tomato', name: 'Ripe Tomato', category: 'Vegetables', price: 0.75, emoji: '🍅' },
  { id: 'onion', name: 'White Onion', category: 'Vegetables', price: 0.50, emoji: '🧅' },
  { id: 'pickle', name: 'Dill Pickles', category: 'Condiments', price: 0.25, emoji: '🥒' },
  { id: 'sauce', name: 'Special Sauce', category: 'Condiments', price: 0.50, emoji: '🥫' },
];

export const IngredientPanel = ({ selectedIngredients, onIngredientToggle, onAddToCart }: IngredientPanelProps) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const categories = ['Base', 'Protein', 'Dairy', 'Vegetables', 'Condiments'];

  const getIngredientQuantity = (ingredientId: string) => {
    return selectedIngredients.filter(id => id === ingredientId).length;
  };

  const updateQuantity = (ingredientId: string, change: number) => {
    const currentQty = getIngredientQuantity(ingredientId);
    const newQty = Math.max(0, currentQty + change);
    
    if (change > 0) {
      onIngredientToggle(ingredientId);
    } else if (change < 0 && currentQty > 0) {
      const index = selectedIngredients.findIndex(id => id === ingredientId);
      if (index !== -1) {
        const newIngredients = [...selectedIngredients];
        newIngredients.splice(index, 1);
      }
    }
  };

  const totalPrice = selectedIngredients.reduce((total, ingredientId) => {
    const ingredient = availableIngredients.find(ing => ing.id === ingredientId);
    return total + (ingredient?.price || 0);
  }, 7.99); // Base price

  return (
    <div className="space-y-6">
      <Card className="shadow-food">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Customize Your Burger
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {categories.map(category => (
            <div key={category} className="space-y-3">
              <h3 className="font-semibold text-food-primary flex items-center gap-2">
                {category}
                <Badge variant="secondary" className="text-xs">
                  {availableIngredients.filter(ing => ing.category === category).length}
                </Badge>
              </h3>
              
              <div className="grid gap-3">
                {availableIngredients
                  .filter(ingredient => ingredient.category === category)
                  .map(ingredient => {
                    const quantity = getIngredientQuantity(ingredient.id);
                    return (
                      <div 
                        key={ingredient.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-secondary/50 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{ingredient.emoji}</span>
                          <div>
                            <p className="font-medium">{ingredient.name}</p>
                            <p className="text-sm text-muted-foreground">
                              ${ingredient.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(ingredient.id, -1)}
                            disabled={quantity === 0}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="w-8 text-center font-medium">
                            {quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(ingredient.id, 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
              
              {category !== 'Condiments' && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-food">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-food-primary">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          
          <Button 
            onClick={onAddToCart}
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
            size="lg"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};