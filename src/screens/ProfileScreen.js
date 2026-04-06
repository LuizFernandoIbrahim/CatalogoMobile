import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { logoutUser, updateUserPhoto, setBiometricsEnabled, isBiometricsEnabled } from '../utils/storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT, RADIUS, SPACE, HP, vScale, mScale, scale } from '../utils/responsive';

const AVATAR_SIZE = scale(88);

export default function ProfileScreen({ user, onLogout }) {
  const [biometrics, setBiometrics] = useState(false);
  const [photo, setPhoto] = useState(user?.photo || null);
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    isBiometricsEnabled().then(setBiometrics);
  }, []);

  async function toggleBiometrics(value) {
    await setBiometricsEnabled(value);
    setBiometrics(value);
  }

  async function pickProfilePhoto() {
    Alert.alert('Foto de perfil', 'Escolha a origem:', [
      {
        text: 'Câmera',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') return Alert.alert('Permissão negada.');
          const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });
          if (!result.canceled) {
            const uri = result.assets[0].uri;
            setPhoto(uri);
            await updateUserPhoto(user.id, uri);
          }
        },
      },
      {
        text: 'Galeria',
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });
          if (!result.canceled) {
            const uri = result.assets[0].uri;
            setPhoto(uri);
            await updateUserPhoto(user.id, uri);
          }
        },
      },
      { text: 'Cancelar' },
    ]);
  }

  async function handleLogout() {
    await logoutUser();
    onLogout();
  }

  const avatarRadius = AVATAR_SIZE / 2;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickProfilePhoto} style={styles.avatarWrapper}>
          {photo ? (
            <Image source={{ uri: photo }} style={[styles.avatar, { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: avatarRadius }]} />
          ) : (
            <View style={[styles.avatarPlaceholder, { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: avatarRadius }]}>
              <Text style={styles.avatarInitial}>
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
          )}
          <View style={styles.cameraBadge}>
            <Text style={{ fontSize: mScale(13) }}>📷</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {user?.isAdmin && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        <View style={styles.row}>
          <View style={styles.rowInfo}>
            <Text style={styles.rowLabel}>Login por biometria</Text>
            <Text style={styles.rowSub}>Usar impressão digital / Face ID</Text>
          </View>
          <Switch
            value={biometrics}
            onValueChange={toggleBiometrics}
            trackColor={{ true: '#bba79d', false: '#D1D5DB' }}
            thumbColor={biometrics ? "#402105" : "#F4F3F4"}
          />
        </View>
      </View>

      <TouchableOpacity style={[styles.logoutBtn, { marginBottom: SPACE.xl + insets.bottom }]} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: {
    backgroundColor: '#402105',
    alignItems: 'center',
    paddingTop: SPACE.xl,
    paddingBottom: SPACE.xxl,
  },
  avatarWrapper: { position: 'relative' },
  avatar: { borderWidth: 3, borderColor: '#fff' },
  avatarPlaceholder: {
    backgroundColor: '#ffd3a2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarInitial: { fontSize: mScale(36), color: '#402105', fontWeight: '800' },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: RADIUS.full,
    width: scale(26),
    height: scale(26),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  name: { fontSize: FONT.xl, fontWeight: '800', color: '#fff', marginTop: SPACE.sm },
  email: { fontSize: FONT.sm, color: '#c7d2fe', marginTop: SPACE.xs },
  adminBadge: {
    backgroundColor: '#fef3c7',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACE.md,
    paddingVertical: vScale(4),
    marginTop: SPACE.sm,
  },
  adminBadgeText: { color: '#92400e', fontWeight: '700', fontSize: FONT.sm },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: HP,
    marginTop: SPACE.lg,
    borderRadius: RADIUS.lg,
    padding: SPACE.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: FONT.xs,
    color: '#9ca3af',
    fontWeight: '700',
    marginBottom: SPACE.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowInfo: { flex: 1, marginRight: SPACE.sm },
  rowLabel: { fontSize: FONT.base, fontWeight: '600', color: '#111827' },
  rowSub: { fontSize: FONT.xs, color: '#9ca3af', marginTop: 2 },
  logoutBtn: {
    marginHorizontal: HP,
    marginTop: SPACE.md,
    marginBottom: SPACE.xl,
    backgroundColor: '#fef2f2',
    borderRadius: RADIUS.lg,
    paddingVertical: vScale(14),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: { color: '#dc2626', fontWeight: '700', fontSize: FONT.base },
});