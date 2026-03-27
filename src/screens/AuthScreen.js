import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import {
  loginUser,
  saveUser,
  isBiometricsEnabled,
  setBiometricsEnabled,
  getCurrentUser,
} from '../utils/storage';
import { FONT, RADIUS, SPACE, HP, vScale, mScale } from '../utils/responsive';

function toBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.trim().toLowerCase() === 'true';
  if (typeof value === 'number') return value === 1;
  return false;
}

function sanitize(user) {
  if (!user) return null;
  return { ...user, isAdmin: toBoolean(user.isAdmin) };
}

export default function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);

  useEffect(() => { checkBiometrics(); }, []);

  async function checkBiometrics() {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    const enabled = await isBiometricsEnabled();
    if (compatible && enrolled && enabled) {
      setBiometricsAvailable(true);
      handleBiometricLogin();
    }
  }

  async function handleBiometricLogin() {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Entre com sua biometria',
      fallbackLabel: 'Usar senha',
    });
    if (result.success) {
      const user = await getCurrentUser();
      if (user) onLogin(sanitize(user));
    }
  }

  async function handleLogin() {
    if (!email || !password) return Alert.alert('Preencha todos os campos.');
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      const safe = sanitize(user);
      const enabled = await isBiometricsEnabled();
      const hardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (hardware && enrolled && !enabled) {
        Alert.alert('Ativar Biometria', 'Deseja usar biometria nos próximos acessos?', [
          { text: 'Não', onPress: () => onLogin(safe) },
          { text: 'Sim', onPress: async () => { await setBiometricsEnabled(true); onLogin(safe); } },
        ]);
      } else {
        onLogin(safe);
      }
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    if (!name || !email || !password) return Alert.alert('Preencha todos os campos.');
    if (password.length < 4) return Alert.alert('Senha deve ter ao menos 4 caracteres.');
    setLoading(true);
    try {
      await saveUser({ name, email, password });
      Alert.alert('Cadastro realizado!', 'Faça login para continuar.');
      setMode('login');
      setName(''); setEmail(''); setPassword('');
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>🛍️</Text>
          <Text style={styles.title}>CatalogApp</Text>
          <Text style={styles.subtitle}>
            {mode === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta!'}
          </Text>
        </View>

        <View style={styles.card}>
          {mode === 'register' && (
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={mode === 'login' ? handleLogin : handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>

          {mode === 'login' && biometricsAvailable && (
            <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin}>
              <Text style={styles.biometricText}>🔒 Entrar com biometria</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.switchBtn}
            onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            <Text style={styles.switchText}>
              {mode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: HP,
    paddingVertical: SPACE.xl,
  },
  header: { alignItems: 'center', marginBottom: SPACE.xl },
  logo: { fontSize: mScale(48) },
  title: { fontSize: FONT.hero, fontWeight: '800', color: '#fff', marginTop: SPACE.sm },
  subtitle: { fontSize: FONT.md, color: '#a0a0c0', marginTop: SPACE.xs },
  card: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.xl,
    padding: SPACE.lg,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACE.md,
    paddingVertical: vScale(12),
    marginBottom: SPACE.sm,
    fontSize: FONT.md,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: RADIUS.md,
    paddingVertical: vScale(14),
    alignItems: 'center',
    marginTop: SPACE.xs,
    marginBottom: SPACE.sm,
  },
  buttonText: { color: '#fff', fontSize: FONT.md, fontWeight: '700' },
  biometricButton: {
    borderWidth: 1,
    borderColor: '#4f46e5',
    borderRadius: RADIUS.md,
    paddingVertical: vScale(12),
    alignItems: 'center',
    marginBottom: SPACE.md,
  },
  biometricText: { color: '#4f46e5', fontSize: FONT.base, fontWeight: '600' },
  switchBtn: { paddingVertical: SPACE.sm, alignItems: 'center' },
  switchText: { color: '#6b7280', fontSize: FONT.sm },
});
