import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Mesh } from 'three';

interface Food3DModelProps {
  ingredients: string[];
  onIngredientClick?: (ingredient: string) => void;
}

export const Food3DModel = ({ ingredients, onIngredientClick }: Food3DModelProps) => {
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

  const getIngredientPosition = (ingredient: string, index: number) => {
    const positions: Record<string, [number, number, number]> = {
      'dough': [0, -0.4 + index * 0.05, 0],
      'sauce': [0, -0.35 + index * 0.05, 0],
      'cheese': [0, -0.3 + index * 0.05, 0],
      'pepperoni': [0, -0.25 + index * 0.05, 0],
      'mushrooms': [0, -0.2 + index * 0.05, 0],
      'peppers': [0, -0.15 + index * 0.05, 0],
      'olives': [0, -0.1 + index * 0.05, 0],
      'basil': [0, -0.05 + index * 0.05, 0]
    };
    return positions[ingredient] || [0, -0.4 + index * 0.05, 0];
  };

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {ingredients.map((ingredient, index) => (
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
          ) : (
            <cylinderGeometry args={[1.3, 1.3, 0.02, 32]} />
          )}
          <meshStandardMaterial 
            color={getIngredientColor(ingredient)} 
            transparent
            opacity={hovered === ingredient ? 0.9 : 0.8}
          />
        </mesh>
      ))}
      
      {/* Base plate */}
      <mesh position={[0, -0.8, 0]} receiveShadow>
        <cylinderGeometry args={[2, 2, 0.1, 32]} />
        <meshStandardMaterial color="#E8E8E8" />
      </mesh>
    </group>
  );
};