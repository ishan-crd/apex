import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as AppleAuthentication from 'expo-apple-authentication';
// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
// WebBrowser.maybeCompleteAuthSession();
import { type Colors } from '@/constants/colors';
import { useColors } from '@/contexts/ThemeContext';
import Svg, { Path } from 'react-native-svg';

const { height } = Dimensions.get('window');

function AppleLogo() {
  return (
    <Svg width={18} height={22} viewBox="0 0 814 1000" fill="#0B0C0F">
      <Path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 331.3 160.3 124.8 223 66.7c59.2-54.9 136.5-91.5 220.5-91.5 84.1 0 143.8 43.2 192.1 43.2 48.3 0 123.9-48.9 192.6-48.9 31.2 0 104.4 11.6 145.5 50.3zm-203.9-141C621.4 68.4 681.4 0 681.4 0c-64.5 7-142 45.1-189.3 96.9-42.9 47.3-88.8 123.4-88.8 199.5 0 7.5 1.4 15 1.9 17.6 4.4.6 11.4 1.6 18.9 1.6 70.8 0 152-38.2 193.3-115.7z" />
    </Svg>
  );
}

function GoogleLogo() {
  return (
    <Svg width={20} height={20} viewBox="0 0 48 48">
      <Path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.9 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.5 13.3l7.9 6.1C12.3 13.3 17.7 9.5 24 9.5z" />
      <Path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.9 7.2l7.6 5.9c4.5-4.1 7.1-10.2 7.1-17.1z" />
      <Path fill="#FBBC05" d="M10.4 28.6A14.8 14.8 0 0 1 9.5 24c0-1.6.3-3.2.9-4.6l-7.9-6.1A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.8l7.9-6.2z" />
      <Path fill="#34A853" d="M24 48c6.3 0 11.6-2.1 15.5-5.7l-7.6-5.9c-2.1 1.4-4.8 2.2-7.9 2.2-6.3 0-11.7-3.8-13.6-9.4l-7.9 6.2C6.6 42.6 14.6 48 24 48z" />
    </Svg>
  );
}

export default function AuthScreen() {
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const [loadingApple, setLoadingApple] = useState(false);

  const logoAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const btnsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.spring(logoAnim, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 180 }),
      Animated.spring(cardAnim, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 180 }),
      Animated.spring(btnsAnim, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 180 }),
    ]).start();
  }, []);

  const fadeUp = (a: Animated.Value) => ({
    opacity: a,
    transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
  });

  const handleGoogle = () => { router.replace('/capture'); };

  const handleApple = async () => {
    setLoadingApple(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });
      console.log('Apple user:', credential.user);
      router.replace('/capture');
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') Alert.alert('Sign in failed', 'Please try again.');
    } finally {
      setLoadingApple(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.aura} />
      <View style={styles.figWrap}><View style={styles.figSilhouette} /></View>
      <LinearGradient colors={['transparent', 'rgba(11,12,15,0.82)', C.screen]} locations={[0, 0.32, 0.62]} style={styles.gradient}>
        <SafeAreaView edges={['bottom']} style={styles.inner}>
          <Animated.View style={[styles.headBlock, fadeUp(logoAnim)]}>
            <Text style={styles.logo}>APEX</Text>
            <Text style={styles.headline}>Your transformation{'\n'}starts here.</Text>
          </Animated.View>
          <Animated.View style={[styles.dividerRow, fadeUp(cardAnim)]}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>sign in to continue</Text>
            <View style={styles.dividerLine} />
          </Animated.View>
          <Animated.View style={[styles.btnStack, fadeUp(btnsAnim)]}>
            <TouchableOpacity activeOpacity={0.88} onPress={handleApple} disabled={loadingApple} style={styles.appleBtn}>
              {loadingApple ? <ActivityIndicator color="#0B0C0F" size="small" /> : <><AppleLogo /><Text style={styles.appleBtnText}>Continue with Apple</Text></>}
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.88} onPress={handleGoogle} disabled={loadingApple} style={styles.googleBtn}>
              <GoogleLogo /><Text style={styles.googleBtnText}>Continue with Google</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.Text style={[styles.terms, fadeUp(btnsAnim)]}>
            By continuing you agree to our <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
          </Animated.Text>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

function makeStyles(C: Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.screen },
    aura: { position: 'absolute', left: '50%', top: '28%', width: 380, height: 380, marginLeft: -190, marginTop: -190, borderRadius: 190, backgroundColor: C.soft, zIndex: 0 },
    figWrap: { position: 'absolute', left: 0, right: 0, top: 60, bottom: 240, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
    figSilhouette: { width: 160, height: '82%', borderRadius: 80, backgroundColor: C.surface2, opacity: 0.5 },
    gradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: height * 0.72, zIndex: 2, justifyContent: 'flex-end' },
    inner: { paddingHorizontal: 24, paddingBottom: 36 },
    headBlock: { marginBottom: 28 },
    logo: { fontSize: 13, fontWeight: '700', letterSpacing: 4, color: C.accent, fontFamily: 'SpaceGrotesk_700Bold', marginBottom: 10 },
    headline: { fontSize: 34, fontWeight: '700', color: C.text, letterSpacing: -1.2, lineHeight: 40, fontFamily: 'SpaceGrotesk_700Bold' },
    dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 22 },
    dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
    dividerText: { fontSize: 11, fontWeight: '600', letterSpacing: 1.8, textTransform: 'uppercase', color: C.faint, fontFamily: 'SpaceGrotesk_600SemiBold' },
    btnStack: { gap: 12, marginBottom: 20 },
    appleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 11, paddingVertical: 17, borderRadius: 18, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.18, shadowRadius: 14 },
    appleBtnText: { fontSize: 16, fontWeight: '700', color: '#0B0C0F', fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: -0.3 },
    googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 11, paddingVertical: 17, borderRadius: 18, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border2 },
    googleBtnText: { fontSize: 16, fontWeight: '600', color: C.text, fontFamily: 'SpaceGrotesk_600SemiBold', letterSpacing: -0.3 },
    terms: { fontSize: 12, color: C.faint, textAlign: 'center', lineHeight: 18, fontFamily: 'SpaceGrotesk_400Regular' },
    termsLink: { color: C.dim, textDecorationLine: 'underline' },
  });
}
