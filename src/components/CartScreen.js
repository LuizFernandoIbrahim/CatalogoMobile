import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from './CartContext';
import { colors, gradients } from '../style/colors';
import { typography } from '../style/typography';

export default function CartScreen({ navigation }) {
  const { cartItems, incrementItem, decrementItem, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const [note, setNote] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const successScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 70, friction: 9, useNativeDriver: true }),
    ]).start();
  }, []);

  const formatPrice = (value) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleFinishOrder = () => {
    Alert.alert(
      'Confirmar pedido',
      `Total: ${formatPrice(totalPrice)}\n\nDeseja finalizar a compra?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar ✓',
          onPress: () => {
          
            setOrderPlaced(true);
            Animated.spring(successScale, {
              toValue: 1,
              tension: 50,
              friction: 6,
              useNativeDriver: true,
            }).start();
            clearCart();
          },
        },
      ]
    );
  };

  if (orderPlaced) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.successContainer, { transform: [{ scale: successScale }] }]}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={52} color="#FFF" />
          </View>
          <Text style={styles.successTitle}>Pedido recebido!</Text>
          <Text style={styles.successSubtitle}>
            Obrigada pela sua encomenda 🧵{'\n'}
            Entraremos em contato em breve para combinar os detalhes.
          </Text>
          <TouchableOpacity
            style={styles.successBtn}
            onPress={() => navigation.replace('Home')}
            activeOpacity={0.85}
          >
            <LinearGradient colors={gradients.terracota} style={styles.successBtnGradient}>
              <Text style={styles.successBtnText}>Voltar ao catálogo</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Carrinho</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={() => {
            Alert.alert('Limpar carrinho', 'Remover todos os itens?', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Limpar', style: 'destructive', onPress: clearCart },
            ]);
          }}>
            <Text style={styles.clearBtn}>Limpar</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {cartItems.length === 0 ? (
        <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
          <Text style={styles.emptyEmoji}>🛍️</Text>
          <Text style={styles.emptyTitle}>Carrinho vazio</Text>
          <Text style={styles.emptySubtitle}>Adicione produtos do catálogo para começar</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <LinearGradient colors={gradients.terracota} style={styles.emptyBtnGradient}>
              <Text style={styles.emptyBtnText}>Ver catálogo</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

              {cartItems.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  <View style={styles.cartItemImage}>
                    <Text style={styles.cartItemEmoji}>{item.emoji}</Text>
                  </View>

                  <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.cartItemPrice}>{item.price}</Text>
                  </View>

                  <View style={styles.cartItemActions}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => decrementItem(item.id)}
                    >
                      <Ionicons
                        name={item.quantity === 1 ? 'trash-outline' : 'remove'}
                        size={14}
                        color={item.quantity === 1 ? colors.error : colors.textPrimary}
                      />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => incrementItem(item.id)}
                    >
                      <Ionicons name="add" size={14} color={colors.textPrimary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <View style={styles.noteSection}>
                <Text style={styles.noteLabel}>Observações do pedido</Text>
                <TextInput
                  style={styles.noteInput}
                  placeholder="Ex: cor preferida, tamanho, personalização..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={3}
                  value={note}
                  onChangeText={setNote}
                />
              </View>

              <View style={styles.summary}>
                <Text style={styles.summaryTitle}>Resumo do pedido</Text>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    {totalItems} {totalItems === 1 ? 'item' : 'itens'}
                  </Text>
                  <Text style={styles.summaryValue}>{formatPrice(totalPrice)}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Entrega</Text>
                  <Text style={[styles.summaryValue, { color: colors.secondary }]}>
                    A combinar
                  </Text>
                </View>

                <View style={[styles.summaryRow, styles.summaryTotal]}>
                  <Text style={styles.summaryTotalLabel}>Total</Text>
                  <Text style={styles.summaryTotalValue}>{formatPrice(totalPrice)}</Text>
                </View>
              </View>

            </Animated.View>
          </ScrollView>

          <View style={styles.checkoutBar}>
            <View style={styles.checkoutTotal}>
              <Text style={styles.checkoutTotalLabel}>Total</Text>
              <Text style={styles.checkoutTotalValue}>{formatPrice(totalPrice)}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleFinishOrder}
              activeOpacity={0.88}
            >
              <LinearGradient colors={gradients.terracota} style={styles.checkoutBtnGradient}>
                <Ionicons name="bag-check-outline" size={20} color="#FFF" />
                <Text style={styles.checkoutBtnText}>Finalizar pedido</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes.xl,
    color: colors.textPrimary,
  },
  clearBtn: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.sm,
    color: colors.error,
  },


  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 120 },

  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  cartItemImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cartItemEmoji: { fontSize: 28 },
  cartItemInfo: { flex: 1, marginRight: 8 },
  cartItemName: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    marginBottom: 4,
    lineHeight: typography.sizes.sm * 1.4,
  },
  cartItemPrice: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.sm,
    color: colors.secondary,
    fontStyle: 'italic',
  },

  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    minWidth: 20,
    textAlign: 'center',
  },

  noteSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  noteLabel: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  noteInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    lineHeight: typography.sizes.sm * 1.6,
    minHeight: 80,
    textAlignVertical: 'top',
  },

  summary: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryTitle: {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes.lg,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 10,
    paddingTop: 14,
    marginBottom: 0,
  },
  summaryTotalLabel: {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes.lg,
    color: colors.textPrimary,
  },
  summaryTotalValue: {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes.lg,
    color: colors.primary,
  },

  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  checkoutTotal: { flex: 1 },
  checkoutTotalLabel: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  checkoutTotalValue: {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes['2xl'],
    color: colors.textPrimary,
  },
  checkoutBtn: {
    flex: 1.6,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  checkoutBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  checkoutBtnText: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: typography.sizes.md,
    color: '#FFF',
    letterSpacing: 0.3,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: { fontSize: 64, marginBottom: 20 },
  emptyTitle: {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes['2xl'],
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: typography.sizes.md * 1.6,
    marginBottom: 32,
  },
  emptyBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyBtnGradient: {
    paddingVertical: 14,
    paddingHorizontal: 36,
  },
  emptyBtnText: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: typography.sizes.md,
    color: '#FFF',
    letterSpacing: 0.4,
  },

  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  successTitle: {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes['3xl'],
    color: colors.textPrimary,
    marginBottom: 12,
  },
  successSubtitle: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.sizes.md * 1.7,
    marginBottom: 40,
  },
  successBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  successBtnGradient: {
    paddingVertical: 14,
    paddingHorizontal: 36,
  },
  successBtnText: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: typography.sizes.md,
    color: '#FFF',
    letterSpacing: 0.4,
  },
});
