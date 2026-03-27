import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { getProducts, saveProduct, updateProduct, deleteProduct } from '../utils/storage';
import { FONT, RADIUS, SPACE, HP, vScale, mScale, scale } from '../utils/responsive';

const CATEGORIES = ['Roupas', 'Calçados', 'Acessórios', 'Outros'];
const EMPTY_FORM = { name: '', price: '', category: 'Roupas', description: '', photo: null };
const THUMB = scale(56);

export default function AdminScreen() {
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const insets = useSafeAreaInsets();

  useFocusEffect(useCallback(() => { loadProducts(); }, []));

  async function loadProducts() { setProducts(await getProducts()); }

  function openNew() { setEditingProduct(null); setForm(EMPTY_FORM); setModalVisible(true); }

  function openEdit(product) {
    setEditingProduct(product);
    setForm({ name: product.name, price: String(product.price), category: product.category, description: product.description, photo: product.photo });
    setModalVisible(true);
  }

  async function handleSave() {
    if (!form.name || !form.price) return Alert.alert('Preencha nome e preço.');
    const price = parseFloat(form.price.replace(',', '.'));
    if (isNaN(price)) return Alert.alert('Preço inválido.');
    const productData = { ...form, price };
    if (editingProduct) {
      await updateProduct({ ...editingProduct, ...productData });
    } else {
      await saveProduct(productData);
    }
    setModalVisible(false);
    loadProducts();
  }

  async function handleDelete(id) {
    Alert.alert('Confirmar', 'Deseja excluir este produto?', [
      { text: 'Cancelar' },
      { text: 'Excluir', style: 'destructive', onPress: async () => { await deleteProduct(id); loadProducts(); } },
    ]);
  }

  async function pickImage() {
    Alert.alert('Foto do produto', 'Escolha a origem:', [
      {
        text: 'Câmera',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') return Alert.alert('Permissão negada.');
          const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });
          if (!result.canceled) setForm({ ...form, photo: result.assets[0].uri });
        },
      },
      {
        text: 'Galeria',
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });
          if (!result.canceled) setForm({ ...form, photo: result.assets[0].uri });
        },
      },
      { text: 'Cancelar' },
    ]);
  }

  function renderProduct({ item }) {
    return (
      <View style={styles.card}>
        {item.photo ? (
          <Image source={{ uri: item.photo }} style={styles.thumb} />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <Text style={{ fontSize: mScale(22) }}>📦</Text>
          </View>
        )}
        <View style={styles.cardInfo}>
          <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.cardCategory}>{item.category}</Text>
          <Text style={styles.cardPrice}>R$ {Number(item.price).toFixed(2).replace('.', ',')}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)}>
            <Text style={styles.actionIcon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
            <Text style={styles.actionIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // FAB fica acima da navigation bar
  const fabBottom = SPACE.lg + insets.bottom;

  return (
    <View style={styles.container}>
      <View style={styles.adminBanner}>
        <Text style={styles.adminBannerText}>🔐 Modo Administrador</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        renderItem={renderProduct}
        contentContainerStyle={[styles.list, { paddingBottom: vScale(80) + insets.bottom }]}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum produto cadastrado.</Text>}
      />

      <TouchableOpacity style={[styles.fab, { bottom: fabBottom }]} onPress={openNew}>
        <Text style={styles.fabText}>＋ Novo Produto</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView
            contentContainerStyle={[styles.modalContent, { paddingBottom: vScale(24) + insets.bottom }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.modalTitle}>
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </Text>

            <TouchableOpacity style={styles.photoArea} onPress={pickImage}>
              {form.photo ? (
                <Image source={{ uri: form.photo }} style={styles.photoPreview} />
              ) : (
                <Text style={styles.photoPlaceholderText}>📷 Adicionar foto</Text>
              )}
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Nome do produto *"
              value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })}
            />
            <TextInput
              style={styles.input}
              placeholder="Preço (ex: 49.90) *"
              value={form.price}
              onChangeText={(v) => setForm({ ...form, price: v })}
              keyboardType="decimal-pad"
            />
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Descrição"
              value={form.description}
              onChangeText={(v) => setForm({ ...form, description: v })}
              multiline
            />

            <Text style={styles.label}>Categoria:</Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, form.category === cat && styles.catChipActive]}
                  onPress={() => setForm({ ...form, category: cat })}
                >
                  <Text style={[styles.catChipText, form.category === cat && styles.catChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>💾 Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  adminBanner: {
    backgroundColor: '#fef3c7',
    paddingVertical: vScale(8),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#fcd34d',
  },
  adminBannerText: { color: '#92400e', fontWeight: '700', fontSize: FONT.sm },
  list: { paddingHorizontal: HP, paddingTop: SPACE.sm },
  card: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    marginBottom: SPACE.sm,
    padding: SPACE.sm,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  thumb: { width: THUMB, height: THUMB, borderRadius: RADIUS.sm },
  thumbPlaceholder: {
    width: THUMB,
    height: THUMB,
    borderRadius: RADIUS.sm,
    backgroundColor: '#f0f0f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: { flex: 1, marginHorizontal: SPACE.sm },
  cardName: { fontSize: FONT.base, fontWeight: '700', color: '#111827' },
  cardCategory: { fontSize: FONT.xs, color: '#6b7280', marginTop: 2 },
  cardPrice: { fontSize: FONT.base, fontWeight: '800', color: '#4f46e5', marginTop: 2 },
  cardActions: { flexDirection: 'row', gap: SPACE.xs },
  editBtn: { padding: SPACE.sm, backgroundColor: '#eff6ff', borderRadius: RADIUS.sm },
  deleteBtn: { padding: SPACE.sm, backgroundColor: '#fef2f2', borderRadius: RADIUS.sm },
  actionIcon: { fontSize: mScale(16) },
  fab: {
    position: 'absolute',
    right: HP,
    backgroundColor: '#4f46e5',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACE.lg,
    paddingVertical: vScale(12),
    elevation: 8,
    shadowColor: '#4f46e5',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  fabText: { color: '#fff', fontWeight: '700', fontSize: FONT.base },
  emptyText: { textAlign: 'center', color: '#9ca3af', marginTop: vScale(60), fontSize: FONT.md },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: HP,
    paddingTop: SPACE.lg,
  },
  modalTitle: { fontSize: FONT.xl, fontWeight: '800', marginBottom: SPACE.md, color: '#111827' },
  photoArea: {
    width: '100%',
    height: vScale(130),
    backgroundColor: '#f3f4f6',
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACE.md,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  photoPreview: { width: '100%', height: '100%' },
  photoPlaceholderText: { fontSize: FONT.md, color: '#9ca3af' },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACE.md,
    paddingVertical: vScale(10),
    fontSize: FONT.base,
    marginBottom: SPACE.sm,
    backgroundColor: '#f9f9f9',
  },
  inputMultiline: { height: vScale(72), textAlignVertical: 'top' },
  label: { fontWeight: '600', color: '#374151', marginBottom: SPACE.sm, fontSize: FONT.base },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm, marginBottom: SPACE.md },
  catChip: {
    paddingHorizontal: SPACE.md,
    paddingVertical: vScale(6),
    borderRadius: RADIUS.full,
    backgroundColor: '#e5e7eb',
  },
  catChipActive: { backgroundColor: '#4f46e5' },
  catChipText: { color: '#374151', fontWeight: '600', fontSize: FONT.sm },
  catChipTextActive: { color: '#fff' },
  saveBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: RADIUS.md,
    paddingVertical: vScale(14),
    alignItems: 'center',
    marginBottom: SPACE.sm,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: FONT.md },
  cancelBtn: { alignItems: 'center', paddingVertical: SPACE.sm },
  cancelBtnText: { color: '#6b7280', fontSize: FONT.base },
});