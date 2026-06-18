import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { type Colors } from '@/constants/colors';
import { useColors } from '@/contexts/ThemeContext';
import { IconButton } from '@/components/IconButton';
import { Pill } from '@/components/Pill';
import Svg, { Circle, Path } from 'react-native-svg';

const TILE_H = 240;

function CameraIcon() {
  const C = useColors();
  return (
    <Svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={C.faint} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 8.5A2 2 0 0 1 5 6.5h2l1.4-2h7.2L17 6.5h2a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      <Circle cx={12} cy={13} r={3.6} />
    </Svg>
  );
}
function TargetIcon() {
  const C = useColors();
  return (
    <Svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={12} r={9} /><Circle cx={12} cy={12} r={5} /><Circle cx={12} cy={12} r={1.5} fill={C.accent} stroke="none" />
    </Svg>
  );
}
function BackIcon() {
  const C = useColors();
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><Path d="M15 6l-6 6 6 6" /></Svg>;
}
function StarIcon() {
  const C = useColors();
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill={C.accentInk}><Path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6Z" /></Svg>;
}

export default function CaptureScreen() {
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  // Photos are transient — used only to feed the analyze step, never persisted.
  const [nowUri, setNowUri] = useState<string | null>(null);
  const [dreamUri, setDreamUri] = useState<string | null>(null);

  const pickPhoto = async (which: 'now' | 'dream') => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Please allow photo library access to continue.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      if (which === 'now') setNowUri(uri); else setDreamUri(uri);
    }
  };
  const anim = useRef(new Animated.Value(0)).current;
  const d1 = useRef(new Animated.Value(0)).current;
  const d2 = useRef(new Animated.Value(0)).current;
  const d3 = useRef(new Animated.Value(0)).current;
  const d4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(60, [
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
      Animated.spring(d1,   { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
      Animated.spring(d2,   { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
      Animated.spring(d3,   { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
      Animated.spring(d4,   { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 220 }),
    ]).start();
  }, []);

  const s = (a: Animated.Value) => ({ opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.body}>
        <Animated.View style={[styles.head, s(anim)]}>
          <IconButton onPress={() => router.back()}><BackIcon /></IconButton>
          <Pill label="Step 1 / 4" variant="ghost" />
        </Animated.View>
        <Animated.Text style={[styles.title, s(d1)]}>Two photos.{'\n'}That's it.</Animated.Text>
        <Animated.Text style={[styles.sub, s(d2)]}>Drop where you are — and where you're headed.</Animated.Text>
        <Animated.View style={[styles.tilesRow, s(d3)]}>
          <View style={styles.vsBadge}><Text style={styles.vsText}>VS</Text></View>
          <TouchableOpacity style={styles.tile} activeOpacity={0.85} onPress={() => pickPhoto('now')}>
            <View style={[styles.tilebox, nowUri && styles.tileboxSelected]}>
              {nowUri ? (
                <Image source={{ uri: nowUri }} style={styles.tileImage} />
              ) : (
                <View style={styles.tilePhIcon}><CameraIcon /></View>
              )}
            </View>
            <Text style={styles.tileLabel}>Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tile} activeOpacity={0.85} onPress={() => pickPhoto('dream')}>
            <View style={[styles.tilebox, styles.tileboxGoal]}>
              {dreamUri ? (
                <Image source={{ uri: dreamUri }} style={styles.tileImage} />
              ) : (
                <View style={[styles.tilePhIcon, styles.tilePhGoal]}><TargetIcon /></View>
              )}
            </View>
            <Text style={[styles.tileLabel, { color: C.accent }]}>Dream</Text>
          </TouchableOpacity>
        </Animated.View>
        <View style={{ flex: 1 }} />
        <Animated.View style={s(d4)}>
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!nowUri}
            onPress={() => router.push('/analyze')}
            style={[styles.cta, !nowUri && styles.ctaDisabled]}
          >
            <StarIcon /><Text style={styles.ctaText}>{nowUri ? 'Analyze me' : 'Upload your photo'}</Text>
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
    title: { fontSize: 34, fontWeight: '700', letterSpacing: -1, color: C.text, marginTop: 24, marginBottom: 6, lineHeight: 38, fontFamily: 'SpaceGrotesk_700Bold' },
    sub: { color: C.dim, fontSize: 15, lineHeight: 22, marginBottom: 26, fontFamily: 'SpaceGrotesk_400Regular' },
    tilesRow: { flexDirection: 'row', gap: 14, position: 'relative' },
    tile: { flex: 1, alignItems: 'center', gap: 11 },
    tilebox: { width: '100%', height: TILE_H, borderRadius: 26, borderWidth: 2, borderStyle: 'dashed', borderColor: C.border2, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    tileboxSelected: { borderStyle: 'solid', borderColor: C.accent },
    tileboxGoal: { borderStyle: 'solid', borderColor: C.accent },
    tilePhIcon: { width: 62, height: 62, borderRadius: 20, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' },
    tileImage: { width: '100%', height: '100%', borderRadius: 24 },
    tilePhGoal: { backgroundColor: C.soft },
    tileLabel: { fontWeight: '700', fontSize: 15, color: C.text, fontFamily: 'SpaceGrotesk_700Bold' },
    vsBadge: { position: 'absolute', left: '50%', top: TILE_H / 2, zIndex: 3, width: 42, height: 42, borderRadius: 21, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', marginLeft: -21, marginTop: -21, borderWidth: 4, borderColor: C.screen },
    vsText: { fontWeight: '700', fontSize: 13, color: C.accentInk, fontFamily: 'SpaceGrotesk_700Bold' },
    cta: { width: '100%', borderRadius: 22, paddingVertical: 19, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: C.accent, shadowColor: C.accent, shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.4, shadowRadius: 20 },
    ctaDisabled: { backgroundColor: C.surface2, shadowOpacity: 0 },
    ctaText: { fontWeight: '700', fontSize: 17, color: C.accentInk, fontFamily: 'SpaceGrotesk_700Bold' },
  });
}
