import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Importação da StatusBar do Expo
import { StatusBar } from 'expo-status-bar';

// Importação do pacote de ícones do Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

// Objeto de ícones atualizado para mapear as strings do MaterialCommunityIcons
const ICONS = {
  'Catálogo': 'storefront-outline',
  'Mapa': 'map-marker-radius-outline',
  'Admin': 'store-cog-outline',
  'Perfil': 'account-circle-outline',
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
      <CatalogStack.Screen name="CatalogList" component={CatalogScreen} />
      <CatalogStack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </CatalogStack.Navigator>
  );
}

function AppTabs({ user, onLogout }) {
  const insets = useSafeAreaInsets();
  const TAB_HEIGHT = vScale(56) + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Usando o color que o próprio navigator passa dinamicamente (ativo/inativo)
        tabBarIcon: ({ color }) => {
          const iconName = ICONS[route.name] || 'help-circle-outline';
          return (
            <MaterialCommunityIcons 
              name={iconName} 
              size={vScale(22)} 
              color={color} 
            />
          );
        },
        tabBarActiveTintColor: '#402105', // Mudado para combinar com a identidade do seu header/banner
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
        headerStyle: { backgroundColor: '#402105' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '700', fontSize: FONT.lg },
      })}
    >
      <Tab.Screen
        name="Catálogo"
        component={CatalogStackScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Mapa" component={MapScreen} />
      <Tab.Screen
        name="Admin"
        component={AdminScreen}
        options={{
          tabBarItemStyle: { display: user.isAdmin === true ? 'flex' : 'none' },
          tabBarButton: user.isAdmin === true ? undefined : () => null,
        }}
      />
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

export default function App() {
  return (
    <SafeAreaProvider>
      {/* O estilo 'light' força os textos (relógio, notificações) a ficarem brancos */}
      <StatusBar style="light" />
      
      <Main />
    </SafeAreaProvider>
  );
}