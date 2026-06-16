import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type Colors } from '@/constants/colors';
import { useColors } from '@/contexts/ThemeContext';
import { IconButton } from '@/components/IconButton';
import Svg, { Circle, Path } from 'react-native-svg';

function BackIcon() {
  const C = useColors();
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><Path d="M15 6l-6 6 6 6" /></Svg>;
}
function InfoIcon() {
  const C = useColors();
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><Circle cx={12} cy={12} r={9} /><Path d="M12 11v5M12 8h.01" /></Svg>;
}
function PlayIcon() {
  return <Svg width={26} height={26} viewBox="0 0 24 24" fill="#fff"><Path d="M8 5.5v13l11-6.5-11-6.5Z" /></Svg>;
}
function SwapIcon() {
  const C = useColors();
  return <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><Path d="M7 4 3 8l4 4" /><Path d="M3 8h13a4 4 0 0 1 0 8h-2" /><Path d="M17 20l4-4-4-4" /><Path d="M21 16H8" /></Svg>;
}
function CheckIcon() {
  const C = useColors();
  return <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={C.accentInk} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><Path d="M5 12.5 10 17l9-10" /></Svg>;
}
function AddIcon() {
  const C = useColors();
  return <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth={2.2} strokeLinecap="round"><Path d="M12 5v14M5 12h14" /></Svg>;
}
function CheckSmallIcon() {
  const C = useColors();
  return <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={C.accentInk} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><Path d="M5 12.5 10 17l9-10" /></Svg>;
}

const SETS = [
  { n: 1, wt: 22, reps: 10, done: true },
  { n: 2, wt: 22, reps: 9, done: true },
  { n: 3, wt: 24, reps: 8, done: false, cur: true },
  { n: 4, wt: 24, reps: 8, done: false },
];

const SWAPS = [
  { name: 'Incline Machine Press', type: 'Machine', best: true },
  { name: 'Incline Push-Up', type: 'Bodyweight', best: false },
  { name: 'Landmine Press', type: 'Barbell', best: false },
  { name: 'Incline Cable Press', type: 'Cable', best: false },
];

export default function WorkoutSessionScreen() {
  const router = useRouter();
  const C = useColors();
  const scheme = useColorScheme();
  const styles = useMemo(() => makeStyles(C, scheme === 'light'), [C, scheme]);
  const [swapOpen, setSwapOpen] = useState(false);
  const sheetAnim = useRef(new Animated.Value(0)).current;

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

  const openSwap = () => {
    setSwapOpen(true);
    Animated.spring(sheetAnim, { toValue: 1, useNativeDriver: true, damping: 26, stiffness: 280 }).start();
  };
  const closeSwap = () => {
    Animated.timing(sheetAnim, { toValue: 0, duration: 320, useNativeDriver: true }).start(() => setSwapOpen(false));
  };

  const sheetY = sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [500, 0] });
  const s = (a: Animated.Value) => ({ opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.body}>
        <Animated.View style={[styles.head, s(headAnim)]}>
          <IconButton onPress={() => router.back()}><BackIcon /></IconButton>
          <View style={styles.headCenter}>
            <Text style={styles.headTitle}>Push Day</Text>
            <Text style={styles.headSub}>2 of 6</Text>
          </View>
          <IconButton onPress={() => router.push('/workout/detail')}><InfoIcon /></IconButton>
        </Animated.View>
        <Animated.View style={[styles.progressBar, s(d1)]}>
          {[1, 1, 0, 0, 0, 0].map((fill, i) => (
            <View key={i} style={[styles.progSeg, { backgroundColor: fill ? C.accent : C.track }]} />
          ))}
        </Animated.View>
        <Animated.View style={[styles.video, s(d2)]}>
          <View style={styles.videoGrid} />
          <View style={styles.videoChip}>
            <Svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M3 10.5 12 3l9 7.5" /><Path d="M5 9.5V21h14V9.5" />
            </Svg>
            <Text style={styles.videoChipText}>Home</Text>
          </View>
          <TouchableOpacity style={styles.playBtn} activeOpacity={0.8}><PlayIcon /></TouchableOpacity>
          <View style={styles.videoTime}><Text style={styles.videoTimeText}>0:42 / 2:10</Text></View>
          <View style={styles.scrubBar}><View style={styles.scrubFill} /></View>
        </Animated.View>
        <Animated.Text style={[styles.exerciseName, s(d3)]}>Incline DB Press</Animated.Text>
        <Animated.View style={[styles.setsRow, s(d3)]}>
          {SETS.map((set) => (
            <View key={set.n} style={[styles.setDot, set.done && styles.setDotDone, set.cur && styles.setDotCur]}>
              <Text style={[styles.setNum, set.done && styles.setNumDone]}>{set.n}</Text>
              <Text style={[styles.setVal, set.done && styles.setValDone]}>{set.wt}×{set.reps}</Text>
            </View>
          ))}
        </Animated.View>
        <View style={{ flex: 1 }} />
        <Animated.View style={[styles.actionRow, s(d4)]}>
          <TouchableOpacity activeOpacity={0.85} onPress={openSwap} style={styles.swapBtn}>
            <SwapIcon /><Text style={styles.swapText}>Swap</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={styles.logBtn}>
            <CheckIcon /><Text style={styles.logText}>Log set 3</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      {swapOpen && (
        <Pressable style={styles.scrim} onPress={closeSwap}>
          <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}>
            <Pressable onPress={() => {}}>
              <View style={styles.grab} />
              <Text style={styles.sheetTitle}>Swap exercise</Text>
              <Text style={styles.sheetSub}>Same muscles — pick your gear.</Text>
              <View style={styles.swapList}>
                {SWAPS.map((ex) => (
                  <TouchableOpacity key={ex.name} activeOpacity={0.85} style={[styles.exRow, ex.best && styles.exRowBest]}>
                    <View style={styles.exThumb}>
                      <Svg width={17} height={17} viewBox="0 0 24 24" fill={C.faint}>
                        <Path d="M8 5.5v13l11-6.5-11-6.5Z" />
                      </Svg>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.exName}>{ex.name}</Text>
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 4, alignItems: 'center' }}>
                        <Text style={styles.exType}>{ex.type}</Text>
                        {ex.best && <View style={styles.bestBadge}><Text style={styles.bestBadgeText}>Best</Text></View>}
                      </View>
                    </View>
                    <TouchableOpacity style={[styles.addBtn, ex.best && styles.addBtnBest]} activeOpacity={0.85}>
                      {ex.best ? <CheckSmallIcon /> : <AddIcon />}
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

function makeStyles(C: Colors, isLight: boolean) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.screen },
    body: { flex: 1, paddingHorizontal: 26, paddingTop: 10, paddingBottom: 30 },
    head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headCenter: { flex: 1, alignItems: 'center' },
    headTitle: { fontWeight: '700', fontSize: 15, color: C.text, fontFamily: 'SpaceGrotesk_700Bold' },
    headSub: { fontSize: 11.5, fontWeight: '600', letterSpacing: 2.1, textTransform: 'uppercase', color: C.faint, fontFamily: 'SpaceGrotesk_600SemiBold' },
    progressBar: { flexDirection: 'row', gap: 5, marginTop: 16, marginBottom: 18 },
    progSeg: { flex: 1, height: 5, borderRadius: 3 },
    video: { width: '100%', height: 236, borderRadius: 26, overflow: 'hidden', borderWidth: 1, borderColor: C.border, backgroundColor: isLight ? '#2a2c30' : '#131418', position: 'relative' },
    videoGrid: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.5, backgroundColor: 'transparent' },
    videoChip: { position: 'absolute', top: 14, left: 14, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,0.45)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999 },
    videoChipText: { color: '#fff', fontWeight: '600', fontSize: 12, fontFamily: 'SpaceGrotesk_600SemiBold' },
    playBtn: { position: 'absolute', top: '50%', left: '50%', width: 74, height: 74, borderRadius: 37, backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.55)', alignItems: 'center', justifyContent: 'center', marginLeft: -37, marginTop: -37 },
    videoTime: { position: 'absolute', right: 14, bottom: 30, backgroundColor: 'rgba(0,0,0,0.45)', paddingVertical: 5, paddingHorizontal: 9, borderRadius: 9 },
    videoTimeText: { color: '#fff', fontSize: 11.5, fontWeight: '600', fontFamily: 'SpaceGrotesk_600SemiBold' },
    scrubBar: { position: 'absolute', left: 16, right: 16, bottom: 16, height: 4, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)' },
    scrubFill: { height: '100%', width: '34%', backgroundColor: C.accent, borderRadius: 3 },
    exerciseName: { fontSize: 27, fontWeight: '700', color: C.text, marginTop: 18, marginBottom: 12, fontFamily: 'SpaceGrotesk_700Bold' },
    setsRow: { flexDirection: 'row', gap: 9 },
    setDot: { flex: 1, alignItems: 'center', paddingVertical: 13, borderRadius: 16, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border },
    setDotDone: { backgroundColor: C.accent, borderColor: C.accent },
    setDotCur: { borderColor: C.accent, borderWidth: 2 },
    setNum: { fontSize: 10, color: C.faint, fontWeight: '600', marginBottom: 3, letterSpacing: 0.5, fontFamily: 'SpaceGrotesk_600SemiBold' },
    setNumDone: { color: C.accentInk, opacity: 0.7 },
    setVal: { fontWeight: '700', fontSize: 15, color: C.text, fontFamily: 'SpaceGrotesk_700Bold' },
    setValDone: { color: C.accentInk },
    actionRow: { flexDirection: 'row', gap: 12 },
    swapBtn: { flexBasis: 132, borderRadius: 22, paddingVertical: 19, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border2 },
    swapText: { fontWeight: '700', fontSize: 17, color: C.text, fontFamily: 'SpaceGrotesk_700Bold' },
    logBtn: { flex: 1, borderRadius: 22, paddingVertical: 19, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: C.accent, shadowColor: C.accent, shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.4, shadowRadius: 18 },
    logText: { fontWeight: '700', fontSize: 17, color: C.accentInk, fontFamily: 'SpaceGrotesk_700Bold' },
    scrim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 60, justifyContent: 'flex-end' },
    sheet: { backgroundColor: C.surface, borderTopLeftRadius: 34, borderTopRightRadius: 34, paddingHorizontal: 22, paddingBottom: 36, shadowColor: '#000', shadowOffset: { width: 0, height: -20 }, shadowOpacity: 0.5, shadowRadius: 40 },
    grab: { width: 42, height: 5, borderRadius: 3, backgroundColor: C.ghost, alignSelf: 'center', marginTop: 12, marginBottom: 16 },
    sheetTitle: { fontWeight: '700', fontSize: 27, color: C.text, fontFamily: 'SpaceGrotesk_700Bold' },
    sheetSub: { fontSize: 13.5, color: C.dim, marginTop: 3, marginBottom: 16, fontFamily: 'SpaceGrotesk_400Regular' },
    swapList: { gap: 10 },
    exRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 13, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 22 },
    exRowBest: { borderColor: C.accent },
    exThumb: { width: 58, height: 58, borderRadius: 16, backgroundColor: C.surface3, alignItems: 'center', justifyContent: 'center' },
    exName: { fontWeight: '700', fontSize: 15.5, color: C.text, fontFamily: 'SpaceGrotesk_700Bold' },
    exType: { color: C.faint, fontSize: 12.5, fontWeight: '600', fontFamily: 'SpaceGrotesk_600SemiBold' },
    bestBadge: { backgroundColor: C.soft, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999 },
    bestBadgeText: { color: C.accent, fontSize: 10, fontWeight: '600', fontFamily: 'SpaceGrotesk_600SemiBold' },
    addBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border2, alignItems: 'center', justifyContent: 'center' },
    addBtnBest: { backgroundColor: C.accent, borderColor: C.accent },
  });
}
