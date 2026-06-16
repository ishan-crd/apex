import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
function PlayIcon() {
  return <Svg width={26} height={26} viewBox="0 0 24 24" fill="#fff"><Path d="M8 5.5v13l11-6.5-11-6.5Z" /></Svg>;
}
function CheckIcon() {
  const C = useColors();
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.accentInk} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><Path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
}

const STEPS = [
  'Bench at 30°. Shoulder blades down & back.',
  'Press up and slightly together.',
  'Lower slow — feel the stretch.',
];

export default function ExerciseDetailScreen() {
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

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
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.head, s(headAnim)]}>
          <IconButton onPress={() => router.back()}><BackIcon /></IconButton>
          <Pill label="Upper chest" variant="ghost" />
        </Animated.View>
        <Animated.View style={[styles.video, s(d1)]}>
          <View style={styles.videoChip}><Text style={styles.videoChipText}>Demo</Text></View>
          <TouchableOpacity style={styles.playBtn} activeOpacity={0.8}><PlayIcon /></TouchableOpacity>
          <View style={styles.videoTime}><Text style={styles.videoTimeText}>0:00 / 2:10</Text></View>
          <View style={styles.scrubBar}><View style={styles.scrubFill} /></View>
        </Animated.View>
        <Animated.Text style={[styles.exerciseName, s(d2)]}>Incline DB Press</Animated.Text>
        <Animated.View style={[styles.statsRow, s(d2)]}>
          <View style={styles.statTile}><Text style={styles.statVal}>4</Text><Text style={styles.statLabel}>sets</Text></View>
          <View style={styles.statTile}><Text style={styles.statVal}>8–10</Text><Text style={styles.statLabel}>reps</Text></View>
          <View style={styles.statTile}><Text style={styles.statVal}>90s</Text><Text style={styles.statLabel}>rest</Text></View>
        </Animated.View>
        <Animated.View style={[styles.card, s(d3)]}>
          <Text style={styles.cardKick}>How to</Text>
          <View style={styles.steps}>
            {STEPS.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.numDot}><Text style={styles.numDotText}>{i + 1}</Text></View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
      <Animated.View style={[styles.ctaWrap, s(d4)]}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => router.back()} style={styles.cta}>
          <CheckIcon /><Text style={styles.ctaText}>Got it</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

function makeStyles(C: Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.screen },
    scroll: { flex: 1 },
    content: { paddingHorizontal: 26, paddingTop: 10, paddingBottom: 120 },
    head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    video: { width: '100%', height: 210, borderRadius: 26, overflow: 'hidden', borderWidth: 1, borderColor: C.border, backgroundColor: '#131418', marginTop: 16, position: 'relative' },
    videoChip: { position: 'absolute', top: 14, left: 14, backgroundColor: 'rgba(0,0,0,0.45)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999 },
    videoChipText: { color: '#fff', fontWeight: '600', fontSize: 12, fontFamily: 'SpaceGrotesk_600SemiBold' },
    playBtn: { position: 'absolute', top: '50%', left: '50%', width: 74, height: 74, borderRadius: 37, backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.55)', alignItems: 'center', justifyContent: 'center', marginLeft: -37, marginTop: -37 },
    videoTime: { position: 'absolute', right: 14, bottom: 30, backgroundColor: 'rgba(0,0,0,0.45)', paddingVertical: 5, paddingHorizontal: 9, borderRadius: 9 },
    videoTimeText: { color: '#fff', fontSize: 11.5, fontWeight: '600', fontFamily: 'SpaceGrotesk_600SemiBold' },
    scrubBar: { position: 'absolute', left: 16, right: 16, bottom: 16, height: 4, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)' },
    scrubFill: { height: '100%', width: '0%', backgroundColor: C.accent, borderRadius: 3 },
    exerciseName: { fontSize: 27, fontWeight: '700', color: C.text, marginTop: 18, marginBottom: 14, fontFamily: 'SpaceGrotesk_700Bold' },
    statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    statTile: { flex: 1, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 22, padding: 16, alignItems: 'center' },
    statVal: { fontWeight: '700', fontSize: 26, color: C.text, lineHeight: 26, fontFamily: 'SpaceGrotesk_700Bold' },
    statLabel: { color: C.faint, fontSize: 11.5, fontWeight: '600', marginTop: 8, fontFamily: 'SpaceGrotesk_600SemiBold' },
    card: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 28, padding: 20 },
    cardKick: { fontSize: 11.5, fontWeight: '600', letterSpacing: 2.1, textTransform: 'uppercase', color: C.faint, marginBottom: 14, fontFamily: 'SpaceGrotesk_600SemiBold' },
    steps: { gap: 13 },
    stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    numDot: { width: 24, height: 24, borderRadius: 8, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    numDotText: { fontWeight: '700', fontSize: 12, color: C.accent, fontFamily: 'SpaceGrotesk_700Bold' },
    stepText: { flex: 1, fontSize: 13.5, color: C.dim, lineHeight: 20, fontFamily: 'SpaceGrotesk_400Regular' },
    ctaWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 26, paddingBottom: 40 },
    cta: { width: '100%', borderRadius: 22, paddingVertical: 19, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: C.accent, shadowColor: C.accent, shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.4, shadowRadius: 20 },
    ctaText: { fontWeight: '700', fontSize: 17, color: C.accentInk, fontFamily: 'SpaceGrotesk_700Bold' },
  });
}
