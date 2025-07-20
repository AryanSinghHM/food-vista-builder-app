import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Mesh } from 'three';

interface Food3DModelProps {
  ingredients: string[];
  onIngredientClick?: (ingredient: string) => void;
}

export const Food3DModel = ({ ingredients: selectedIngredients, onIngredientClick }: Food3DModelProps) => {
  const groupRef = useRef<any>();
  const [hovered, setHovered] = useState<string | null>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const getIngredientColor = (ingredient: string) => {
    const colors: Record<string, string> = {
      'dough': '#F4E4BC',
      'sauce': '#C0392B',
      'cheese': '#F1C40F',
      'pepperoni': '#8B0000',
      'mushrooms': '#8B4513',
      'peppers': '#228B22',
      'olives': '#2F4F2F',
      'basil': '#006400'
    };
    return colors[ingredient] || '#888888';
  };

  const getIngredientPosition = (ingredient: string, index: number): [number, number, number] => {
    // Toppings get scattered positions on top of the pizza
    const toppings = ['mushrooms', 'peppers', 'olives', 'basil'];
    
    if (toppings.includes(ingredient)) {
      // Create random positions for each topping instance
      const seed = ingredient.charCodeAt(0) + index * 7; // Deterministic but varied seed
      const angle = (seed * 43.7) % 360; // Random angle
      const radius = 0.2 + (Math.sin(seed) * 0.5 + 0.5) * 0.8; // Random radius between 0.2 and 1.0
      const x = Math.cos(angle * Math.PI / 180) * radius;
      const z = Math.sin(angle * Math.PI / 180) * radius;
      const yVariation = Math.sin(seed * 1.3) * 0.02; // Slight height variation
      return [x, -0.15 + yVariation, z];
    }
    
    // Base layers stack normally
    const layerPositions: Record<string, [number, number, number]> = {
      'dough': [0, -0.4, 0],
      'sauce': [0, -0.35, 0],
      'cheese': [0, -0.3, 0],
      'pepperoni': [0, -0.25, 0]
    };
    
    return layerPositions[ingredient] || [0, -0.4 + index * 0.05, 0];
  };

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {selectedIngredients.map((ingredient, index) => {
        const toppings = ['mushrooms', 'peppers', 'olives', 'basil'];
        const isTopping = toppings.includes(ingredient);
        
        return (
          <mesh
            key={`${ingredient}-${index}`}
            position={getIngredientPosition(ingredient, index)}
            onClick={() => onIngredientClick?.(ingredient)}
            onPointerOver={() => setHovered(ingredient)}
            onPointerOut={() => setHovered(null)}
            scale={hovered === ingredient ? 1.1 : 1}
            castShadow
            receiveShadow
          >
            {ingredient === 'dough' ? (
              <cylinderGeometry args={[1.5, 1.5, 0.15, 32]} />
            ) : ingredient === 'sauce' ? (
              <cylinderGeometry args={[1.4, 1.4, 0.03, 32]} />
            ) : ingredient === 'cheese' ? (
              <cylinderGeometry args={[1.4, 1.4, 0.04, 32]} />
            ) : ingredient === 'pepperoni' ? (
              <cylinderGeometry args={[1.3, 1.3, 0.02, 32]} />
            ) : isTopping ? (
              // Smaller, more realistic topping shapes
              ingredient === 'mushrooms' ? (
                <sphereGeometry args={[0.08, 8, 6]} />
              ) : ingredient === 'peppers' ? (
                <boxGeometry args={[0.12, 0.04, 0.08]} />
              ) : ingredient === 'olives' ? (
                <sphereGeometry args={[0.05, 8, 6]} />
              ) : ingredient === 'basil' ? (
                <boxGeometry args={[0.06, 0.01, 0.1]} />
              ) : (
                <sphereGeometry args={[0.06, 8, 6]} />
              )
            ) : (
              <cylinderGeometry args={[1.3, 1.3, 0.02, 32]} />
            )}
          <meshStandardMaterial 
            color={getIngredientColor(ingredient)} 
            transparent
            opacity={hovered === ingredient ? 0.9 : 0.8}
            />
          </mesh>
        );
      })}
      
      {/* Base plate */}
      <mesh position={[0, -0.8, 0]} receiveShadow>
        <cylinderGeometry args={[2, 2, 0.1, 32]} />
        <meshStandardMaterial color="#E8E8E8" />
      </mesh>
    </group>
  );
};