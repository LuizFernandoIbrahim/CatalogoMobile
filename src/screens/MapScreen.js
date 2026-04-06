import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { FONT, RADIUS, SPACE, HP, vScale } from '../utils/responsive';

const STORE_LOCATION = {
  latitude: -22.4036,
  longitude: -43.6636,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

export default function MapScreen() {
  function openInMaps() {
    const url = `https://www.google.com/maps/search/?api=1&query=${STORE_LOCATION.latitude},${STORE_LOCATION.longitude}`;
    Linking.openURL(url);
  }

  return (
    <View style={styles.container}>
      <View style={styles.infoCard}>
        <Text style={styles.storeName}>Nossa Loja</Text>
        <Text style={styles.address}>Vassouras / RJ</Text>
      </View>

      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={STORE_LOCATION}
      >
        <Marker coordinate={STORE_LOCATION} title="Nossa Loja" pinColor="#402105" />
      </MapView>

      <TouchableOpacity style={styles.gmapsButton} onPress={openInMaps}>
        <Text style={styles.gmapsText}>Abrir no Google Maps</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  infoCard: {
    paddingHorizontal: HP,
    paddingVertical: SPACE.md,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  storeName: { fontWeight: '700', fontSize: FONT.lg, color: '#402105' },
  address: { color: '#6b7280', fontSize: FONT.base, marginTop: 2 },
  map: { flex: 1 },
  gmapsButton: {
    backgroundColor: '#402105',
    paddingVertical: vScale(14),
    marginHorizontal: HP,
    marginVertical: SPACE.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#402105',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  gmapsText: { color: '#fff', fontWeight: '700', fontSize: FONT.base },
});