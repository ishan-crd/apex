import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { type Colors } from '@/constants/colors';
import { useColors } from '@/contexts/ThemeContext';
import Svg, { Circle } from 'react-native-svg';

function MacroRing({ pct, color, size = 64 }: { pct: number; color: string; size?: number }) {
  const C = useColors();
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: [{ rotate: '-90deg' }] }}>
      <Circle cx={size / 2} cy={size / 2} r={r} stroke={C.track} strokeWidth={6} fill="none" />
      <Circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={`${circ}`} strokeDashoffset={offset} />
    </Svg>
  );
}

const CHIPS = ["5'11\"", '27 yrs', '178 lb', '4–5× / wk'];
const MEALS = [
  { name: 'Breakfast', kcal: 580, items: ['Oats + Protein Powder', 'Banana', '2 Eggs'] },
  { name: 'Lunch', kcal: 720, items: ['Chicken Breast', 'Brown Rice', 'Broccoli'] },
  { name: 'Dinner', kcal: 840, items: ['Salmon', 'Sweet Potato', 'Salad'] },
  { name: 'Snacks', kcal: 500, items: ['Greek Yogurt', 'Almonds', 'Protein Bar'] },
];

export default function FuelScreen() {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  const MACROS = useMemo(() => [
    { label: 'Protein', value: '198g', pct: 68, color: C.accent },
    { label: 'Carbs',   value: '264g', pct: 52, color: C.text },
    { label: 'Fat',     value: '73g',  pct: 40, color: C.faint },
  ], [C]);

  const headAnim = useRef(new Animated.Value(0)).current;
  const d1 = useRef(new Animated.Value(0)).current;
  const d2 = useRef(new Animated.Value(0)).current;
  const d3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(60, [
      Animated.spring(headAnim, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
      Animated.spring(d1, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
      Animated.spring(d2, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
      Animated.spring(d3, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
    ]).start();
  }, []);

  const s = (a: Animated.Value) => ({ opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.head, s(headAnim)]}>
          <Text style={styles.title}>Your daily{'\n'}fuel</Text>
        </Animated.View>
        <Animated.View style={[styles.card, s(d1)]}>
          <Text style={styles.cardKick}>Eat this much</Text>
          <Text style={styles.kcal}>2,640</Text>
          <Text style={styles.kcalUnit}>kcal / day</Text>
          <View style={styles.macroRow}>
            {MACROS.map((m) => (
              <View key={m.label} style={styles.macroItem}>
                <MacroRing pct={m.pct} color={m.color} />
                <Text style={[styles.macroValue, { color: m.color }]}>{m.value}</Text>
                <Text style={styles.macroLabel}>{m.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
        <Animated.View style={[styles.chipRow, s(d2)]}>
          {CHIPS.map((chip, i) => (
            <View key={i} style={[styles.chip, i === 3 && styles.chipActive]}>
              <Text style={[styles.chipText, i === 3 && styles.chipTextActive]}>{chip}</Text>
            </View>
          ))}
        </Animated.View>
        <Animated.View style={[{ marginTop: 24 }, s(d3)]}>
          <Text style={styles.sectionTitle}>Meal plan</Text>
          <View style={styles.mealsCol}>
            {MEALS.map((meal) => (
              <View key={meal.name} style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Text style={styles.mealKcal}>{meal.kcal} kcal</Text>
                </View>
                {meal.items.map((item) => <Text key={item} style={styles.mealItem}>· {item}</Text>)}
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
      <LinearGradient colors={['transparent', C.screen]} style={styles.tabGradient} pointerEvents="none" />
    </SafeAreaView>
  );
}

function makeStyles(C: Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.screen },
    scroll: { flex: 1 },
    content: { paddingHorizontal: 26, paddingTop: 10, paddingBottom: 120 },
    head: { marginBottom: 22 },
    title: { fontSize: 34, fontWeight: '700', letterSpacing: -1, color: C.text, lineHeight: 38, fontFamily: 'SpaceGrotesk_700Bold' },
    card: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 28, padding: 26, alignItems: 'center' },
    cardKick: { fontSize: 11.5, fontWeight: '600', letterSpacing: 2.1, textTransform: 'uppercase', color: C.faint, fontFamily: 'SpaceGrotesk_600SemiBold' },
    kcal: { fontSize: 72, fontWeight: '700', letterSpacing: -3.6, color: C.text, marginTop: 10, marginBottom: 4, lineHeight: 72, fontFamily: 'SpaceGrotesk_700Bold' },
    kcalUnit: { fontWeight: '600', color: C.dim, fontSize: 15, fontFamily: 'SpaceGrotesk_600SemiBold' },
    macroRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 24, width: '100%' },
    macroItem: { flex: 1, alignItems: 'center', gap: 9 },
    macroValue: { fontWeight: '700', fontSize: 21, fontFamily: 'SpaceGrotesk_700Bold' },
    macroLabel: { fontSize: 11, color: C.faint, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: 'SpaceGrotesk_600SemiBold' },
    chipRow: { flexDirection: 'row', gap: 10, marginTop: 16, flexWrap: 'wrap' },
    chip: { paddingVertical: 8, paddingHorizontal: 13, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border },
    chipActive: { borderColor: C.accent, backgroundColor: C.soft },
    chipText: { fontSize: 12.5, color: C.dim, fontWeight: '600', fontFamily: 'SpaceGrotesk_600SemiBold' },
    chipTextActive: { color: C.accent },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: C.text, marginBottom: 12, fontFamily: 'SpaceGrotesk_700Bold' },
    mealsCol: { gap: 10 },
    mealCard: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 22, padding: 16 },
    mealHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    mealName: { fontWeight: '700', fontSize: 16, color: C.text, fontFamily: 'SpaceGrotesk_700Bold' },
    mealKcal: { fontWeight: '600', fontSize: 14, color: C.accent, fontFamily: 'SpaceGrotesk_600SemiBold' },
    mealItem: { fontSize: 14, color: C.dim, lineHeight: 22, fontFamily: 'SpaceGrotesk_400Regular' },
    tabGradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 100, zIndex: 10 },
  });
}
