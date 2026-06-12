import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getProducts, sincronizarComFirebase } from '../database/catalogo';
import { FONT, RADIUS, SPACE, HP, vScale, mScale, scale } from '../utils/responsive';

export const PRODUCT_CATEGORIES = ['Decoração', 'Uso Pessoal', 'Cozinha', 'Outros'];
const FILTER_CATEGORIES = ['Todos', ...PRODUCT_CATEGORIES];

const THUMB_SIZE = scale(80);

export default function CatalogScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      inicializarDados();
    }, [])
  );

  async function inicializarDados() {
    try {

      const localData = await getProducts();
      setProducts(localData || []);

      await sincronizarComFirebase();

      const updatedData = await getProducts();
      setProducts(updatedData || []);
    } catch (e) {
      console.error('Erro na inicialização do catálogo:', e);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await sincronizarComFirebase();
    const data = await getProducts();
    setProducts(data || []);
    setRefreshing(false);
  }

  const filtered = products.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
      activeOpacity={0.75}
    >
      <View style={styles.imageWrapper}>
        {item.photo ? (
          <Image source={{ uri: item.photo }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderIcon}>▧</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <View>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          {!!item.description && (
            <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
          )}
        </View>

        <Text style={styles.price}>
          R$ {Number(item.price || 0).toFixed(2).replace('.', ',')}
        </Text>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + vScale(14) }]}>
        <Text style={styles.headerText}>Catálogo</Text>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Buscar produto..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#9ca3af"
      />

      <View style={{ height: vScale(48) }}>
        <FlatList
          data={FILTER_CATEGORIES}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(c) => `cat-${c}`}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryChip, selectedCategory === item && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[styles.categoryChipText, selectedCategory === item && styles.categoryChipTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderProduct}
        contentContainerStyle={[styles.list, { paddingBottom: SPACE.lg + insets.bottom }]}
        refreshControl={
          <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} colors={['#402105']} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: {
    backgroundColor: '#402105',
    paddingBottom: vScale(14),
    paddingHorizontal: HP,
    alignItems: 'flex-start',
  },
  headerText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: FONT.lg,
  },
  search: {
    marginHorizontal: HP,
    marginTop: SPACE.md,
    marginBottom: SPACE.sm,
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACE.md,
    paddingVertical: vScale(10),
    fontSize: FONT.base,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryList: {
    paddingHorizontal: HP - 4,
    alignItems: 'center',
  },
  categoryChip: {
    paddingHorizontal: SPACE.md,
    paddingVertical: vScale(6),
    borderRadius: RADIUS.full,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  categoryChipActive: { backgroundColor: '#402105' },
  categoryChipText: { color: '#374151', fontWeight: '600', fontSize: FONT.sm },
  categoryChipTextActive: { color: '#fff' },
  list: { paddingHorizontal: HP, paddingTop: SPACE.sm },
  card: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    marginBottom: SPACE.sm,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACE.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  imageWrapper: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: { fontSize: mScale(24), color: '#9ca3af', opacity: 0.6 },
  info: { flex: 1, marginLeft: SPACE.md, justifyContent: 'space-between' },
  productName: { fontSize: FONT.md, fontWeight: '700', color: '#111827' },
  categoryBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: SPACE.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  categoryText: {
    fontSize: scale(10),
    color: '#92400E',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  description: { fontSize: FONT.xs, color: '#9ca3af', marginTop: 4 },
  price: { fontSize: FONT.lg, fontWeight: '800', color: '#402105', marginTop: 4 },
  chevron: {
    fontSize: scale(22),
    color: '#d1d5db',
    marginLeft: SPACE.xs,
    fontWeight: '300',
  },
  empty: { alignItems: 'center', paddingTop: vScale(60) },
  emptyText: { color: '#9ca3af', fontSize: FONT.md },
});