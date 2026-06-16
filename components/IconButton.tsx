import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { type Colors } from '@/constants/colors';
import { useColors } from '@/contexts/ThemeContext';

interface IconButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
}

export function IconButton({ onPress, children }: IconButtonProps) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.btn}>
      {children}
    </TouchableOpacity>
  );
}

function makeStyles(C: Colors) {
  return StyleSheet.create({
    btn: {
      width: 46, height: 46, borderRadius: 15,
      backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
      alignItems: 'center', justifyContent: 'center',
    },
  });
}
