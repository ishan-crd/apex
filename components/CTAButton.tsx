import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { C } from '@/constants/colors';

type Variant = 'solid' | 'ghost' | 'dark';

interface CTAButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconLeft?: React.ReactNode;
  disabled?: boolean;
}

export function CTAButton({ label, onPress, variant = 'solid', style, textStyle, icon, iconLeft, disabled }: CTAButtonProps) {
  const bg = variant === 'ghost' ? C.surface2 : variant === 'dark' ? C.text : C.accent;
  const color = variant === 'ghost' ? C.text : variant === 'dark' ? C.screen : C.accentInk;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.btn,
        { backgroundColor: bg },
        variant === 'ghost' && styles.ghostBorder,
        style,
      ]}
    >
      {iconLeft && iconLeft}
      <Text style={[styles.label, { color }, textStyle]}>{label}</Text>
      {icon && icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    borderRadius: 22,
    paddingVertical: 19,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ghostBorder: {
    borderWidth: 1,
    borderColor: C.border2,
  },
  label: {
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.1,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
});
