import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT, RADIUS, SPACE, HP, vScale } from '../utils/responsive';

const STORE_LAT = -22.4036;
const STORE_LNG = -43.6636;

const MAP_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 100vw; height: 100vh; overflow: hidden; }
    iframe { width: 100%; height: 100%; border: none; }
  </style>
</head>
<body>
  <iframe
    src="https://maps.google.com/maps?q=${STORE_LAT},${STORE_LNG}&z=15&output=embed"
    allowfullscreen
  ></iframe>
</body>
</html>
`;

export default function MapScreen() {
  const insets = useSafeAreaInsets();

  function openInMaps() {
    const url = `https://www.google.com/maps/search/?api=1&query=${STORE_LAT},${STORE_LNG}`;
    Linking.openURL(url).catch(() => {
      alert('Não foi possível abrir o mapa.');
    });
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.infoCard}>
        <Text style={styles.storeName}>Nossa Loja</Text>
        <Text style={styles.address}>Vassouras / RJ</Text>
      </View>

      <WebView
        style={styles.map}
        source={{ html: MAP_HTML }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        scalesPageToFit={false}
      />

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