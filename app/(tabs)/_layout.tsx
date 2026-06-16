import { Tabs, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type Colors } from '@/constants/colors';
import { useColors } from '@/contexts/ThemeContext';
import Svg, { Circle, Path } from 'react-native-svg';

function HomeIcon({ active }: { active: boolean }) {
  const C = useColors();
  const color = active ? C.text : C.faint;
  return (
    <Svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 10.5 12 3l9 7.5" /><Path d="M5 9.5V21h14V9.5" /><Path d="M9.5 21v-6h5v6" />
    </Svg>
  );
}
function PlanIcon({ active }: { active: boolean }) {
  const C = useColors();
  const color = active ? C.text : C.faint;
  return <Svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><Path d="M5 21V4M5 4h11l-2 3.5L16 11H5" /></Svg>;
}
function BoltIcon() {
  const C = useColors();
  return <Svg width={28} height={28} viewBox="0 0 24 24" fill={C.accentInk}><Path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></Svg>;
}
function FuelIcon({ active }: { active: boolean }) {
  const C = useColors();
  const color = active ? C.text : C.faint;
  return <Svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><Path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></Svg>;
}
function YouIcon({ active }: { active: boolean }) {
  const C = useColors();
  const color = active ? C.text : C.faint;
  return (
    <Svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={8} r={4} /><Path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </Svg>
  );
}

function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  const tabs = [
    { name: 'dashboard', icon: HomeIcon, label: 'Home' },
    { name: 'plan',      icon: PlanIcon, label: 'Plan' },
    { name: '__fab__',   icon: null,     label: '' },
    { name: 'fuel',      icon: FuelIcon, label: 'Fuel' },
    { name: 'you',       icon: YouIcon,  label: 'You' },
  ];

  const routeNames = state.routes.map((r: any) => r.name);

  return (
    <View style={[styles.tabbar, { paddingBottom: insets.bottom }]}>
      {tabs.map((tab) => {
        if (tab.name === '__fab__') {
          return (
            <TouchableOpacity key="fab" style={styles.fabWrap} activeOpacity={0.85} onPress={() => router.push('/workout/picker')}>
              <View style={styles.fabRound}><BoltIcon /></View>
            </TouchableOpacity>
          );
        }
        const routeIndex = routeNames.indexOf(tab.name);
        const isActive = state.index === routeIndex;
        const Icon = tab.icon!;
        return (
          <TouchableOpacity key={tab.name} style={styles.tab} activeOpacity={0.8} onPress={() => { if (!isActive) navigation.navigate(tab.name); }}>
            <Icon active={isActive} />
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
            <View style={[styles.tabDot, isActive && styles.tabDotActive]} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function makeStyles(C: Colors) {
  return StyleSheet.create({
    tabbar: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', backgroundColor: 'transparent', paddingTop: 12, paddingHorizontal: 26, position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 35 },
    tab: { flex: 1, alignItems: 'center', gap: 5, paddingVertical: 6, paddingHorizontal: 4 },
    tabLabel: { fontSize: 10, fontWeight: '600', color: C.faint, fontFamily: 'SpaceGrotesk_600SemiBold' },
    tabLabelActive: { color: C.text },
    tabDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.accent, opacity: 0, marginTop: 1 },
    tabDotActive: { opacity: 1 },
    fabWrap: { alignItems: 'center', justifyContent: 'center', marginTop: -26 },
    fabRound: { width: 74, height: 74, borderRadius: 37, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', shadowColor: C.accent, shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.5, shadowRadius: 16 },
  });
}

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false, animation: 'shift' }}>
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="plan" />
      <Tabs.Screen name="fuel" />
      <Tabs.Screen name="you" />
    </Tabs>
  );
}
