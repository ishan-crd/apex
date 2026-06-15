import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '@/constants/colors';

interface IconButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
}

export function IconButton({ onPress, children }: IconButtonProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.btn}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
