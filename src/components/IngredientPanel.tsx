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
  onIngredientRemove: (ingredient: string) => void;
  onAddToCart: () => void;
}

const availableIngredients: Ingredient[] = [
  { id: 'dough', name: 'Pizza Dough', category: 'Base', price: 0, emoji: '🍕' },
  { id: 'sauce', name: 'Tomato Sauce', category: 'Base', price: 0.50, emoji: '🍅' },
  { id: 'cheese', name: 'Mozzarella', category: 'Cheese', price: 1.50, emoji: '🧀' },
  { id: 'pepperoni', name: 'Pepperoni', category: 'Meat', price: 2.00, emoji: '🍖' },
  { id: 'mushrooms', name: 'Mushrooms', category: 'Vegetables', price: 1.00, emoji: '🍄' },
  { id: 'peppers', name: 'Bell Peppers', category: 'Vegetables', price: 0.75, emoji: '🫑' },
  { id: 'olives', name: 'Black Olives', category: 'Vegetables', price: 0.50, emoji: '🫒' },
  { id: 'basil', name: 'Fresh Basil', category: 'Herbs', price: 0.25, emoji: '🌿' },
];

export const IngredientPanel = ({ selectedIngredients, onIngredientToggle, onIngredientRemove, onAddToCart }: IngredientPanelProps) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const categories = ['Base', 'Cheese', 'Meat', 'Vegetables', 'Herbs'];

  const getIngredientQuantity = (ingredientId: string) => {
    return selectedIngredients.filter(id => id === ingredientId).length;
  };

  const updateQuantity = (ingredientId: string, change: number) => {
    if (change > 0) {
      onIngredientToggle(ingredientId);
    } else if (change < 0) {
      onIngredientRemove(ingredientId);
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
            Customize Your Pizza
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
              
              {category !== 'Herbs' && <Separator />}
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