import { RestaurantHeader } from '@/components/RestaurantHeader';
import { FoodCustomizer } from '@/components/FoodCustomizer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <RestaurantHeader />
      <FoodCustomizer />
    </div>
  );
};

export default Index;
