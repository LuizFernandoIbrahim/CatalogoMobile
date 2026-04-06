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

const CATEGORIES = ['Todos', 'Decoração', 'Uso Pessoal', 'Cozinha', 'Outros'];
const THUMB_SIZE = scale(80); // Ajustado para caber com padding

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
      {/* Container da Imagem com Padding para evitar o efeito "cortado" */}
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
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Buscar produto..."
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
  
  // Estilização do Card Corrigida
  card: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    marginBottom: SPACE.sm,
    flexDirection: 'row',
    padding: SPACE.sm, // Padding interno para a imagem não encostar na borda
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
  image: { 
    width: '100%', 
    height: '100%' 
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: { 
    fontSize: mScale(24), 
    color: '#9ca3af',
    opacity: 0.6 
  },
  info: { 
    flex: 1, 
    marginLeft: SPACE.md, // Espaçamento entre imagem e texto
    justifyContent: 'space-between' 
  },
  productName: { 
    fontSize: FONT.md, 
    fontWeight: '700', 
    color: '#111827' 
  },
  categoryBadge: {
    backgroundColor: '#FEF3C7', // Tom de bege Admin
    paddingHorizontal: SPACE.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  categoryText: {
    fontSize: scale(10),
    color: '#92400E', // Marrom Admin
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  description: { 
    fontSize: FONT.xs, 
    color: '#9ca3af', 
    marginTop: 4 
  },
  price: { 
    fontSize: FONT.lg, 
    fontWeight: '800', 
    color: '#402105', 
    marginTop: 4 
  },
  empty: { alignItems: 'center', paddingTop: vScale(60) },
  emptyText: { color: '#9ca3af', fontSize: FONT.md },
});