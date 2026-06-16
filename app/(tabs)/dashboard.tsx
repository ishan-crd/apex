import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { type Colors } from '@/constants/colors';
import { useColors } from '@/contexts/ThemeContext';
import Svg, { Path } from 'react-native-svg';
import ModelViewer from '@/components/ModelViewer';

function FireIcon() {
  const C = useColors();
  return <Svg width={15} height={15} viewBox="0 0 24 24" fill={C.text}><Path d="M12 3c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.5.8-2.6 1.5-3.5C10 9 9.2 5.5 12 3Z" /></Svg>;
}
function BoltIcon() {
  const C = useColors();
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill={C.accentInk}><Path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></Svg>;
}

function useCountUp(target: number, delay = 300) {
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

export default function DashboardScreen() {
  const router = useRouter();
  const C = useColors();
  const scheme = useColorScheme();
  const styles = useMemo(() => makeStyles(C, scheme === 'light'), [C, scheme]);
  const pct = useCountUp(62, 400);

  const headAnim = useRef(new Animated.Value(0)).current;
  const d1 = useRef(new Animated.Value(0)).current;
  const d3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(80, [
      Animated.spring(headAnim, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 200 }),
      Animated.spring(d1, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 200 }),
      Animated.spring(d3, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 200 }),
    ]).start();
  }, []);

  const s = (a: Animated.Value) => ({ opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] });

  return (
    <View style={styles.container}>
      <ModelViewer style={styles.model} />
      <View style={styles.bodyScale}>
        <View style={styles.goalMark}>
          <Text style={styles.goalMarkText}>DREAM</Text>
          <View style={styles.goalMarkLine} />
        </View>
        <View style={styles.nowMark}>
          <Text style={styles.nowMarkText}>NOW</Text>
          <View style={styles.nowMarkLine} />
        </View>
      </View>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.body}>
          <Animated.View style={[styles.head, s(headAnim)]}>
            <View>
              <Text style={styles.kick}>Friday · Week 6</Text>
              <Text style={styles.greeting}>Hey, Alex</Text>
            </View>
            <View style={styles.headRight}>
              <View style={styles.streakPill}>
                <FireIcon />
                <Text style={styles.streakNum}>28</Text>
              </View>
              <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
            </View>
          </Animated.View>
          <Animated.View style={[styles.progressBlock, s(d1)]}>
            <Text style={styles.huge}>{pct}<Text style={styles.pctText}>%</Text></Text>
            <Text style={styles.progressSub}>to your dream</Text>
            <View style={styles.aheadBadge}>
              <Svg width={13} height={13} viewBox="0 0 24 24" fill={C.accent}><Path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></Svg>
              <Text style={styles.aheadText}>28% ahead</Text>
            </View>
          </Animated.View>
          <View style={{ flex: 1 }} />
          <Animated.View style={[styles.cardWrap, s(d3)]}>
            <BlurView intensity={28} tint={scheme === 'light' ? 'light' : 'dark'} style={StyleSheet.absoluteFill} />
            <View style={styles.statRow}>
              <View style={styles.statTile}>
                <Text style={[styles.statVal, { color: C.accent }]}>28</Text>
                <Text style={styles.statLabel}>streak</Text>
              </View>
              <View style={styles.statTile}>
                <Text style={styles.statVal}>54</Text>
                <Text style={styles.statLabel}>days</Text>
              </View>
              <View style={styles.statTile}>
                <Text style={styles.statVal}>4<Text style={{ color: C.faint, fontSize: 16 }}>/5</Text></Text>
                <Text style={styles.statLabel}>this wk</Text>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/workout/picker')} style={styles.cta}>
              <BoltIcon />
              <Text style={styles.ctaText}>Start today</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
      <LinearGradient colors={['transparent', C.screen]} style={styles.tabGradient} pointerEvents="none" />
    </View>
  );
}

function makeStyles(C: Colors, isLight: boolean) {
  const cardBg = isLight ? 'rgba(255,255,255,0.55)' : 'rgba(21,23,27,0.55)';
  const cardBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.10)';
  const tileBg = isLight ? 'rgba(240,241,239,0.65)' : 'rgba(30,32,37,0.60)';

  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.screen },
    model: { position: 'absolute', top: 110, left: 0, right: 0, bottom: 160, zIndex: 1 },
    bodyScale: { position: 'absolute', right: 24, top: 158, bottom: 210, width: 60, zIndex: 25, justifyContent: 'space-between', alignItems: 'flex-end', pointerEvents: 'none' as any },
    goalMark: { flexDirection: 'row', alignItems: 'center', gap: 7 },
    goalMarkText: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, color: C.accent, fontFamily: 'SpaceGrotesk_700Bold' },
    goalMarkLine: { width: 18, height: 2, backgroundColor: C.accent },
    nowMark: { flexDirection: 'row', alignItems: 'center', gap: 7 },
    nowMarkText: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, color: C.faint, fontFamily: 'SpaceGrotesk_700Bold' },
    nowMarkLine: { width: 18, height: 2, backgroundColor: C.faint },
    safeArea: { flex: 1, zIndex: 10 },
    body: { flex: 1, paddingHorizontal: 26, paddingBottom: 145, zIndex: 20 },
    head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
    kick: { fontSize: 11.5, fontWeight: '600', letterSpacing: 2.1, textTransform: 'uppercase', color: C.faint, fontFamily: 'SpaceGrotesk_600SemiBold' },
    greeting: { fontSize: 27, fontWeight: '700', color: C.text, marginTop: 5, fontFamily: 'SpaceGrotesk_700Bold' },
    headRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    streakPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 9, paddingHorizontal: 15, borderRadius: 999, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border },
    streakNum: { fontWeight: '600', fontSize: 13, color: C.text, fontFamily: 'SpaceGrotesk_600SemiBold' },
    avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.surface3, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontWeight: '700', fontSize: 18, color: C.text, fontFamily: 'SpaceGrotesk_700Bold' },
    progressBlock: { position: 'absolute', left: 26, top: 160, zIndex: 24 },
    huge: { fontSize: 80, fontWeight: '700', letterSpacing: -4, color: C.text, lineHeight: 76, fontFamily: 'SpaceGrotesk_700Bold' },
    pctText: { fontSize: 34, letterSpacing: -1.7, fontFamily: 'SpaceGrotesk_700Bold' },
    progressSub: { fontSize: 11.5, fontWeight: '600', letterSpacing: 2.1, textTransform: 'uppercase', color: C.faint, marginTop: 2, fontFamily: 'SpaceGrotesk_600SemiBold' },
    aheadBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 7, paddingHorizontal: 13, borderRadius: 999, backgroundColor: C.soft, alignSelf: 'flex-start', marginTop: 12 },
    aheadText: { fontSize: 13, fontWeight: '600', color: C.accent, fontFamily: 'SpaceGrotesk_600SemiBold' },
    cardWrap: { borderRadius: 28, borderWidth: 1, borderColor: cardBorder, backgroundColor: cardBg, overflow: 'hidden', padding: 16 },
    statRow: { flexDirection: 'row', gap: 10 },
    statTile: { flex: 1, backgroundColor: tileBg, borderRadius: 18, padding: 13, alignItems: 'center' },
    statVal: { fontWeight: '700', fontSize: 26, color: C.text, lineHeight: 26, fontFamily: 'SpaceGrotesk_700Bold' },
    statLabel: { color: C.faint, fontSize: 11.5, fontWeight: '600', marginTop: 8, fontFamily: 'SpaceGrotesk_600SemiBold' },
    cta: { marginTop: 14, width: '100%', borderRadius: 22, paddingVertical: 19, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: C.accent, shadowColor: C.accent, shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.4, shadowRadius: 18 },
    ctaText: { fontWeight: '700', fontSize: 17, color: C.accentInk, fontFamily: 'SpaceGrotesk_700Bold' },
    tabGradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 100, zIndex: 10 },
  });
}
