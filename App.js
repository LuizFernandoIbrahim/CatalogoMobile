import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, Text } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import AuthScreen from './src/screens/AuthScreen';
import CatalogScreen from './src/screens/CatalogScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import MapScreen from './src/screens/MapScreen';
import AdminScreen from './src/screens/AdminScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { getDatabase } from './src/database/banco';
import { getCurrentUser } from './src/database/clientes';
import { FONT, vScale } from './src/utils/responsive';

const Tab = createBottomTabNavigator();
const CatalogStack = createStackNavigator();

const TAB_ICONS = {
  'Catálogo': '≡',
  'Mapa': '◎',
  'Admin': '⚙',
  'Perfil': '⌗',
};

function toBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.trim().toLowerCase() === 'true';
  if (typeof value === 'number') return value === 1;
  return false;
}

function CatalogStackScreen() {
  return (
    <CatalogStack.Navigator screenOptions={{ headerShown: false }}>
      <CatalogStack.Screen name="CatalogHome" component={CatalogScreen} />
      <CatalogStack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </CatalogStack.Navigator>
  );
}

function AppTabs({ user, onLogout }) {
  const insets = useSafeAreaInsets();
  const TAB_BAR_BASE_HEIGHT = 56;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: route.name !== 'Catálogo',
        headerStyle: {
          backgroundColor: '#402105',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: FONT.lg,
        },
        tabBarIcon: ({ focused }) => {
          const icon = TAB_ICONS[route.name] || '●';
          return (
            <Text style={{
              fontSize: 22,
              color: focused ? '#402105' : '#9ca3af',
              fontWeight: 'bold',
            }}>
              {icon}
            </Text>
          );
        },
        tabBarActiveTintColor: '#402105',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
            backgroundColor: '#ffffff',
            height: TAB_BAR_BASE_HEIGHT + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
            paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: FONT.xs,
          fontWeight: '600',
          marginBottom: 4,
        }
      })}
    >
      <Tab.Screen name="Catálogo" component={CatalogStackScreen} />
      <Tab.Screen name="Mapa" component={MapScreen} />

      {user?.isAdmin && (
        <Tab.Screen name="Admin" component={AdminScreen} />
      )}

      <Tab.Screen name="Perfil">
        {() => <ProfileScreen user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#402105" translucent={false} />
      <Main />
    </SafeAreaProvider>
  );
}

function Main() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        await getDatabase();
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a0d02' }}>
        <ActivityIndicator size="large" color="#402105" />
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