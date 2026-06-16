import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { type Colors } from '@/constants/colors';
import { useColors } from '@/contexts/ThemeContext';

const DAYS = [
  { d: 'M', pct: 64 },
  { d: 'T', pct: 88 },
  { d: 'W', pct: 40 },
  { d: 'T', pct: 96 },
  { d: 'F', pct: 72, active: true },
  { d: 'S', pct: 0 },
  { d: 'S', pct: 0 },
];

export default function YouScreen() {
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
    <View style={styles.container}>
      <View style={styles.figWrap}><View style={styles.figSilhouette} /></View>
      <View style={styles.becomingWrap}><Text style={styles.becomingText}>Becoming · 62%</Text></View>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.body}>
          <Animated.View style={[styles.head, s(headAnim)]}>
            <Text style={styles.title}>You</Text>
            <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
          </Animated.View>
          <View style={{ flex: 1 }} />
          <Animated.View style={[styles.statRow, s(d2)]}>
            <View style={styles.statTile}>
              <Text style={[styles.statVal, { color: C.accent }]}>28</Text>
              <Text style={styles.statLabel}>day streak</Text>
            </View>
            <View style={styles.statTile}>
              <Text style={styles.statVal}>54</Text>
              <Text style={styles.statLabel}>workouts</Text>
            </View>
          </Animated.View>
          <Animated.View style={[styles.card, s(d3)]}>
            <Text style={styles.cardKick}>This week</Text>
            <View style={styles.barsRow}>
              {DAYS.map((day, i) => (
                <View key={i} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: `${day.pct}%` }]} />
                  </View>
                  <Text style={[styles.barDay, day.active && { color: C.text }]}>{day.d}</Text>
                </View>
              ))}
            </View>
            <View style={styles.statFooter}>
              <Text style={styles.footerStat}>26,400 kg</Text>
              <Text style={styles.footerStat}>3h 48m</Text>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
      <LinearGradient colors={['transparent', C.screen]} style={styles.tabGradient} pointerEvents="none" />
    </View>
  );
}

function makeStyles(C: Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.screen },
    figWrap: { position: 'absolute', left: 0, right: 0, top: 150, bottom: 230, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
    figSilhouette: { width: 160, height: '85%', borderRadius: 80, backgroundColor: C.surface, opacity: 0.3 },
    becomingWrap: { position: 'absolute', left: 0, right: 0, top: 120, zIndex: 24, alignItems: 'center' },
    becomingText: { fontSize: 11.5, fontWeight: '600', letterSpacing: 2.1, textTransform: 'uppercase', color: C.faint, fontFamily: 'SpaceGrotesk_600SemiBold' },
    body: { flex: 1, paddingHorizontal: 26, paddingBottom: 104, zIndex: 20 },
    head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
    title: { fontSize: 27, fontWeight: '700', color: C.text, fontFamily: 'SpaceGrotesk_700Bold' },
    avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.surface3, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontWeight: '700', fontSize: 18, color: C.text, fontFamily: 'SpaceGrotesk_700Bold' },
    statRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
    statTile: { flex: 1, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 22, padding: 16, alignItems: 'center' },
    statVal: { fontWeight: '700', fontSize: 26, color: C.text, lineHeight: 26, fontFamily: 'SpaceGrotesk_700Bold' },
    statLabel: { color: C.faint, fontSize: 11.5, fontWeight: '600', marginTop: 8, fontFamily: 'SpaceGrotesk_600SemiBold' },
    card: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 28, padding: 20 },
    cardKick: { fontSize: 11.5, fontWeight: '600', letterSpacing: 2.1, textTransform: 'uppercase', color: C.faint, marginBottom: 14, fontFamily: 'SpaceGrotesk_600SemiBold' },
    barsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 62 },
    barCol: { flex: 1, alignItems: 'center', gap: 7, height: '100%', justifyContent: 'flex-end' },
    barTrack: { width: '100%', borderRadius: 6, backgroundColor: C.track, flex: 1, overflow: 'hidden', justifyContent: 'flex-end' },
    barFill: { width: '100%', backgroundColor: C.accent, borderRadius: 6 },
    barDay: { fontSize: 9.5, color: C.faint, fontWeight: '700', fontFamily: 'SpaceGrotesk_700Bold' },
    statFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
    footerStat: { fontSize: 13, color: C.dim, fontFamily: 'SpaceGrotesk_400Regular' },
    tabGradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 100, zIndex: 10 },
  });
}
