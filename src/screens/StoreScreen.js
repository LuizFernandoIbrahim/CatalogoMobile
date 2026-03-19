import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Linking,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients } from '../style/colors';
import { typography } from '../style/typography';
import CartIcon from '../components/CartIcon';
import BottomNavBar from '../components/BottomNavBar';
import { STORE, HOURS, isOpenNow } from '../data/store';
import styles from '../style/styles';

function openMaps() {
  const query = encodeURIComponent(`${STORE.address}, ${STORE.area}`);
  const url = Platform.select({
    ios:     `maps:0,0?q=${query}`,
    android: `geo:0,0?q=${query}`,
  });
  Linking.canOpenURL(url).then((ok) => {
    if (ok) Linking.openURL(url);
    else Linking.openURL(`https://maps.google.com/?q=${query}`);
  });
}

function openWhatsApp() {
  const msg = encodeURIComponent('Olá! Vi o catálogo da Oficina de Marias e gostaria de saber mais 🧵');
  Linking.openURL(`whatsapp://send?phone=${STORE.whatsapp}&text=${msg}`).catch(() =>
    Alert.alert('Atenção', 'WhatsApp não encontrado neste dispositivo.')
  );
}

function openPhone() {
  Linking.openURL(`tel:${STORE.phone}`);
}

function openEmail() {
  Linking.openURL(`mailto:${STORE.email}`);
}

export default function StoreScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Calculado dentro do componente para refletir hora real na renderização
  const todayIndex = new Date().getDay();
  const isOpen     = isOpenNow();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <LinearGradient colors={gradients.terracota} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Nossa Loja</Text>
            <Text style={styles.headerSubtitle}>Vassouras — RJ</Text>
          </View>
          <CartIcon onPress={() => navigation.navigate('Cart')} />
        </View>
      </LinearGradient>

      <Animated.ScrollView
        style={[styles.scroll, { opacity: fadeAnim }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        overScrollMode="never"
        bounces
      >
        {/* Mapa interativo */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude:       STORE.coords.latitude,
              longitude:      STORE.coords.longitude,
              latitudeDelta:  0.004,
              longitudeDelta: 0.004,
            }}
            showsUserLocation
            showsMyLocationButton={false}
            showsCompass={false}
            rotateEnabled={false}
          >
            <Marker
              coordinate={STORE.coords}
              title={STORE.name}
              description={STORE.address}
              pinColor={colors.primary}
            />
          </MapView>

          <View style={styles.mapOverlayPin}>
            <Ionicons name="location-sharp" size={12} color="#FFF" />
            <Text style={styles.mapOverlayText}>Oficina de Marias</Text>
          </View>
        </View>

        {/* Card de endereço */}
        <View style={styles.addressCard}>
          <Text style={styles.addressTitle}>Endereço</Text>

          <View style={styles.addressRow}>
            <View style={styles.addressIconBox}>
              <Ionicons name="location-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.addressTextBlock}>
              <Text style={styles.addressLabel}>LOGRADOURO</Text>
              <Text style={styles.addressValue}>
                {STORE.address}{'\n'}{STORE.area}{'\n'}{STORE.cep}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.directionsBtn}
            onPress={openMaps}
            activeOpacity={0.88}
          >
            <LinearGradient colors={gradients.terracota} style={styles.directionsBtnGradient}>
              <Ionicons name="navigate-outline" size={18} color="#FFF" />
              <Text style={styles.directionsBtnText}>Como chegar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Card de horários */}
        <View style={styles.hoursCard}>
          <View style={styles.hoursHeader}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={styles.hoursTitle}>Horários</Text>
            <View style={[
              styles.statusBadge,
              isOpen ? styles.statusBadgeOpen : styles.statusBadgeClosed,
            ]}>
              <Text style={[
                styles.statusText,
                isOpen ? styles.statusTextOpen : styles.statusTextClosed,
              ]}>
                {isOpen ? '● Aberto' : '● Fechado'}
              </Text>
            </View>
          </View>

          {HOURS.map((item, idx) => {
            const isToday = item.dayIndex === todayIndex;
            const isLast  = idx === HOURS.length - 1;
            return (
              <View
                key={item.day}
                style={[styles.hoursRow, isLast && styles.hoursRowLast]}
              >
                <Text style={isToday ? styles.hoursDayToday : styles.hoursDay}>
                  {item.day}{isToday ? ' (hoje)' : ''}
                </Text>
                {item.open ? (
                  <Text style={styles.hoursTime}>
                    {item.open} – {item.close}
                  </Text>
                ) : (
                  <Text style={styles.hoursTimeClosed}>Fechado</Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Card de contato */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Contato</Text>

          <TouchableOpacity style={styles.contactBtn} onPress={openWhatsApp} activeOpacity={0.75}>
            <View style={[styles.contactBtnIcon, { backgroundColor: '#E8F5EC' }]}>
              <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
            </View>
            <View>
              <Text style={styles.contactBtnLabel}>WHATSAPP</Text>
              <Text style={styles.contactBtnValue}>{STORE.phone}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} style={styles.contactChevron} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactBtn} onPress={openPhone} activeOpacity={0.75}>
            <View style={[styles.contactBtnIcon, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="call-outline" size={18} color="#6366F1" />
            </View>
            <View>
              <Text style={styles.contactBtnLabel}>TELEFONE</Text>
              <Text style={styles.contactBtnValue}>{STORE.phone}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} style={styles.contactChevron} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.contactBtn, styles.contactBtnLast]} onPress={openEmail} activeOpacity={0.75}>
            <View style={[styles.contactBtnIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="mail-outline" size={18} color="#D97706" />
            </View>
            <View>
              <Text style={styles.contactBtnLabel}>E-MAIL</Text>
              <Text style={styles.contactBtnValue}>{STORE.email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} style={styles.contactChevron} />
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>

      <BottomNavBar navigation={navigation} activeScreen="Store" />
    </SafeAreaView>
  );
}