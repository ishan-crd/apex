/* @jsxImportSource react */
// @ts-nocheck
// ↑ @jsxImportSource react — overrides NativeWind so R3F Three.js elements
//   compile through React's standard transformer, not NativeWind's.
// ↑ @ts-nocheck — R3F v8 element types (group, primitive, ambientLight…)
//   aren't in React's JSX namespace; runtime is correct.

import React, { Suspense, useRef } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useGLTF } from '@react-three/drei/native';
import * as THREE from 'three';


// Import GLB as a direct module path — Metro resolves this to a local URI
// that useGLTF can fetch via expo-asset/expo-file-system internally.
// @ts-ignore — .glb has no TS declaration
import modelPath from '../assets/FinalBaseMesh.glb';

function Body({ speed }: { speed: number }) {
  const { scene } = useGLTF(modelPath as string);
  const groupRef = useRef<THREE.Group>(null!);
  const centred  = useRef(false);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Centre once on first frame
    if (!centred.current) {
      const box    = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center);
      centred.current = true;
    }

    groupRef.current.rotation.y += delta * speed;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} dispose={null} />
    </group>
  );
}

interface Props {
  style?: StyleProp<ViewStyle>;
  rotationSpeed?: number;
}

export default function ModelViewer({ style, rotationSpeed = 0.8 }: Props) {
  return (
    <View style={[styles.root, style]}>
      <Canvas
        style={StyleSheet.absoluteFill}
        camera={{ position: [0, 0, 34], fov: 38, near: 0.1, far: 1000 }}
      >
        {/* Accent green key light from front-top */}
        <ambientLight intensity={0.5} />
        <directionalLight color="#00E0A4" position={[1.5, 3,  4]} intensity={1.2} />
        <directionalLight color="#ffffff" position={[-3,  1,  1]} intensity={0.2} />
        <directionalLight color="#00E0A4" position={[0,  -2, -3]} intensity={0.45} />

        <Suspense fallback={null}>
          <Body speed={rotationSpeed} />
        </Suspense>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: '#0B0C0F', overflow: 'hidden' },
});
