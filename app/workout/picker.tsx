import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '@/constants/colors';
import { IconButton } from '@/components/IconButton';
import { Pill } from '@/components/Pill';
import Svg, { Path } from 'react-native-svg';

function BackIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15 6l-6 6 6 6" />
    </Svg>
  );
}

function CheckIcon({ size = 15 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.accentInk} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12.5 10 17l9-10" />
    </Svg>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  const color = active ? C.accentInk : C.text;
  return (
    <Svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 10.5 12 3l9 7.5" />
      <Path d="M5 9.5V21h14V9.5" />
      <Path d="M9.5 21v-6h5v6" />
    </Svg>
  );
}

function GymIcon({ active }: { active: boolean }) {
  const color = active ? C.accentInk : C.text;
  return (
    <Svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6.5 6.5l11 11" />
      <Path d="M4 9 9 4l2 2-5 5z" />
      <Path d="M20 15l-5 5-2-2 5-5z" />
      <Path d="M2.5 11.5 4 13M11 20l1.5 1.5" />
    </Svg>
  );
}

function BoltIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill={C.accentInk}>
      <Path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </Svg>
  );
}

export default function PickerScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<'home' | 'gym'>('home');

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
          <Pill label="Push day" variant="ghost" />
        </Animated.View>

        <Animated.Text style={[styles.title, s(d1)]}>Where are you?</Animated.Text>
        <Animated.Text style={[styles.sub, s(d2)]}>Tap one — we'll set up your moves.</Animated.Text>

        <Animated.View style={[styles.choicesRow, s(d3)]}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.choice, selected === 'home' && styles.choiceSel]}
            onPress={() => setSelected('home')}
          >
            {selected === 'home' && (
              <View style={styles.checkBadge}>
                <CheckIcon />
              </View>
            )}
            <View style={[styles.choiceIcon, selected === 'home' && styles.choiceIconSel]}>
              <HomeIcon active={selected === 'home'} />
            </View>
            <Text style={styles.choiceName}>Home</Text>
            <Text style={styles.choiceMeta}>Bands & dumbbells</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.choice, selected === 'gym' && styles.choiceSel]}
            onPress={() => setSelected('gym')}
          >
            {selected === 'gym' && (
              <View style={styles.checkBadge}>
                <CheckIcon />
              </View>
            )}
            <View style={[styles.choiceIcon, selected === 'gym' && styles.choiceIconSel]}>
              <GymIcon active={selected === 'gym'} />
            </View>
            <Text style={styles.choiceName}>Gym</Text>
            <Text style={styles.choiceMeta}>Full equipment</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[{ marginTop: 24 }, s(d4)]}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/workout/session')} style={styles.cta}>
            <BoltIcon />
            <Text style={styles.ctaText}>Start Push Day</Text>
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
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -1, color: C.text, marginTop: 30, marginBottom: 4, textAlign: 'center', fontFamily: 'SpaceGrotesk_700Bold' },
  sub: { color: C.dim, fontSize: 15, lineHeight: 22, marginBottom: 28, textAlign: 'center', fontFamily: 'SpaceGrotesk_400Regular' },
  choicesRow: { flexDirection: 'row', gap: 14, flex: 1, maxHeight: 380 },
  choice: {
    flex: 1,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: C.border,
    backgroundColor: C.surface,
    alignItems: 'center',
    gap: 16,
    paddingVertical: 30,
    paddingHorizontal: 18,
    position: 'relative',
  },
  choiceSel: { borderColor: C.accent, backgroundColor: C.soft },
  checkBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceIcon: {
    width: 78,
    height: 78,
    borderRadius: 24,
    backgroundColor: C.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceIconSel: { backgroundColor: C.accent },
  choiceName: { fontWeight: '700', fontSize: 23, color: C.text, fontFamily: 'SpaceGrotesk_700Bold' },
  choiceMeta: { fontSize: 12.5, color: C.faint, fontWeight: '600', fontFamily: 'SpaceGrotesk_600SemiBold' },
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
