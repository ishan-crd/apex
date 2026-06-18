import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type Colors } from '@/constants/colors';
import { useColors } from '@/contexts/ThemeContext';
import { IconButton } from '@/components/IconButton';
import Svg, { Path } from 'react-native-svg';

function BackIcon() {
  const C = useColors();
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><Path d="M15 6l-6 6 6 6" /></Svg>;
}
function SpinnerIcon() {
  const C = useColors();
  return <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth={2.4} strokeLinecap="round"><Path d="M21 12a9 9 0 1 1-6.2-8.5" /></Svg>;
}
function ArrowRight() {
  const C = useColors();
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.accentInk} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><Path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
}

const SCAN_CAPTIONS = ['Mapping your potential', 'Analyzing muscle composition', 'Building your blueprint', 'Almost there…'];

export default function AnalyzeScreen() {
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const [pct, setPct] = useState(0);
  const [capIdx, setCapIdx] = useState(0);
  const [done, setDone] = useState(false);

  const spinAnim = useRef(new Animated.Value(0)).current;
  const headAnim = useRef(new Animated.Value(0)).current;
  const numAnim = useRef(new Animated.Value(0)).current;
  const capAnim = useRef(new Animated.Value(0)).current;
  const ctaAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(60, [
      Animated.spring(headAnim, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
      Animated.spring(numAnim,  { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
      Animated.spring(capAnim,  { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
    ]).start();
    Animated.loop(Animated.timing(spinAnim, { toValue: 1, duration: 1000, easing: Easing.linear, useNativeDriver: true })).start();
  }, []);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setPct(current);
      if (current % 25 === 0) setCapIdx((i) => Math.min(i + 1, SCAN_CAPTIONS.length - 1));
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          Animated.spring(ctaAnim, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }).start();
        }, 400);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const spinDeg = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const s = (a: Animated.Value) => ({ opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.aura} />
      <View style={styles.figPlaceholder}><View style={styles.figSilhouette} /></View>
      <View style={styles.body}>
        <Animated.View style={[styles.head, s(headAnim)]}>
          <IconButton onPress={() => router.back()}><BackIcon /></IconButton>
          <View style={styles.scanPill}>
            <Animated.View style={{ transform: [{ rotate: spinDeg }] }}><SpinnerIcon /></Animated.View>
            <Text style={styles.scanPillText}>Scanning</Text>
          </View>
        </Animated.View>
        <View style={{ flex: 1 }} />
        <Animated.View style={[{ alignItems: 'center' }, s(numAnim)]}>
          <Text style={styles.huge}>{pct}<Text style={styles.pctSuffix}>%</Text></Text>
        </Animated.View>
        <Animated.Text style={[styles.caption, s(capAnim)]} key={capIdx}>{SCAN_CAPTIONS[capIdx]}</Animated.Text>
        <View style={{ flex: 1 }} />
        <Animated.View style={[{ opacity: ctaAnim }, s(ctaAnim)]}>
          <View onTouchEnd={() => done && router.push('/onboarding-body-type')} style={[styles.cta, !done && { opacity: 0, pointerEvents: 'none' } as any]}>
            <Text style={styles.ctaText}>Select body type</Text>
            <ArrowRight />
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(C: Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.screen },
    aura: { position: 'absolute', left: '50%', top: '46%', width: 360, height: 360, marginLeft: -180, marginTop: -180, borderRadius: 180, backgroundColor: C.soft, zIndex: 0 },
    figPlaceholder: { position: 'absolute', left: 0, right: 0, top: 80, bottom: 120, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
    figSilhouette: { width: 160, height: 360, borderRadius: 80, backgroundColor: C.surface, opacity: 0.35 },
    body: { flex: 1, paddingHorizontal: 26, paddingTop: 10, paddingBottom: 30, alignItems: 'center', zIndex: 20 },
    head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
    scanPill: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 9, paddingHorizontal: 15, borderRadius: 999, backgroundColor: C.soft },
    scanPillText: { fontWeight: '600', fontSize: 13, color: C.accent, fontFamily: 'SpaceGrotesk_600SemiBold' },
    huge: { fontSize: 104, fontWeight: '700', letterSpacing: -5.2, color: C.text, lineHeight: 96, fontFamily: 'SpaceGrotesk_700Bold' },
    pctSuffix: { fontSize: 48, letterSpacing: -2.4, fontFamily: 'SpaceGrotesk_700Bold' },
    caption: { fontSize: 11.5, fontWeight: '600', letterSpacing: 2.1, textTransform: 'uppercase', color: C.faint, marginTop: 10, fontFamily: 'SpaceGrotesk_600SemiBold' },
    cta: { width: '100%', borderRadius: 22, paddingVertical: 19, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: C.accent, shadowColor: C.accent, shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.4, shadowRadius: 20, minWidth: 280 },
    ctaText: { fontWeight: '700', fontSize: 17, color: C.accentInk, fontFamily: 'SpaceGrotesk_700Bold' },
  });
}
