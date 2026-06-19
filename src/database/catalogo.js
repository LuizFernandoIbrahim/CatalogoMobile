import { getDatabase } from './banco';
import NetInfo from '@react-native-community/netinfo';
import {
  collection, query, where, getDocs,
  doc, setDoc, updateDoc, deleteDoc,
} from 'firebase/firestore';
import { dbFirestore } from './firebase';

async function atualizarEstruturaTabela(db) {
  try {
    await db.runAsync('ALTER TABLE products ADD COLUMN updatedAt INTEGER DEFAULT 0');
  } catch {
  }
}

export async function getProducts() {
  try {
    const db = await getDatabase();
    await atualizarEstruturaTabela(db);
    return await db.getAllAsync(
      'SELECT * FROM products ORDER BY name ASC'
    );
  } catch {
    return [];
  }
}

export async function sincronizarComFirebase() {
  try {
    const db = await getDatabase();
    await atualizarEstruturaTabela(db);

    const estadoConexao = await NetInfo.fetch();
    console.log("=== STATUS DA CONEXÃO ===", estadoConexao.isConnected);

    if (!estadoConexao.isConnected) {
      console.log('Dispositivo offline. Sincronização pulada.');
      return;
    }

    const resultado = await db.getFirstAsync(
      'SELECT MAX(updatedAt) as max_date FROM products'
    );
    const ultimaAtualizacaoLocal = resultado?.max_date || 0;
    console.log("=== ULTIMA ATUALIZACAO LOCAL (SQLite) ===", ultimaAtualizacaoLocal);

    const produtosRef = collection(dbFirestore, "produtos");
    const q = query(produtosRef, where("updatedAt", ">", ultimaAtualizacaoLocal));

    console.log("=== DISPARANDO QUERY NO FIREBASE ===");
    const querySnapshot = await getDocs(q);

    console.log("=== DOCUMENTOS ENCONTRADOS NO FIREBASE ===", querySnapshot.size);

    if (!querySnapshot.empty) {
      for (const docSnap of querySnapshot.docs) {
        const dadosNuvem = docSnap.data();
        console.log("=== DADO QUE VEIO DA NUVEM ===", dadosNuvem);

        await db.runAsync(
          `INSERT OR REPLACE INTO products (id, name, description, price, category, photo, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            docSnap.id,
            dadosNuvem.name,
            dadosNuvem.description || null,
            Number(dadosNuvem.price) || 0,
            dadosNuvem.category || null,
            dadosNuvem.photo || null,
            dadosNuvem.updatedAt || 0,
          ]
        );
      }
      console.log("=== SALVO NO SQLITE COM SUCESSO ===");
    } else {
      console.log("=== NENHUM DADO NOVO NA NUVEM ===");
    }
  } catch (e) {
    console.log('=== ERRO CRÍTICO NA SINCRONIZAÇÃO ===', e);
  }
}

// ─── Funções de escrita no Firebase ──────────────────────────────────────────

export async function saveProductFirebase(product) {
  try {
    const id = product.id || Date.now().toString();
    const produtoRef = doc(dbFirestore, 'produtos', id);
    await setDoc(produtoRef, {
      name: product.name,
      description: product.description || null,
      price: Number(product.price) || 0,
      category: product.category || null,
      photo: product.photo || null,
      updatedAt: Date.now(),
    });
  } catch (e) {
    console.log('Erro ao salvar produto no Firebase:', e);
    throw e;
  }
}

export async function updateProductFirebase(product) {
  try {
    const produtoRef = doc(dbFirestore, 'produtos', product.id);
    await updateDoc(produtoRef, {
      name: product.name,
      description: product.description || null,
      price: Number(product.price) || 0,
      category: product.category || null,
      photo: product.photo || null,
      updatedAt: Date.now(),
    });
  } catch (e) {
    console.log('Erro ao atualizar produto no Firebase:', e);
    throw e;
  }
}

export async function deleteProductFirebase(id) {
  try {
    const produtoRef = doc(dbFirestore, 'produtos', id);
    await deleteDoc(produtoRef);
  } catch (e) {
    console.log('Erro ao deletar produto no Firebase:', e);
    throw e;
  }
}