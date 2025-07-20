import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NutritionInfo {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sodium: number; // mg
}

interface CalorieCalculatorProps {
  ingredients: string[];
}

export const CalorieCalculator = ({ ingredients }: CalorieCalculatorProps) => {
  // Nutritional information per serving of each ingredient
  const nutritionData: Record<string, NutritionInfo> = {
    'dough': { calories: 285, protein: 10, carbs: 55, fat: 3, fiber: 3, sodium: 580 },
    'sauce': { calories: 15, protein: 1, carbs: 3, fat: 0, fiber: 1, sodium: 160 },
    'cheese': { calories: 80, protein: 6, carbs: 1, fat: 6, fiber: 0, sodium: 180 },
    'pepperoni': { calories: 140, protein: 6, carbs: 0, fat: 13, fiber: 0, sodium: 480 },
    'mushrooms': { calories: 5, protein: 1, carbs: 1, fat: 0, fiber: 0, sodium: 1 },
    'peppers': { calories: 8, protein: 0, carbs: 2, fat: 0, fiber: 1, sodium: 1 },
    'olives': { calories: 25, protein: 0, carbs: 1, fat: 2, fiber: 1, sodium: 200 },
    'basil': { calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 }
  };

  // Calculate total nutrition
  const calculateTotalNutrition = (): NutritionInfo => {
    const totals: NutritionInfo = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sodium: 0
    };

    ingredients.forEach(ingredient => {
      const nutrition = nutritionData[ingredient];
      if (nutrition) {
        totals.calories += nutrition.calories;
        totals.protein += nutrition.protein;
        totals.carbs += nutrition.carbs;
        totals.fat += nutrition.fat;
        totals.fiber += nutrition.fiber;
        totals.sodium += nutrition.sodium;
      }
    });

    return totals;
  };

  const totalNutrition = calculateTotalNutrition();

  // Get ingredient counts for display
  const getIngredientCounts = () => {
    const counts: Record<string, number> = {};
    ingredients.forEach(ingredient => {
      counts[ingredient] = (counts[ingredient] || 0) + 1;
    });
    return counts;
  };

  const ingredientCounts = getIngredientCounts();

  return (
    <Card className="w-full bg-card/95 backdrop-blur border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <span className="text-primary">🔥</span>
          Nutrition Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Calories Display */}
        <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="text-3xl font-bold text-primary">{Math.round(totalNutrition.calories)}</div>
          <div className="text-sm text-muted-foreground">Total Calories</div>
        </div>

        {/* Macronutrients */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/30 p-3 rounded-lg">
            <div className="text-lg font-semibold text-foreground">{Math.round(totalNutrition.protein)}g</div>
            <div className="text-xs text-muted-foreground">Protein</div>
          </div>
          <div className="bg-secondary/30 p-3 rounded-lg">
            <div className="text-lg font-semibold text-foreground">{Math.round(totalNutrition.carbs)}g</div>
            <div className="text-xs text-muted-foreground">Carbs</div>
          </div>
          <div className="bg-secondary/30 p-3 rounded-lg">
            <div className="text-lg font-semibold text-foreground">{Math.round(totalNutrition.fat)}g</div>
            <div className="text-xs text-muted-foreground">Fat</div>
          </div>
          <div className="bg-secondary/30 p-3 rounded-lg">
            <div className="text-lg font-semibold text-foreground">{Math.round(totalNutrition.fiber)}g</div>
            <div className="text-xs text-muted-foreground">Fiber</div>
          </div>
        </div>

        {/* Sodium */}
        <div className="bg-accent/20 p-3 rounded-lg">
          <div className="text-lg font-semibold text-foreground">{Math.round(totalNutrition.sodium)}mg</div>
          <div className="text-xs text-muted-foreground">Sodium</div>
        </div>

        {/* Ingredients List */}
        {Object.keys(ingredientCounts).length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">Ingredients:</div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(ingredientCounts).map(([ingredient, count]) => (
                <Badge key={ingredient} variant="outline" className="text-xs">
                  {ingredient} {count > 1 && `(${count}x)`}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Health Indicators */}
        <div className="flex justify-between items-center pt-2 border-t border-border/50">
          <div className="flex gap-2">
            {totalNutrition.protein >= 15 && (
              <Badge variant="secondary" className="text-xs">
                💪 High Protein
              </Badge>
            )}
            {totalNutrition.fiber >= 5 && (
              <Badge variant="secondary" className="text-xs">
                🌾 High Fiber
              </Badge>
            )}
            {totalNutrition.sodium < 600 && (
              <Badge variant="secondary" className="text-xs">
                🧂 Low Sodium
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};