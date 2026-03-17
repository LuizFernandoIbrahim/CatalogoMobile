import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  ToastAndroid,
  Platform,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients } from '../style/colors';
import { typography } from '../style/typography';
import { useCart } from '../components/CartContext';
import CartIcon from '../components/CartIcon';


const CATEGORIES = [
  { id: '1', name: 'Crochê',    icon: '🧶', count: 12 },
  { id: '2', name: 'Bordado',   icon: '🪡', count: 8  },
  { id: '3', name: 'Macramê',   icon: '🪢', count: 6  },
  { id: '4', name: 'Cerâmica',  icon: '🏺', count: 10 },
  { id: '5', name: 'Patchwork', icon: '🎨', count: 5  },
  { id: '6', name: 'Velas',     icon: '🕯️', count: 7  },
];

const FEATURED = [
  { id: '1', name: 'Cestinha de Crochê Boho',   price: 'R$ 89,00',  emoji: '🧺', tag: 'Novo'     },
  { id: '2', name: 'Quadro Bordado Floral',      price: 'R$ 145,00', emoji: '🌸', tag: 'Destaque' },
  { id: '3', name: 'Painel Macramê Grande',      price: 'R$ 210,00', emoji: '🤍', tag: ''         },
  { id: '4', name: 'Vaso de Cerâmica Rústico',   price: 'R$ 98,00',  emoji: '🏺', tag: ''         },
  { id: '5', name: 'Kit Velas Aromáticas',       price: 'R$ 65,00',  emoji: '🕯️', tag: 'Promoção' },
];


export default function HomeScreen({ navigation }) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const { addToCart } = useCart();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    if (Platform.OS === 'android') {
      ToastAndroid.show(`${item.name} adicionado!`, ToastAndroid.SHORT);
    }
  };

  return (

    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <LinearGradient colors={gradients.terracota} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerGreeting}>Olá, bem-vinda! 👋</Text>
            <Text style={styles.headerBrand}>Oficina de Marias</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIconBtn}>
              <Ionicons name="search-outline" size={22} color="#FFF" />
            </TouchableOpacity>
            <CartIcon onPress={() => navigation.navigate('Cart')} />
          </View>
        </View>

        <View style={styles.heroBanner}>
          <View style={styles.heroBannerText}>
            <Text style={styles.heroBannerSmall}>COLEÇÃO PRIMAVERA</Text>
            <Text style={styles.heroBannerTitle}>Peças feitas{'\n'}com amor 🌿</Text>
            <TouchableOpacity style={styles.heroBannerBtn} activeOpacity={0.85}>
              <Text style={styles.heroBannerBtnText}>Ver catálogo</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.heroBannerEmoji}>🧵</Text>
        </View>
      </LinearGradient>

      <Animated.ScrollView
        style={[styles.scroll, { opacity: fadeAnim }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}

        scrollEventThrottle={16}
        overScrollMode="never"
        bounces={true}
      >

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorias</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesRow}
            scrollEventThrottle={16}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.categoryCard} activeOpacity={0.8}>
                <View style={styles.categoryIconBox}>
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                </View>
                <Text style={styles.categoryName}>{cat.name}</Text>
                <Text style={styles.categoryCount}>{cat.count} peças</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Em Destaque</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>Ver mais</Text>
            </TouchableOpacity>
          </View>

          {FEATURED.map((item) => (
            <View key={item.id} style={styles.productCard}>
              <View style={styles.productImageBox}>
                <Text style={styles.productEmoji}>{item.emoji}</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
                {item.tag ? (
                  <View style={styles.productTag}>
                    <Text style={styles.productTagText}>{item.tag}</Text>
                  </View>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.addToCartBtn}
                onPress={() => handleAddToCart(item)}
                activeOpacity={0.8}
              >
                <LinearGradient colors={gradients.terracota} style={styles.addToCartGradient}>
                  <Ionicons name="add" size={20} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.ctaBanner}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.ctaEmoji}>✨</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaTitle}>Encomendas especiais</Text>
            <Text style={styles.ctaSubtitle}>Personalize sua peça com a gente</Text>
          </View>
          <Ionicons name="arrow-forward-circle" size={28} color={colors.primary} />
        </TouchableOpacity>

      </Animated.ScrollView>

      <View style={styles.bottomNav}>
        {[
          { icon: 'home',         label: 'Início',   active: true  },
          { icon: 'grid-outline', label: 'Catálogo', active: false },
          { icon: 'heart-outline',label: 'Favoritos',active: false },
          { icon: 'person-outline',label: 'Perfil',  active: false },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={styles.navItem} activeOpacity={0.7}>
            <Ionicons
              name={item.icon}
              size={22}
              color={item.active ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.navLabel, item.active && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: colors.primaryDark,
  },

  header: {
    paddingTop: 12,
    paddingBottom: 0,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerGreeting: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.sm,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 2,
  },
  headerBrand: {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes['2xl'],
    color: '#FFF',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  heroBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  heroBannerText: { flex: 1 },
  heroBannerSmall: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.xs,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 2,
    marginBottom: 4,
  },
  heroBannerTitle: {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes.xl,
    color: '#FFF',
    marginBottom: 12,
    lineHeight: typography.sizes.xl * 1.3,
  },
  heroBannerBtn: {
    backgroundColor: '#FFF',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  heroBannerBtnText: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: typography.sizes.xs,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  heroBannerEmoji: { fontSize: 52 },

  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: 4,
    paddingBottom: 20,
  },

  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes.xl,
    color: colors.textPrimary,
  },
  sectionLink: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.sm,
    color: colors.primary,
  },

  categoriesRow: {
    paddingRight: 20,  
  },
  categoryCard: { alignItems: 'center', marginRight: 14, width: 80 },
  categoryIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: { fontSize: 28 },
  categoryName: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: typography.sizes.xs,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  categoryCount: {
    fontFamily: typography.fonts.body,
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
  },


  productCard: {
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
  productImageBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  productEmoji: { fontSize: 30 },
  productInfo: { flex: 1 },
  productName: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  productPrice: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.sm,
    color: colors.secondary,
    fontStyle: 'italic',
  },
  productTag: {
    marginTop: 5,
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  productTagText: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: 10,
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },

  addToCartBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  addToCartGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  ctaBanner: {
    marginHorizontal: 20,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  ctaEmoji: { fontSize: 28 },
  ctaTitle: {
    fontFamily: typography.fonts.displayRegular,
    fontSize: typography.sizes.lg,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  ctaSubtitle: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },

  bottomNav: {
    flexDirection: 'row',
    height: 62,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  navLabel: {
    fontFamily: typography.fonts.body,
    fontSize: 10,
    color: colors.textMuted,
  },
  navLabelActive: { color: colors.primary },
});
