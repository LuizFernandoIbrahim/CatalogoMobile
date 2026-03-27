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
import { getProducts } from '../utils/storage';
import { FONT, RADIUS, SPACE, HP, vScale, mScale, scale } from '../utils/responsive';

const CATEGORIES = ['Todos', 'Roupas', 'Calçados', 'Acessórios', 'Outros'];
const THUMB = scale(88);

export default function CatalogScreen() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => { loadProducts(); }, [])
  );

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (e) {
      console.error('Erro ao carregar produtos:', e);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  }

  const filtered = products.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const renderProduct = ({ item }) => (
    <View style={styles.card}>
      {item.photo ? (
        <Image source={{ uri: item.photo }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderIcon}>📦</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        {!!item.description && (
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        )}
        <Text style={styles.price}>
          R$ {Number(item.price || 0).toFixed(2).replace('.', ',')}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="🔍  Buscar produto..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#9ca3af"
      />

      <View style={{ height: vScale(48) }}>
        <FlatList
          data={CATEGORIES}
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
          <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} colors={['#4f46e5']} />
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
  categoryChipActive: { backgroundColor: '#4f46e5' },
  categoryChipText: { color: '#374151', fontWeight: '600', fontSize: FONT.sm },
  categoryChipTextActive: { color: '#fff' },
  list: { paddingHorizontal: HP, paddingTop: SPACE.sm },
  card: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    marginBottom: SPACE.sm,
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  image: { width: THUMB, height: THUMB },
  imagePlaceholder: {
    width: THUMB,
    height: THUMB,
    backgroundColor: '#f0f0f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: { fontSize: mScale(30) },
  info: { flex: 1, padding: SPACE.sm, justifyContent: 'space-between' },
  productName: { fontSize: FONT.md, fontWeight: '700', color: '#111827' },
  category: {
    fontSize: FONT.xs,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: SPACE.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  description: { fontSize: FONT.sm, color: '#9ca3af', marginTop: 2 },
  price: { fontSize: FONT.lg, fontWeight: '800', color: '#4f46e5', marginTop: 2 },
  empty: { alignItems: 'center', paddingTop: vScale(60) },
  emptyText: { color: '#9ca3af', fontSize: FONT.md },
});