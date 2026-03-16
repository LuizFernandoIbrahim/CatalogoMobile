import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { authenticateWithBiometrics, getBiometricTypes } from '../components/biometricService';
import { colors, gradients } from '../style/colors';
import { typography } from '../style/typography';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation, isBiometricAvailable }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [biometricType, setBiometricType] = useState(null);


  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const buttonPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {

    const detectType = async () => {
      const { AuthenticationType } = await import('expo-local-authentication');
      const types = await getBiometricTypes();
      if (types.includes(AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('face');
      } else if (types.includes(AuthenticationType.FINGERPRINT)) {
        setBiometricType('fingerprint');
      }
    };
    if (isBiometricAvailable) detectType();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    if (isBiometricAvailable) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(buttonPulse, { toValue: 1.06, duration: 900, useNativeDriver: true }),
          Animated.timing(buttonPulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isBiometricAvailable]);

  const handleBiometricAuth = async () => {
    setIsAuthenticating(true);
    const { success, error } = await authenticateWithBiometrics();
    setIsAuthenticating(false);

    if (success) {
      navigation.replace('Home');
    } else {
      if (error !== 'user_cancel' && error !== 'system_cancel') {
        Alert.alert(
          'Autenticação falhou',
          'Não foi possível verificar sua identidade. Tente novamente.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const biometricIcon = biometricType === 'face' ? 'scan-outline' : 'finger-print-outline';
  const biometricLabel =
    biometricType === 'face' ? 'Entrar com Face ID' : 'Entrar com Digital';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient colors={gradients.warmBackground} style={StyleSheet.absoluteFill} />

      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />
      <View style={styles.decorDot1} />
      <View style={styles.decorDot2} />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Animated.View style={[styles.logoArea, { transform: [{ scale: logoScale }] }]}>

          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🧵</Text>
          </View>
          <View style={styles.brandingText}>
            <Text style={styles.brandSmall}>BEM-VINDA À</Text>
            <Text style={styles.brandTitle}>Oficina de{'\n'}Marias</Text>
            <View style={styles.dividerLine} />
            <Text style={styles.brandTagline}>Artesanato com alma e cuidado</Text>
          </View>
        </Animated.View>

        <View style={styles.authArea}>
          {isBiometricAvailable ? (
            <>
              <Text style={styles.authInstruction}>
                Use sua biometria para acessar o catálogo
              </Text>

              <Animated.View style={{ transform: [{ scale: buttonPulse }] }}>
                <TouchableOpacity
                  style={[styles.biometricBtn, isAuthenticating && styles.biometricBtnLoading]}
                  onPress={handleBiometricAuth}
                  disabled={isAuthenticating}
                  activeOpacity={0.82}
                >
                  <LinearGradient
                    colors={gradients.terracota}
                    style={styles.biometricBtnGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons
                      name={isAuthenticating ? 'ellipsis-horizontal' : biometricIcon}
                      size={34}
                      color="#FFF"
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              <Text style={styles.biometricLabel}>
                {isAuthenticating ? 'Verificando...' : biometricLabel}
              </Text>
            </>
          ) : (
            <View style={styles.noBiometricBox}>
              <Ionicons name="information-circle-outline" size={22} color={colors.textMuted} />
              <Text style={styles.noBiometricText}>
                Biometria não disponível neste dispositivo.{'\n'}
                Configure nas opções de segurança.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => navigation.replace('Home')}
            activeOpacity={0.7}
          >
            <Text style={styles.skipBtnText}>Entrar sem biometria →</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={styles.footerText}>
          Feito com ♥ · Oficina de Marias © {new Date().getFullYear()}
        </Text>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  decorCircle1: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.primaryLight,
    opacity: 0.08,
    top: -60,
    right: -80,
  },
  decorCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.secondary,
    opacity: 0.07,
    bottom: 80,
    left: -60,
  },
  decorDot1: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent,
    opacity: 0.5,
    top: 180,
    right: 30,
  },
  decorDot2: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    opacity: 0.3,
    top: 220,
    left: 40,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  logoArea: {
    alignItems: 'center',
    marginBottom: 56,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 44,
  },
  brandingText: {
    alignItems: 'center',
  },
  brandSmall: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    letterSpacing: 3,
    marginBottom: 4,
  },
  brandTitle: {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes['4xl'],
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: typography.sizes['4xl'] * 1.15,
    marginBottom: 16,
  },
  dividerLine: {
    width: 48,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
    marginBottom: 12,
  },
  brandTagline: {
    fontFamily: typography.fonts.bodyLight,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    fontStyle: 'italic',
  },

  authArea: {
    alignItems: 'center',
    width: '100%',
  },
  authInstruction: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: typography.sizes.md * 1.5,
  },
  biometricBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 14,
  },
  biometricBtnLoading: {
    opacity: 0.7,
  },
  biometricBtnGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  biometricLabel: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: typography.sizes.sm,
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 32,
  },

  noBiometricBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
    marginBottom: 24,
  },
  noBiometricText: {
    flex: 1,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    lineHeight: typography.sizes.sm * 1.6,
  },

  skipBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipBtnText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },

  footer: {
    paddingBottom: 32,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: typography.fonts.bodyLight,
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
});
