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
import { useColors } from '@/contexts/ThemeContext';

// Default model — used if no `source` prop is passed.
// @ts-ignore — .glb has no TS declaration
import defaultModel from '../assets/FinalBaseMesh.glb';

function Body({ source, speed }: { source: any; speed: number }) {
  const { scene } = useGLTF(source as string);
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
  source?: any; // Metro asset module (e.g. require('./mesh.glb')) — falls back to default
  cameraZ?: number; // smaller = zoomed in, larger = zoomed out. Default 34.
}

export default function ModelViewer({ style, rotationSpeed = 0.8, source, cameraZ = 34 }: Props) {
  const C = useColors();
  const mesh = source ?? defaultModel;
  return (
    <View style={[{ backgroundColor: C.screen, overflow: 'hidden' }, style]}>
      <Canvas
        key={`${C.screen}-${mesh}-${cameraZ}`}
        style={StyleSheet.absoluteFill}
        camera={{ position: [0, 0, cameraZ], fov: 38, near: 0.1, far: 1000 }}
        gl={{ alpha: true }}
        onCreated={({ gl }) => { gl.setClearColor(C.screen, 1); }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight color="#00E0A4" position={[1.5, 3,  4]} intensity={1.2} />
        <directionalLight color="#ffffff" position={[-3,  1,  1]} intensity={0.2} />
        <directionalLight color="#00E0A4" position={[0,  -2, -3]} intensity={0.45} />

        <Suspense fallback={null}>
          <Body source={mesh} speed={rotationSpeed} />
        </Suspense>
      </Canvas>
    </View>
  );
}
