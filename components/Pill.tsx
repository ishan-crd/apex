import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '@/constants/colors';

type PillVariant = 'accent' | 'ghost' | 'solid';

interface PillProps {
  label: string;
  variant?: PillVariant;
  icon?: React.ReactNode;
  style?: object;
}

export function Pill({ label, variant = 'ghost', icon, style }: PillProps) {
  const bg = variant === 'accent' ? C.soft : variant === 'solid' ? C.accent : C.surface2;
  const color = variant === 'accent' ? C.accent : variant === 'solid' ? C.accentInk : C.dim;

  return (
    <View style={[styles.pill, { backgroundColor: bg }, variant === 'ghost' && styles.ghostBorder, style]}>
      {icon && icon}
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 999,
  },
  ghostBorder: {
    borderWidth: 1,
    borderColor: C.border,
  },
  label: {
    fontWeight: '600',
    fontSize: 13,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
});
