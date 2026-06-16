import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { type Colors } from '@/constants/colors';
import { useColors } from '@/contexts/ThemeContext';
import Svg, { Path } from 'react-native-svg';

function BoltIcon() {
  const C = useColors();
  return <Svg width={22} height={22} viewBox="0 0 24 24" fill={C.accentInk}><Path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></Svg>;
}
function CheckIcon() {
  const C = useColors();
  return <Svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={C.accentInk} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><Path d="M5 12.5 10 17l9-10" /></Svg>;
}

const NODES = [
  { label: 'Weeks 1–4', phase: 'Foundation', state: 'done', desc: 'Build the base. Establish movement patterns and consistency.' },
  { label: 'Weeks 5–10', phase: 'Build', state: 'on', desc: 'Progressive overload. Add weight each week, prioritize protein.' },
  { label: 'Weeks 11–14', phase: 'Reveal', state: '', desc: 'Slight caloric deficit, maintain muscle, peak definition.' },
];

export default function PlanScreen() {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

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
          <Text style={styles.title}>Your Plan</Text>
        </Animated.View>
        <Animated.View style={[styles.centerBlock, s(d1)]}>
          <Text style={styles.kick}>You'll get there in</Text>
          <Text style={styles.huge}>14</Text>
          <Text style={styles.weeksLabel}>weeks</Text>
        </Animated.View>
        <Animated.View style={[styles.boltCard, s(d2)]}>
          <BoltIcon />
          <Text style={styles.boltText}>Stay consistent → finish faster than 92% who start here.</Text>
        </Animated.View>
        <Animated.View style={[styles.progressBlock, s(d2)]}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Week 6 of 14</Text>
            <Text style={[styles.progressLabel, { color: C.accent }]}>43%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '43%' }]} />
          </View>
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
              <Text style={styles.tdesc}>{node.desc}</Text>
            </View>
          ))}
          <View style={styles.tlLine} />
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
    head: { marginBottom: 0 },
    title: { fontSize: 27, fontWeight: '700', color: C.text, fontFamily: 'SpaceGrotesk_700Bold' },
    centerBlock: { alignItems: 'center', marginTop: 18, marginBottom: 4 },
    kick: { fontSize: 11.5, fontWeight: '600', letterSpacing: 2.1, textTransform: 'uppercase', color: C.faint, fontFamily: 'SpaceGrotesk_600SemiBold' },
    huge: { fontSize: 104, fontWeight: '700', letterSpacing: -5.2, color: C.accent, lineHeight: 100, marginTop: 8, fontFamily: 'SpaceGrotesk_700Bold' },
    weeksLabel: { fontSize: 27, fontWeight: '700', color: C.text, marginTop: -2, fontFamily: 'SpaceGrotesk_700Bold' },
    boltCard: { marginTop: 20, backgroundColor: C.accent, borderRadius: 28, padding: 20, flexDirection: 'row', alignItems: 'flex-start', gap: 11 },
    boltText: { flex: 1, fontWeight: '700', fontSize: 15, lineHeight: 21, color: C.accentInk, fontFamily: 'SpaceGrotesk_700Bold' },
    progressBlock: { marginTop: 20 },
    progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    progressLabel: { fontSize: 13, fontWeight: '600', color: C.dim, fontFamily: 'SpaceGrotesk_600SemiBold' },
    progressTrack: { height: 6, borderRadius: 3, backgroundColor: C.track },
    progressFill: { height: '100%', borderRadius: 3, backgroundColor: C.accent },
    tl: { marginTop: 28, paddingLeft: 30, position: 'relative' },
    tlLine: { position: 'absolute', left: 9, top: 8, bottom: 8, width: 2, backgroundColor: C.border2, zIndex: 0 },
    tnode: { position: 'relative', paddingBottom: 28 },
    tdot: { position: 'absolute', left: -30, top: 16, width: 20, height: 20, borderRadius: 10, backgroundColor: C.surface, borderWidth: 2, borderColor: C.border2, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
    tdotDone: { backgroundColor: C.accent, borderColor: C.accent },
    tdotOn: { backgroundColor: C.accent, borderColor: C.accent },
    tdotInner: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.accentInk },
    tsub: { color: C.faint, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: 'SpaceGrotesk_600SemiBold' },
    tphRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
    tph: { fontWeight: '700', fontSize: 17, color: C.text, fontFamily: 'SpaceGrotesk_700Bold' },
    nowBadge: { backgroundColor: C.soft, borderRadius: 999, paddingVertical: 2, paddingHorizontal: 9 },
    nowBadgeText: { color: C.accent, fontSize: 10, fontWeight: '600', fontFamily: 'SpaceGrotesk_600SemiBold' },
    tdesc: { fontSize: 14, color: C.dim, lineHeight: 20, marginTop: 6, fontFamily: 'SpaceGrotesk_400Regular' },
    tabGradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 100, zIndex: 10 },
  });
}
