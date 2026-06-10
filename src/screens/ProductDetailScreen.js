import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT, RADIUS, SPACE, HP, vScale, scale } from '../utils/responsive';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const insets = useSafeAreaInsets();

  const IMAGE_HEIGHT = vScale(320);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.heroWrapper, { height: IMAGE_HEIGHT + insets.top }]}>
        {product.photo ? (
          <Image
            source={{ uri: product.photo }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.heroPlaceholder]}>
            <Text style={styles.heroPlaceholderIcon}>▧</Text>
          </View>
        )}

        <View style={[styles.heroTopGradient, { paddingTop: insets.top }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroBadgeWrapper}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {product.category?.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: SPACE.xl + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dragHandle} />
        <View style={styles.headerRow}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>
            R$ {Number(product.price || 0).toFixed(2).replace('.', ',')}
          </Text>
        </View>

        <View style={styles.divider} />

        {!!product.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Sobre o produto</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Sobre o produto</Text>
            <Text style={styles.descriptionEmpty}>
              Nenhuma descrição disponível para este produto.
            </Text>
          </View>
        )}

        <View style={styles.infoCard}>
          <InfoRow label="Categoria" value={product.category} />
          <View style={styles.infoRowDivider} />
          <InfoRow
            label="Preço"
            value={`R$ ${Number(product.price || 0).toFixed(2).replace('.', ',')}`}
            valueStyle={styles.infoValuePrice}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value, valueStyle }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, valueStyle]}>{value}</Text>
    </View>
  );
}

const CARD_OVERLAP = vScale(28);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroWrapper: { width: '100%', backgroundColor: '#e5e7eb' },
  heroPlaceholder: {
    backgroundColor: '#f0ebe3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroPlaceholderIcon: { fontSize: scale(72), opacity: 0.25 },

  heroTopGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: vScale(100),
    backgroundColor: 'transparent',
    backgroundGradient: 'linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)',
    paddingHorizontal: HP,
    justifyContent: 'flex-start',
  },
  backBtn: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: vScale(8),
  },
  backIcon: { color: '#fff', fontSize: scale(20), lineHeight: scale(22) },

  heroBadgeWrapper: {
    position: 'absolute',
    bottom: CARD_OVERLAP + vScale(12),
    left: HP,
  },
  categoryBadge: {
    backgroundColor: '#402105',
    paddingHorizontal: SPACE.md,
    paddingVertical: vScale(4),
    borderRadius: RADIUS.full,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: scale(10),
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  scrollView: {
    flex: 1,
    marginTop: -CARD_OVERLAP,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: HP,
    paddingTop: SPACE.sm,
    minHeight: vScale(400),
  },

  dragHandle: {
    width: scale(40),
    height: vScale(4),
    borderRadius: 2,
    backgroundColor: '#e5e7eb',
    alignSelf: 'center',
    marginBottom: SPACE.md,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: SPACE.sm,
    marginBottom: SPACE.md,
  },
  productName: {
    flex: 1,
    fontSize: FONT.xl,
    fontWeight: '800',
    color: '#111827',
    lineHeight: FONT.xl * 1.25,
  },
  productPrice: {
    fontSize: FONT.xl,
    fontWeight: '800',
    color: '#402105',
  },

  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginBottom: SPACE.md,
  },

  section: { marginBottom: SPACE.lg },
  sectionLabel: {
    fontSize: FONT.sm,
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: SPACE.sm,
  },
  descriptionText: {
    fontSize: FONT.base,
    color: '#374151',
    lineHeight: FONT.base * 1.6,
  },
  descriptionEmpty: {
    fontSize: FONT.base,
    color: '#d1d5db',
    fontStyle: 'italic',
  },

  infoCard: {
    backgroundColor: '#faf9f7',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vScale(10),
  },
  infoRowDivider: { height: 1, backgroundColor: '#f3f4f6' },
  infoLabel: { fontSize: FONT.sm, color: '#6b7280', fontWeight: '600' },
  infoValue: { fontSize: FONT.sm, color: '#111827', fontWeight: '700' },
  infoValuePrice: { color: '#402105', fontSize: FONT.md },
});
