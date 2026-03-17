import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../style/colors';
import { typography } from '../style/typography';

const NAV_ITEMS = [
  { icon: 'home',           label: 'Início',    screen: 'Home'  },
  { icon: 'grid-outline',   label: 'Catálogo',  screen: null    },
  { icon: 'heart-outline',  label: 'Favoritos', screen: null    },
  { icon: 'location-sharp', label: 'Loja',      screen: 'Store' },
];

export default function BottomNavBar({ navigation, activeScreen }) {
  return (
    <View style={styles.bottomNav}>
      {NAV_ITEMS.map((item) => {
        const isActive = item.screen === activeScreen;
        return (
          <TouchableOpacity
            key={item.label}
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => {
              if (item.screen && item.screen !== activeScreen) {
                navigation.navigate(item.screen);
              }
            }}
          >
            <Ionicons
              name={item.icon}
              size={22}
              color={isActive ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    height: 62,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  navLabel: {
    fontFamily: typography.fonts.body,
    fontSize: 10,
    color: colors.textMuted,
  },
  navLabelActive: {
    color: colors.primary,
  },
});
