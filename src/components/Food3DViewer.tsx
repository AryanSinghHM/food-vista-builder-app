import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Food3DModel } from './Food3DModel';

interface Food3DViewerProps {
  ingredients: string[];
  onIngredientClick?: (ingredient: string) => void;
}

export const Food3DViewer = ({ ingredients, onIngredientClick }: Food3DViewerProps) => {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-food" style={{ background: '#F1C40F' }}>
      <Canvas
        camera={{ position: [0, 2, 5], fov: 50 }}
        shadows
      >
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.2} />
        
        <Food3DModel 
          ingredients={ingredients} 
          onIngredientClick={onIngredientClick}
        />
        
        <ContactShadows 
          position={[0, -1.4, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={1.5} 
          far={4.5} 
        />
        
        <Environment preset="warehouse" />
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          enableRotate={true}
          minDistance={3}
          maxDistance={8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
        />
      </Canvas>
    </div>
  );
};