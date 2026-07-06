/* ============================================================
   js/firebaseConfig.js
   
   ARQUIVO DE CONFIGURAÇÃO DO FIREBASE
   Este arquivo centraliza a configuração do Firebase e exporta 
   os serviços utilizados por todo o sistema.
   ============================================================ */

// ━━ IMPORTAÇÕES ━━
// Importa a função para inicializar a aplicação Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js';

// Importa a função para obter a instância de autenticação Firebase
import { getAuth }       from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js';

// Importa a função para obter a instância do Firestore (banco de dados)
import { getFirestore }  from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js';

// ━━ CONFIGURAÇÃO DO FIREBASE ━━
// Objeto contendo as credenciais da aplicação Firebase
// Estas chaves são públicas e específicas do projeto "portalsaudesm"
const firebaseConfig = {
  apiKey:            "AIzaSyDgY9tKtCrFX3A52UXiX2Ai-TTLQ9SPx9M",      // Chave API do projeto
  authDomain:        "portalsaudesm.firebaseapp.com",                 // Domínio de autenticação
  databaseURL:       "https://portalsaudesm-default-rtdb.firebaseio.com", // URL do banco de dados (Realtime DB, não usado aqui)
  projectId:         "portalsaudesm",                                   // ID único do projeto Firebase
  storageBucket:     "portalsaudesm.firebasestorage.app",            // Bucket do Firebase Storage (para arquivos, não usado aqui)
  messagingSenderId: "1066556475359",                                 // ID para Cloud Messaging (não usado aqui)
  appId:             "1:1066556475359:web:5cff04e87c73ef9d99666a"   // ID único da app web
};

// ━━ INICIALIZAÇÃO ━━
// Inicializa a aplicação Firebase com as credenciais acima
// Retorna uma instância da app que será usada para auth e db
const app = initializeApp(firebaseConfig);

// ━━ EXPORTAÇÕES ━━
// Exporta a instância de autenticação para ser usada em todo o projeto
// Permite fazer login, logout, gerenciar sessões, etc.
export const auth = getAuth(app);

// Exporta a instância do Firestore para acesso ao banco de dados
// Permite ler, escrever, atualizar e deletar documentos
export const db   = getFirestore(app);