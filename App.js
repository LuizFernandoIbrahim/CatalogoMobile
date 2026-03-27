import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, ActivityIndicator, View, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import AuthScreen from './src/screens/AuthScreen';
import CatalogScreen from './src/screens/CatalogScreen';
import MapScreen from './src/screens/MapScreen';
import AdminScreen from './src/screens/AdminScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { getCurrentUser } from './src/utils/storage';
import { FONT, vScale } from './src/utils/responsive';

const Tab = createBottomTabNavigator();

const ICONS = {
  'Catálogo': '🛍️',
  'Mapa': '📍',
  'Admin': '⚙️',
  'Perfil': '👤',
};
const STORAGE_VERSION = '2';

function toBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.trim().toLowerCase() === 'true';
  if (typeof value === 'number') return value === 1;
  return false;
}

function AppTabs({ user, onLogout }) {
  const insets = useSafeAreaInsets();

  const TAB_HEIGHT = vScale(56) + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: FONT.xl, opacity: focused ? 1 : 0.55 }}>
            {ICONS[route.name] || '❓'}
          </Text>
        ),
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: {
          fontSize: FONT.xs,
          fontWeight: '600',
          marginBottom: insets.bottom > 0 ? 0 : vScale(4),
        },
        tabBarStyle: {
          height: TAB_HEIGHT,
          paddingBottom: insets.bottom > 0 ? insets.bottom : vScale(6),
          paddingTop: vScale(6),
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          elevation: 12,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
        },
        headerStyle: { backgroundColor: '#4f46e5' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '700', fontSize: FONT.lg },
      })}
    >
      <Tab.Screen name="Catálogo" component={CatalogScreen} />
      <Tab.Screen name="Mapa" component={MapScreen} />
      {user.isAdmin === true ? (
        <Tab.Screen name="Admin" component={AdminScreen} />
      ) : null}
      <Tab.Screen name="Perfil">
        {() => <ProfileScreen user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function Main() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const version = await AsyncStorage.getItem('@storage_version');
        if (version !== STORAGE_VERSION) {
          await AsyncStorage.clear();
          await AsyncStorage.setItem('@storage_version', STORAGE_VERSION);
        }
        const data = await getCurrentUser();
        if (data) {
          setUser({ ...data, isAdmin: toBoolean(data.isAdmin) });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (!user) {
    return (
      <AuthScreen
        onLogin={(loggedUser) =>
          setUser({ ...loggedUser, isAdmin: toBoolean(loggedUser.isAdmin) })
        }
      />
    );
  }

  return (
    <NavigationContainer>
      <AppTabs user={user} onLogout={() => setUser(null)} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Main />
    </SafeAreaProvider>
  );
}