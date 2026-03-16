import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from './CartContext';
import { colors} from '../style/colors';
import { typography } from '../style/typography';

export default function CartIcon({ onPress, color = '#FFF' }) {
  const { totalItems } = useCart();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (totalItems > 0) {
      Animated.sequence([
        Animated.spring(scaleAnim, { toValue: 1.4, useNativeDriver: true, speed: 30 }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20 }),
      ]).start();
    }
  }, [totalItems]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.75}>
      <Ionicons name="bag-outline" size={24} color={color} />
      {totalItems > 0 && (
        <Animated.View style={[styles.badge, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.badgeText}>{totalItems > 99 ? '99+' : totalItems}</Text>
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: colors.primaryDark,
  },
  badgeText: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: 9,
    color: colors.textPrimary,
    lineHeight: 12,
  },
});
