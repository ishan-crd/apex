import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type Colors } from '@/constants/colors';
import { useColors } from '@/contexts/ThemeContext';
import { IconButton } from '@/components/IconButton';
import { Pill } from '@/components/Pill';
import Svg, { Path } from 'react-native-svg';

function BackIcon() {
  const C = useColors();
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><Path d="M15 6l-6 6 6 6" /></Svg>;
}
function BoltIcon() {
  const C = useColors();
  return <Svg width={22} height={22} viewBox="0 0 24 24" fill={C.accentInk}><Path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></Svg>;
}
function ArrowRight() {
  const C = useColors();
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.accentInk} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><Path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
}
function CheckIcon() {
  const C = useColors();
  return <Svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={C.accentInk} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><Path d="M5 12.5 10 17l9-10" /></Svg>;
}

function useCountUp(target: number, delay = 600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let current = 0;
      const step = () => { current += 1; setVal(current); if (current < target) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay]);
  return val;
}

const NODES = [
  { label: 'Weeks 1–4', phase: 'Foundation', state: 'done' },
  { label: 'Weeks 5–10', phase: 'Build', state: 'on' },
  { label: 'Weeks 11–14', phase: 'Reveal', state: '' },
];

export default function OnboardingPlanScreen() {
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const weeks = useCountUp(14, 500);

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

  const s = (a: Animated.Value) => ({ opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.body}>
        <Animated.View style={[styles.head, s(headAnim)]}>
          <IconButton onPress={() => router.back()}><BackIcon /></IconButton>
          <Pill label="Step 2 / 4" variant="ghost" />
        </Animated.View>
        <Animated.View style={[styles.centerBlock, s(d1)]}>
          <Text style={styles.kick}>You'll get there in</Text>
          <Text style={styles.huge}>{weeks}</Text>
          <Text style={styles.weeksLabel}>weeks</Text>
        </Animated.View>
        <Animated.View style={[styles.boltCard, s(d2)]}>
          <BoltIcon />
          <Text style={styles.boltText}>Stay consistent → finish faster than 92% who start here.</Text>
        </Animated.View>
        <Animated.View style={[styles.tl, s(d3)]}>
          {NODES.map((node, i) => (
            <View key={i} style={[styles.tnode, i === NODES.length - 1 && { paddingBottom: 0 }]}>
              <View style={[styles.tdot, node.state === 'done' && styles.tdotDone, node.state === 'on' && styles.tdotOn]}>
                {node.state === 'done' ? <CheckIcon /> : node.state === 'on' ? <View style={styles.tdotInner} /> : null}
              </View>
              <Text style={styles.tsub}>{node.label}</Text>
              <View style={styles.tphRow}>
                <Text style={styles.tph}>{node.phase}</Text>
                {node.state === 'on' && <View style={styles.nowBadge}><Text style={styles.nowBadgeText}>now</Text></View>}
              </View>
            </View>
          ))}
          <View style={styles.tlLine} />
        </Animated.View>
        <View style={{ flex: 1 }} />
        <Animated.View style={s(d4)}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/onboarding-fuel')} style={styles.cta}>
            <Text style={styles.ctaText}>Next</Text><ArrowRight />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(C: Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.screen },
    body: { flex: 1, paddingHorizontal: 26, paddingTop: 10, paddingBottom: 30 },
    head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    centerBlock: { alignItems: 'center', marginTop: 18 },
    kick: { fontSize: 11.5, fontWeight: '600', letterSpacing: 2.1, textTransform: 'uppercase', color: C.faint, fontFamily: 'SpaceGrotesk_600SemiBold' },
    huge: { fontSize: 104, fontWeight: '700', letterSpacing: -5.2, color: C.accent, lineHeight: 100, marginTop: 8, fontFamily: 'SpaceGrotesk_700Bold' },
    weeksLabel: { fontSize: 27, fontWeight: '700', color: C.text, marginTop: -2, fontFamily: 'SpaceGrotesk_700Bold' },
    boltCard: { marginTop: 20, backgroundColor: C.accent, borderRadius: 28, padding: 20, flexDirection: 'row', alignItems: 'flex-start', gap: 11 },
    boltText: { flex: 1, fontWeight: '700', fontSize: 15, lineHeight: 21, color: C.accentInk, fontFamily: 'SpaceGrotesk_700Bold' },
    tl: { marginTop: 24, paddingLeft: 30, position: 'relative' },
    tlLine: { position: 'absolute', left: 9, top: 8, bottom: 8, width: 2, backgroundColor: C.border2, zIndex: 0 },
    tnode: { position: 'relative', paddingBottom: 20 },
    tdot: { position: 'absolute', left: -30, top: 1, width: 20, height: 20, borderRadius: 10, backgroundColor: C.surface, borderWidth: 2, borderColor: C.border2, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
    tdotDone: { backgroundColor: C.accent, borderColor: C.accent },
    tdotOn: { backgroundColor: C.accent, borderColor: C.accent },
    tdotInner: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.accentInk },
    tph: { fontWeight: '700', fontSize: 17, color: C.text, fontFamily: 'SpaceGrotesk_700Bold' },
    tsub: { color: C.faint, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: 'SpaceGrotesk_600SemiBold' },
    tphRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
    nowBadge: { backgroundColor: C.soft, borderRadius: 999, paddingVertical: 2, paddingHorizontal: 9 },
    nowBadgeText: { color: C.accent, fontSize: 10, fontWeight: '600', fontFamily: 'SpaceGrotesk_600SemiBold' },
    cta: { width: '100%', borderRadius: 22, paddingVertical: 19, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: C.accent, shadowColor: C.accent, shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.4, shadowRadius: 20 },
    ctaText: { fontWeight: '700', fontSize: 17, color: C.accentInk, fontFamily: 'SpaceGrotesk_700Bold' },
  });
}
