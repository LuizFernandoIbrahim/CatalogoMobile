import { getDatabase } from './banco';
import NetInfo from '@react-native-community/netinfo';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { dbFirestore } from './firebase'; // Certifique-se de criar o firebase.js nesta pasta

// Função auxiliar para garantir que a coluna updatedAt existe (evita quebrar se a tabela já existia)
async function atualizarEstruturaTabela(db) {
  try {
    await db.runAsync('ALTER TABLE products ADD COLUMN updatedAt INTEGER DEFAULT 0');
  } catch {
    // Se a coluna já existir, o SQLite joga um erro e nós apenas ignoramos
  }
}

export async function getProducts() {
  try {
    const db = await getDatabase();
    await atualizarEstruturaTabela(db); // Garante a estrutura correta
    return await db.getAllAsync(
      'SELECT * FROM products ORDER BY name ASC'
    );
  } catch {
    return [];
  }
}

// FUNÇÃO DE SINCRONIZAÇÃO: Puxa dados do Firebase e joga no SQLite
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

    // Descobre o timestamp do produto mais recente armazenado localmente
    const resultado = await db.getFirstAsync(
      'SELECT MAX(updatedAt) as max_date FROM products'
    );
    const ultimaAtualizacaoLocal = resultado?.max_date || 0;
    console.log("=== ULTIMA ATUALIZACAO LOCAL (SQLite) ===", ultimaAtualizacaoLocal);

    // Ajustado para "produtos" para bater exatamente com o seu print do painel do Firestore
    const produtosRef = collection(dbFirestore, "produtos"); 
    const q = query(produtosRef, where("updatedAt", ">", ultimaAtualizacaoLocal));
    
    console.log("=== DISPARANDO QUERY NO FIREBASE ===");
    const querySnapshot = await getDocs(q);

    console.log("=== DOCUMENTOS ENCONTRADOS NO FIREBASE ===", querySnapshot.size);

    if (!querySnapshot.empty) {
      for (const doc of querySnapshot.docs) {
        const dadosNuvem = doc.data();
        console.log("=== DADO QUE VEIO DA NUVEM ===", dadosNuvem);
        
        // INSERT OR REPLACE atualiza o produto se o ID já existir, ou cria se for novo
        await db.runAsync(
          `INSERT OR REPLACE INTO products (id, name, description, price, category, photo, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            doc.id, // ID único gerado pelo Firestore
            dadosNuvem.name,
            dadosNuvem.description || null,
            Number(dadosNuvem.price) || 0,
            dadosNuvem.category || null,
            dadosNuvem.photo || null,
            dadosNuvem.updatedAt || 0
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

export async function saveProduct(product) {
  try {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO products (id, name, description, price, category, photo, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        product.id || Date.now().toString(), // Aceita o ID se já vem da nuvem
        product.name,
        product.description || null,
        Number(product.price) || 0,
        product.category || null,
        product.photo || null,
        Date.now() // Define o timestamp atual
      ]
    );
  } catch (e) {
    console.log('Erro ao salvar produto:', e);
  }
}

export async function updateProduct(product) {
  try {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE products
       SET name = ?, description = ?, price = ?, category = ?, photo = ?, updatedAt = ?
       WHERE id = ?`,
      [
        product.name,
        product.description || null,
        Number(product.price) || 0,
        product.category || null,
        product.photo || null,
        Date.now(),
        product.id,
      ]
    );
  } catch (e) {
    console.log('Erro ao atualizar produto:', e);
  }
}

export async function deleteProduct(id) {
  try {
    const db = await getDatabase();
    await db.runAsync(
      'DELETE FROM products WHERE id = ?', [id]
    );
  } catch (e) {
    console.log('Erro ao deletar produto:', e);
  }
}