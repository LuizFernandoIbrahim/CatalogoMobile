import * as LocalAuthentication from 'expo-local-authentication';

export async function checkBiometricAvailability() {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) return false;
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return enrolled;
  } catch {
    return false;
  }
}

export async function getBiometricTypes() {
  return await LocalAuthentication.supportedAuthenticationTypesAsync();
}

export async function authenticateWithBiometrics() {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Acesse a Oficina de Marias',
      subTitle: 'Use sua biometria para entrar',
      cancelLabel: 'Cancelar',
      fallbackLabel: 'Usar senha',
      disableDeviceFallback: false,
    });

    if (result.success) return { success: true }; 

    return {
      success: false,
      error: result.error ?? 'Autenticação falhou',
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}