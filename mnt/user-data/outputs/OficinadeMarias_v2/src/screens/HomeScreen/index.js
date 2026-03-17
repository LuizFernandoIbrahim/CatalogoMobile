import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
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

import { gradients } from '../../theme/colors';
import { colors } from '../../theme/colors';
import { useCart } from '../../context/CartContext';
import CartIcon from '../../components/CartIcon';
import styles from './styles';

// ─── Dados do catálogo ────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: '1', name: 'Crochê',    icon: '🧶', count: 12 },
  { id: '2', name: 'Bordado',   icon: '🪡', count: 8  },
  { id: '3', name: 'Macramê',   icon: '🪢', count: 6  },
  { id: '4', name: 'Cerâmica',  icon: '🏺', count: 10 },
  { id: '5', name: 'Patchwork', icon: '🎨', count: 5  },
  { id: '6', name: 'Velas',     icon: '🕯️', count: 7  },
];

const FEATURED = [
  { id: '1', name: 'Cestinha de Crochê Boho',  price: 'R$ 89,00',  emoji: '🧺', tag: 'Novo'     },
  { id: '2', name: 'Quadro Bordado Floral',     price: 'R$ 145,00', emoji: '🌸', tag: 'Destaque' },
  { id: '3', name: 'Painel Macramê Grande',     price: 'R$ 210,00', emoji: '🤍', tag: ''         },
  { id: '4', name: 'Vaso de Cerâmica Rústico',  price: 'R$ 98,00',  emoji: '🏺', tag: ''         },
  { id: '5', name: 'Kit Velas Aromáticas',      price: 'R$ 65,00',  emoji: '🕯️', tag: 'Promoção' },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export default function HomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { addToCart } = useCart();

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
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

      {/* ── HEADER (fixo) ─────────────────────────────────────────── */}
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

      {/* ── CONTEÚDO ROLÁVEL ──────────────────────────────────────── */}
      <Animated.ScrollView
        style={[styles.scroll, { opacity: fadeAnim }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        overScrollMode="never"
        bounces
      >
        {/* Categorias */}
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

        {/* Destaques */}
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

        {/* Banner CTA */}
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

      {/* ── BOTTOM NAV (fixo) ─────────────────────────────────────── */}
      <View style={styles.bottomNav}>
        {[
          { icon: 'home',          label: 'Início',    active: true  },
          { icon: 'grid-outline',  label: 'Catálogo',  active: false },
          { icon: 'heart-outline', label: 'Favoritos', active: false },
          { icon: 'location-sharp', label: 'Loja',      active: false, screen: 'Store' },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={styles.navItem} activeOpacity={0.7} onPress={() => item.screen && navigation.navigate(item.screen)}>
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
