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
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
  });

  const getIngredientColor = (ingredient: string) => {
    const colors: Record<string, string> = {
      'dough': '#F5E6D3', // Light cream/beige color for realistic dough
      'sauce': '#D32F2F', // Deep red tomato sauce color
      'cheese': '#F1C40F',
      'pepperoni': '#8B0000',
      'mushrooms': '#8B4513',
      'peppers': '#228B22',
      'olives': '#1C1C1C', // Black color for black olives
      'basil': '#006400'
    };
    return colors[ingredient] || '#888888';
  };

  const getIngredientPosition = (ingredient: string, index: number): [number, number, number] => {
    const toppings = ['mushrooms', 'peppers', 'olives', 'basil', 'pepperoni', 'cheese'];
    
    if (toppings.includes(ingredient)) {
      // Create random positions for each topping instance
      const seed = ingredient.charCodeAt(0) + index * 7; // Deterministic but varied seed
      const angle = (seed * 43.7) % 360; // Random angle
      const radius = 0.2 + (Math.sin(seed) * 0.5 + 0.5) * 0.8; // Random radius between 0.2 and 1.0
      const x = Math.cos(angle * Math.PI / 180) * radius;
      const z = Math.sin(angle * Math.PI / 180) * radius;
      const yVariation = Math.sin(seed * 1.3) * 0.02; // Slight height variation
      return [x, -0.3 + yVariation, z]; // Toppings above sauce
    }
    
    // Base layers stack properly: dough bottom, sauce on top of dough, toppings on top of sauce
    const layerPositions: Record<string, [number, number, number]> = {
      'dough': [0, -0.4, 0],      // Bottom layer
      'sauce': [0, -0.37, 0]      // On top of dough, below toppings
    };
    
    return layerPositions[ingredient] || [0, -0.4 + index * 0.05, 0];
  };

  // Function to generate multiple pieces for realistic serving sizes
  const generateIngredientPieces = () => {
    const pieces: JSX.Element[] = [];
    const ingredientCounts: Record<string, number> = {};
    
    selectedIngredients.forEach((ingredient) => {
      ingredientCounts[ingredient] = (ingredientCounts[ingredient] || 0) + 1;
    });

    Object.entries(ingredientCounts).forEach(([ingredient, count]) => {
      const toppings = ['mushrooms', 'peppers', 'olives', 'basil', 'pepperoni', 'cheese'];
      const isTopping = toppings.includes(ingredient);
      
      if (isTopping && count > 0) {
        // Generate 10-15 pieces per serving for toppings
        const piecesPerServing = 10 + Math.floor(Math.random() * 6); // 10 to 15 pieces
        const totalPieces = count * piecesPerServing;
        
        for (let i = 0; i < totalPieces; i++) {
          const position = getIngredientPosition(ingredient, i);
          pieces.push(
            <mesh
              key={`${ingredient}-${i}`}
              position={position}
              onClick={() => onIngredientClick?.(ingredient)}
              onPointerOver={() => setHovered(ingredient)}
              onPointerOut={() => setHovered(null)}
              scale={hovered === ingredient ? 1.1 : 1}
              castShadow
              receiveShadow
            >
              {ingredient === 'mushrooms' ? (
                <cylinderGeometry args={[0.15, 0.12, 0.03, 12]} />
              ) : ingredient === 'peppers' ? (
                <boxGeometry args={[0.12, 0.04, 0.08]} />
              ) : ingredient === 'olives' ? (
                <cylinderGeometry args={[0.08, 0.06, 0.02, 8]} />
              ) : ingredient === 'basil' ? (
                // Realistic basil leaf shape - flatter and more leaf-like
                <boxGeometry args={[0.08, 0.005, 0.12]} />
              ) : ingredient === 'pepperoni' ? (
                // Smaller, more realistic pepperoni
                <cylinderGeometry args={[0.08, 0.08, 0.015, 16]} />
              ) : ingredient === 'cheese' ? (
                // Small cheese cubes
                <boxGeometry args={[0.04, 0.04, 0.04]} />
              ) : (
                <sphereGeometry args={[0.06, 8, 6]} />
              )}
              <meshStandardMaterial 
                color={getIngredientColor(ingredient)} 
                transparent
                opacity={hovered === ingredient ? 0.9 : 0.8}
              />
            </mesh>
          );
        }
      } else if (!isTopping) {
        // Base layers (dough, sauce) remain as single pieces
        for (let i = 0; i < count; i++) {
          const position = getIngredientPosition(ingredient, i);
          pieces.push(
            <mesh
              key={`${ingredient}-${i}`}
              position={position}
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
                // Liquid-like sauce with irregular surface
                <cylinderGeometry args={[1.35, 1.4, 0.015, 32]} />
              ) : (
                <cylinderGeometry args={[1.3, 1.3, 0.02, 32]} />
              )}
              <meshStandardMaterial 
                color={getIngredientColor(ingredient)} 
                transparent
                opacity={ingredient === 'sauce' ? 0.9 : (hovered === ingredient ? 0.9 : 0.8)}
                roughness={ingredient === 'sauce' ? 0.05 : 0.5}
                metalness={ingredient === 'sauce' ? 0.4 : 0}
                emissive={ingredient === 'sauce' ? '#330000' : '#000000'}
                emissiveIntensity={ingredient === 'sauce' ? 0.1 : 0}
              />
            </mesh>
          );
        }
      }
    });

    return pieces;
  };

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {generateIngredientPieces()}
      
      {/* Base plate */}
      <mesh position={[0, -0.8, 0]} receiveShadow>
        <cylinderGeometry args={[2, 2, 0.1, 32]} />
        <meshStandardMaterial color="#E8E8E8" />
      </mesh>
    </group>
  );
};