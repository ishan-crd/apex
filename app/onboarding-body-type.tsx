import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type Colors } from '@/constants/colors';
import { BODY_TYPES } from '@/constants/bodyTypes';
import { useColors } from '@/contexts/ThemeContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { IconButton } from '@/components/IconButton';
import { Pill } from '@/components/Pill';
import ModelViewer from '@/components/ModelViewer';
import Svg, { Path } from 'react-native-svg';

function BackIcon() {
  const C = useColors();
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><Path d="M15 6l-6 6 6 6" /></Svg>;
}

function CheckIcon() {
  const C = useColors();
  return <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={C.accentInk} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round"><Path d="M5 12.5 10 17l9-10" /></Svg>;
}

function ArrowRight() {
  const C = useColors();
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.accentInk} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><Path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
}

export default function OnboardingBodyTypeScreen() {
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const { setBodyType, bodyType } = useOnboarding();
  const [selectedId, setSelectedId] = useState<string>(bodyType ?? 'male');

  const handleConfirm = () => {
    const sel = BODY_TYPES.find((b) => b.id === selectedId);
    if (!sel) return;
    setBodyType(sel.id, sel.label);
    router.push('/onboarding-plan');
  };

  const headAnim   = useRef(new Animated.Value(0)).current;
  const titleAnim  = useRef(new Animated.Value(0)).current;
  const modelAnim  = useRef(new Animated.Value(0)).current;
  const gridAnim   = useRef(new Animated.Value(0)).current;
  const ctaAnim    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(70, [
      Animated.spring(headAnim,  { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
      Animated.spring(titleAnim, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
      Animated.spring(modelAnim, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
      Animated.spring(gridAnim,  { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
      Animated.spring(ctaAnim,   { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
    ]).start();
  }, []);

  const s = (a: Animated.Value) => ({
    opacity: a,
    transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
  });

  const selected = BODY_TYPES.find((b) => b.id === selectedId)!;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.body}>

        {/* Header */}
        <Animated.View style={[styles.head, s(headAnim)]}>
          <IconButton onPress={() => router.back()}><BackIcon /></IconButton>
          <Pill label="Step 2 / 4" variant="ghost" />
        </Animated.View>

        {/* Title block */}
        <Animated.View style={[styles.titleBlock, s(titleAnim)]}>
          <Text style={styles.kick}>Choose what fits</Text>
          <Text style={styles.title}>Your body type</Text>
        </Animated.View>

        {/* 3D model preview */}
        <Animated.View style={[styles.modelWrap, s(modelAnim)]}>
          {/* Aura glow behind model */}
          <View style={styles.aura} />
          <ModelViewer style={styles.model} source={selected.mesh} rotationSpeed={0.6} cameraZ={4} />
          {/* Selected label chip */}
          <View style={styles.labelChip}>
            <View style={styles.labelDot} />
            <Text style={styles.labelChipText}>{selected.label}</Text>
          </View>
        </Animated.View>

        {/* Grid */}
        <Animated.View style={[styles.gridWrap, s(gridAnim)]}>
          <FlatList
            data={BODY_TYPES}
            numColumns={4}
            keyExtractor={(item) => item.id}
            columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
            renderItem={({ item }) => {
              const active = item.id === selectedId;
              return (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setSelectedId(item.id)}
                  style={[styles.tile, active && styles.tileActive]}
                >
                  {active && (
                    <View style={styles.checkBadge}>
                      <CheckIcon />
                    </View>
                  )}
                  <Image source={item.sil} style={styles.silImg} resizeMode="contain" />
                  <Text style={[styles.tileLabel, active && styles.tileLabelActive]} numberOfLines={1}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </Animated.View>

        {/* CTA */}
        <Animated.View style={[{ marginTop: 12 }, s(ctaAnim)]}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleConfirm}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>Confirm body type</Text>
            <ArrowRight />
          </TouchableOpacity>
        </Animated.View>

      </View>
    </SafeAreaView>
  );
}

function makeStyles(C: Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.screen },
    body: { flex: 1, paddingHorizontal: 22, paddingTop: 8, paddingBottom: 22 },

    head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

    titleBlock: { marginTop: 16, marginBottom: 8, paddingHorizontal: 4 },
    kick: { fontSize: 11.5, fontWeight: '600', letterSpacing: 2.1, textTransform: 'uppercase', color: C.accent, fontFamily: 'SpaceGrotesk_600SemiBold', marginBottom: 4 },
    title: { fontSize: 30, fontWeight: '700', letterSpacing: -1, color: C.text, fontFamily: 'SpaceGrotesk_700Bold' },

    // 3D viewer area
    modelWrap: { position: 'relative', height: 280, marginTop: 8, marginBottom: 14, borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: C.border },
    aura: {
      position: 'absolute', left: '50%', top: '55%',
      width: 280, height: 280, marginLeft: -140, marginTop: -140,
      borderRadius: 140, backgroundColor: C.soft, zIndex: 0,
    },
    model: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'transparent', zIndex: 1 },
    labelChip: {
      position: 'absolute', bottom: 14, alignSelf: 'center',
      flexDirection: 'row', alignItems: 'center', gap: 7,
      paddingVertical: 7, paddingHorizontal: 13,
      borderRadius: 999, backgroundColor: C.soft,
      borderWidth: 1, borderColor: C.accent,
      zIndex: 5,
    },
    labelDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.accent },
    labelChipText: { fontSize: 12, fontWeight: '700', color: C.accent, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: 0.3 },

    // Grid
    gridWrap: { flex: 1 },
    tile: {
      flex: 1,
      aspectRatio: 0.85,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor: C.border,
      backgroundColor: C.surface,
      padding: 6,
      paddingBottom: 8,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    tileActive: {
      borderColor: C.accent,
      borderWidth: 2,
      backgroundColor: C.soft,
    },
    checkBadge: {
      position: 'absolute', top: 6, right: 6,
      width: 20, height: 20, borderRadius: 10,
      backgroundColor: C.accent,
      alignItems: 'center', justifyContent: 'center',
      zIndex: 2,
    },
    silImg: { width: '78%', height: '70%', tintColor: C.text, opacity: 0.85 },
    tileLabel: { marginTop: 4, fontSize: 9.5, fontWeight: '600', color: C.faint, fontFamily: 'SpaceGrotesk_600SemiBold', textAlign: 'center' },
    tileLabelActive: { color: C.text, fontWeight: '700', fontFamily: 'SpaceGrotesk_700Bold' },

    // CTA
    cta: {
      width: '100%',
      borderRadius: 22, paddingVertical: 18,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
      backgroundColor: C.accent, shadowColor: C.accent,
      shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.4, shadowRadius: 18,
    },
    ctaText: { fontWeight: '700', fontSize: 16.5, color: C.accentInk, fontFamily: 'SpaceGrotesk_700Bold' },
  });
}
