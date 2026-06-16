import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '@/constants/colors';
import Svg, { Path } from 'react-native-svg';
import ModelViewer from '@/components/ModelViewer';

const { height } = Dimensions.get('window');

function ArrowRight() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.accentInk} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  );
}

export default function SplashScreen() {
  const router = useRouter();

  const kickAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subAnim = useRef(new Animated.Value(0)).current;
  const ctaAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(90, [
      Animated.spring(kickAnim, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 200 }),
      Animated.spring(titleAnim, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 200 }),
      Animated.spring(subAnim, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 200 }),
      Animated.spring(ctaAnim, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 200 }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 1200, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    ).start();
  }, []);

  const makeStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
  });

  return (
    <View style={styles.container}>
      {/* 3D body */}
      <ModelViewer style={styles.model} />

      {/* Bottom gradient + content */}
      <LinearGradient
        colors={['transparent', C.screen, C.screen]}
        locations={[0, 0.4, 1]}
        style={styles.gradient}
      >
        <SafeAreaView edges={['bottom']} style={styles.bottom}>
          <Animated.Text style={[styles.kick, makeStyle(kickAnim)]}>
            Your body · your blueprint
          </Animated.Text>

          <Animated.Text style={[styles.title, makeStyle(titleAnim)]}>
            APEX
          </Animated.Text>

          <Animated.Text style={[styles.sub, makeStyle(subAnim)]}>
            See the body you're building.{'\n'}Watch it fill in, rep by rep.
          </Animated.Text>

          <Animated.View
            style={[
              { width: '100%', maxWidth: 280 },
              makeStyle(ctaAnim),
              { transform: [{ translateY: ctaAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }, { scale: pulseAnim }] },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push('/auth')}
              style={styles.cta}
            >
              <Text style={styles.ctaText}>Start</Text>
              <ArrowRight />
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.screen,
  },
  model: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.55,
    zIndex: 2,
    justifyContent: 'flex-end',
  },
  bottom: {
    alignItems: 'center',
    paddingHorizontal: 26,
    paddingBottom: 46,
  },
  kick: {
    fontSize: 11.5,
    fontWeight: '600',
    letterSpacing: 2.1,
    textTransform: 'uppercase',
    color: C.faint,
    marginBottom: 14,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  title: {
    fontSize: 72,
    fontWeight: '700',
    letterSpacing: -3.6,
    color: C.text,
    fontFamily: 'SpaceGrotesk_700Bold',
    lineHeight: 72,
  },
  sub: {
    marginTop: 14,
    marginBottom: 30,
    maxWidth: 240,
    color: C.dim,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: 'SpaceGrotesk_400Regular',
  },
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
    shadowOpacity: 0.45,
    shadowRadius: 20,
  },
  ctaText: {
    fontWeight: '700',
    fontSize: 17,
    color: C.accentInk,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
});
