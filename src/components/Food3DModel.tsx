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
      'bun': '#D4A574',
      'lettuce': '#4A7C59',
      'tomato': '#E74C3C',
      'cheese': '#F1C40F',
      'meat': '#8B4513',
      'onion': '#F8F8FF',
      'pickle': '#6B8E23',
      'sauce': '#B22222'
    };
    return colors[ingredient] || '#888888';
  };

  const getIngredientPosition = (ingredient: string, index: number) => {
    const positions: Record<string, [number, number, number]> = {
      'bun': [0, 0.5 + index * 0.1, 0],
      'lettuce': [0, 0.3 + index * 0.1, 0],
      'tomato': [0, 0.2 + index * 0.1, 0],
      'cheese': [0, 0.1 + index * 0.1, 0],
      'meat': [0, 0 + index * 0.1, 0],
      'onion': [0, -0.1 + index * 0.1, 0],
      'pickle': [0, -0.2 + index * 0.1, 0],
      'sauce': [0, -0.3 + index * 0.1, 0]
    };
    return positions[ingredient] || [0, index * 0.1, 0];
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
          {ingredient === 'bun' ? (
            <cylinderGeometry args={[1.2, 1.2, 0.3, 16]} />
          ) : ingredient === 'meat' ? (
            <cylinderGeometry args={[1, 1, 0.2, 16]} />
          ) : ingredient === 'cheese' ? (
            <cylinderGeometry args={[1.1, 1.1, 0.05, 16]} />
          ) : (
            <cylinderGeometry args={[1.1, 1.1, 0.08, 16]} />
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