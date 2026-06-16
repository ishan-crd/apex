import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '@/constants/colors';
import { IconButton } from '@/components/IconButton';
import { Pill } from '@/components/Pill';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
// square cards: full width minus horizontal padding (22×2) and gap (12), divided by 2
const CARD_SIZE = Math.floor((width - 44 - 12) / 2);

function BackIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15 6l-6 6 6 6" />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.accentInk} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12.5 10 17l9-10" />
    </Svg>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  const color = active ? C.accentInk : C.faint;
  return (
    <Svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 10.5 12 3l9 7.5" />
      <Path d="M5 9.5V21h14V9.5" />
      <Path d="M9.5 21v-6h5v6" />
    </Svg>
  );
}

function DumbbellIcon({ active }: { active: boolean }) {
  const color = active ? C.accentInk : C.faint;
  return (
    <Svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {/* bar */}
      <Path d="M6.5 12h11" />
      {/* left plates */}
      <Path d="M6.5 8.5v7" />
      <Path d="M4.5 10v4" />
      {/* right plates */}
      <Path d="M17.5 8.5v7" />
      <Path d="M19.5 10v4" />
    </Svg>
  );
}

function BoltIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill={C.accentInk}>
      <Path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </Svg>
  );
}

export default function PickerScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<'home' | 'gym'>('home');

  const headAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const cardsAnim = useRef(new Animated.Value(0)).current;
  const ctaAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(70, [
      Animated.spring(headAnim,  { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
      Animated.spring(titleAnim, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
      Animated.spring(cardsAnim, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
      Animated.spring(ctaAnim,   { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
    ]).start();
  }, []);

  const s = (a: Animated.Value) => ({
    opacity: a,
    transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }],
  });

  const options = [
    { id: 'home' as const, label: 'Home',  meta: 'Bands & dumbbells', Icon: HomeIcon },
    { id: 'gym'  as const, label: 'Gym',   meta: 'Full equipment',    Icon: DumbbellIcon },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.body}>

        {/* Header */}
        <Animated.View style={[styles.head, s(headAnim)]}>
          <IconButton onPress={() => router.back()}>
            <BackIcon />
          </IconButton>
          <Pill label="Push day" variant="ghost" />
        </Animated.View>

        {/* Title */}
        <Animated.View style={[styles.titleBlock, s(titleAnim)]}>
          <Text style={styles.title}>Where are you?</Text>
          <Text style={styles.sub}>Tap one — we'll set up your moves.</Text>
        </Animated.View>

        {/* Cards */}
        <Animated.View style={[styles.cardsRow, s(cardsAnim)]}>
          {options.map(({ id, label, meta, Icon }) => {
            const active = selected === id;
            return (
              <TouchableOpacity
                key={id}
                activeOpacity={0.88}
                onPress={() => setSelected(id)}
                style={[styles.card, active && styles.cardActive]}
              >
                {/* Check badge */}
                {active && (
                  <View style={styles.checkBadge}>
                    <CheckIcon />
                  </View>
                )}

                {/* Icon container */}
                <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                  <Icon active={active} />
                </View>

                {/* Labels */}
                <View style={styles.cardLabels}>
                  <Text style={[styles.cardName, active && styles.cardNameActive]}>
                    {label}
                  </Text>
                  <Text style={styles.cardMeta}>{meta}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        <View style={{ flex: 1 }} />

        {/* CTA */}
        <Animated.View style={s(ctaAnim)}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/workout/session')}
            style={styles.cta}
          >
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
  body: { flex: 1, paddingHorizontal: 22, paddingTop: 8, paddingBottom: 28 },

  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  titleBlock: { marginBottom: 24, paddingHorizontal: 4 },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -1.1,
    color: C.text,
    fontFamily: 'SpaceGrotesk_700Bold',
    marginBottom: 6,
  },
  sub: {
    color: C.dim,
    fontSize: 15,
    lineHeight: 21,
    fontFamily: 'SpaceGrotesk_400Regular',
  },

  // Cards
  cardsRow: { flexDirection: 'row', gap: 12 },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  cardActive: {
    borderColor: C.accent,
    borderWidth: 2,
    backgroundColor: 'rgba(0,224,164,0.07)',
  },

  checkBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWrap: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: C.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: C.accent,
  },

  cardLabels: { alignItems: 'center', gap: 5 },
  cardName: {
    fontSize: 20,
    fontWeight: '700',
    color: C.text,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  cardNameActive: { color: C.text },
  cardMeta: {
    fontSize: 12,
    fontWeight: '600',
    color: C.faint,
    fontFamily: 'SpaceGrotesk_600SemiBold',
    textAlign: 'center',
  },

  // CTA
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
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  ctaText: {
    fontWeight: '700',
    fontSize: 17,
    color: C.accentInk,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
});
