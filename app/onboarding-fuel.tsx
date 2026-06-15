import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '@/constants/colors';
import { IconButton } from '@/components/IconButton';
import { Pill } from '@/components/Pill';
import Svg, { Path, Circle, G, Defs, ClipPath } from 'react-native-svg';

function BackIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15 6l-6 6 6 6" />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.accentInk} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12.5 10 17l9-10" />
    </Svg>
  );
}

function MacroRing({ pct, color, size = 64 }: { pct: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: [{ rotate: '-90deg' }] }}>
      <Circle cx={size / 2} cy={size / 2} r={r} stroke={C.track} strokeWidth={6} fill="none" />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${circ}`}
        strokeDashoffset={offset}
      />
    </Svg>
  );
}

function useCountUp(target: number, delay: number = 400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let current = 0;
      const step = () => {
        current += Math.ceil(target / 60);
        if (current >= target) {
          setVal(target);
        } else {
          setVal(current);
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay]);
  return val;
}

const MACROS = [
  { label: 'Protein', value: 198, pct: 68, color: C.accent },
  { label: 'Carbs', value: 264, pct: 52, color: C.text },
  { label: 'Fat', value: 73, pct: 40, color: C.faint },
];

const CHIPS = ['5\'11"', '27 yrs', '178 lb', '4–5× / wk'];

export default function OnboardingFuelScreen() {
  const router = useRouter();
  const kcal = useCountUp(2640);

  const headAnim = useRef(new Animated.Value(0)).current;
  const d1 = useRef(new Animated.Value(0)).current;
  const d2 = useRef(new Animated.Value(0)).current;
  const d3 = useRef(new Animated.Value(0)).current;
  const d4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(60, [
      Animated.spring(headAnim, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
      Animated.spring(d1, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
      Animated.spring(d2, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
      Animated.spring(d3, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
      Animated.spring(d4, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
    ]).start();
  }, []);

  const s = (a: Animated.Value) => ({
    opacity: a,
    transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.body}>
        <Animated.View style={[styles.head, s(headAnim)]}>
          <IconButton onPress={() => router.back()}>
            <BackIcon />
          </IconButton>
          <Pill label="Step 3 / 4" variant="ghost" />
        </Animated.View>

        <Animated.Text style={[styles.title, s(d1)]}>Your daily{'\n'}fuel</Animated.Text>

        <Animated.View style={[styles.card, s(d2)]}>
          <Text style={styles.cardKick}>Eat this much</Text>
          <Text style={styles.kcal}>{kcal.toLocaleString()}</Text>
          <Text style={styles.kcalUnit}>kcal / day</Text>

          <View style={styles.macroRow}>
            {MACROS.map((m) => (
              <View key={m.label} style={styles.macroItem}>
                <MacroRing pct={m.pct} color={m.color} />
                <Text style={[styles.macroValue, { color: m.color === C.text ? C.text : m.color }]}>
                  {m.value}g
                </Text>
                <Text style={styles.macroLabel}>{m.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View style={[styles.chipRow, s(d3)]}>
          {CHIPS.map((chip, i) => (
            <View key={i} style={[styles.chip, i === 3 && styles.chipActive]}>
              <Text style={[styles.chipText, i === 3 && styles.chipTextActive]}>{chip}</Text>
            </View>
          ))}
        </Animated.View>

        <View style={{ flex: 1 }} />

        <Animated.View style={s(d4)}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.replace('/(tabs)/dashboard')}
            style={styles.cta}
          >
            <CheckIcon />
            <Text style={styles.ctaText}>Let's go</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.screen },
  body: { flex: 1, paddingHorizontal: 26, paddingTop: 10, paddingBottom: 30 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -1, color: C.text, marginTop: 24, marginBottom: 22, lineHeight: 38, fontFamily: 'SpaceGrotesk_700Bold' },
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
  cta: {
    width: '100%',
    borderRadius: 22,
    paddingVertical: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: C.accent,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  ctaText: { fontWeight: '700', fontSize: 17, color: C.accentInk, fontFamily: 'SpaceGrotesk_700Bold' },
});
