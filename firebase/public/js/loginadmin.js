/* ============================================================
   Sistema de Agendamento UBS — Santa Maria DF
   js/loginadmin.js  (Página: Login Admin)
   
   DESCRIÇÃO: Arquivo que gerencia o login de administradores.
   Verifica credenciais no Firebase Auth e valida permissões.
   ============================================================ */

// ━━ IMPORTAÇÕES ━━
// Importa função para fazer login com email e senha no Firebase
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js';

// Importa funções para acessar documentos do Firestore
import { doc, getDoc }               from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js';

// Importa as instâncias de auth e db configuradas
import { auth, db }                  from './firebaseConfig.js';

/* ════════════════════════════════════════════════════════════
   FUNÇÃO: FAZER LOGIN
   
   Lógica:
   1. Pega email e senha do formulário
   2. Autentica no Firebase Auth
   3. Verifica se o email existe na coleção "admins" do Firestore
   4. Se for admin, salva sessão e redireciona para admin.html
   5. Se não for admin, faz logout e mostra erro
   ════════════════════════════════════════════════════════════ */
async function fazerLogin() {
  // Pega o valor do input de email e remove espaços em branco
  const email = document.getElementById('login_email').value.trim();
  
  // Pega o valor do input de senha (sem trim, pois senha pode ter espaços)
  const senha  = document.getElementById('login_senha').value;
  
  // Pega o elemento div onde os erros serão exibidos
  const erroEl = document.getElementById('login_erro');

  // Esconde qualquer erro anterior que possa estar visível
  erroEl.style.display = 'none';

  // ━━ VALIDAÇÃO ━━
  // Se email ou senha estão vazios, mostra erro e retorna
  if (!email || !senha) {
    mostrarErro('Preencha o e-mail e a senha.');
    return;
  }

  // ━━ AUTENTICAÇÃO ━━
  try {
    // 1. Faz login no Firebase Auth com email e senha
    // signInWithEmailAndPassword retorna um objeto com a credencial do usuário
    const credential = await signInWithEmailAndPassword(auth, email, senha);
    
    // Extrai o objeto "user" da credencial (contém uid, email, etc)
    const user = credential.user;

    // ━━ VERIFICAÇÃO DE PERMISSÕES ━━
    // 2. Verifica se o email está registrado como admin no Firestore
    // Tenta buscar o documento na coleção "admins" usando o email como ID
    const adminDoc = await getDoc(doc(db, 'admins', user.email));

    // ━━ CONTROLE DE ACESSO ━━
    // Se o documento não existe, significa que o email não é admin
    if (!adminDoc.exists()) {
      // Faz logout no Firebase para remover a sessão de autenticação
      await auth.signOut();
      
      // Mostra mensagem de erro informando que não tem permissão
      mostrarErro('Acesso negado. Este e-mail não tem permissão de administrador.');
      
      // Retorna para não continuar o fluxo
      return;
    }

    // ━━ SALVANDO SESSÃO ━━
    // 3. Se chegou aqui, é um admin válido. Salva informações na sessionStorage
    // sessionStorage é um armazenamento que funciona apenas enquanto a aba está aberta
    
    // Flag indicando que um admin está logado
    sessionStorage.setItem('adminLogado', 'true');
    
    // UID do usuário autenticado no Firebase
    sessionStorage.setItem('adminUID',    user.uid);
    
    // Email do usuário autenticado
    sessionStorage.setItem('adminEmail',  user.email);

    // ━━ REDIRECIONAMENTO ━━
    // Redireciona para a página do painel administrativo
    window.location.href = 'admin.html';

  } catch (error) {
    // Se ocorrer qualquer erro, cai neste bloco
    
    // Registra o erro no console para debugging
    console.error('Erro no login:', error.code);

    // ━━ MENSAGENS DE ERRO PERSONALIZADAS ━━
    // Diferentes tipos de erro recebem mensagens diferentes
    
    if (
      error.code === 'auth/user-not-found'  ||  // Email não existe no Firebase
      error.code === 'auth/wrong-password'  ||  // Senha incorreta
      error.code === 'auth/invalid-credential'  // Credencial inválida (Firebase 9+)
    ) {
      mostrarErro('E-mail ou senha incorretos. Tente novamente.');
    } else if (error.code === 'auth/too-many-requests') {
      // Muitas tentativas de login falhadas ativa proteção
      mostrarErro('Muitas tentativas. Aguarde alguns minutos e tente novamente.');
    } else {
      // Qualquer outro erro genérico
      mostrarErro('Erro ao fazer login. Tente novamente.');
    }
  }
}

/* ════════════════════════════════════════════════════════════
   FUNÇÃO: MOSTRAR ERRO
   
   Descrição: Exibe uma mensagem de erro na tela para o usuário
   ════════════════════════════════════════════════════════════ */
function mostrarErro(msg) {
  // Pega o elemento div onde os erros são exibidos
  const erroEl = document.getElementById('login_erro');
  
  // Atribui o texto da mensagem de erro ao conteúdo do div
  erroEl.textContent = msg;
  
  // Mostra o div (muda display de none para block)
  erroEl.style.display = 'block';
}

/* ════════════════════════════════════════════════════════════
   INICIALIZAÇÃO - Event Listeners
   ════════════════════════════════════════════════════════════ */

// Aguarda o DOM estar completamente carregado antes de adicionar listeners
document.addEventListener('DOMContentLoaded', () => {
  // ━━ PERMITIR LOGIN AO PRESSIONAR ENTER NA SENHA ━━
  // Quando o usuário pressiona Enter no campo de senha, chama fazerLogin()
  document.getElementById('login_senha').addEventListener('keydown', (e) => {
    // Se a tecla pressionada é "Enter"
    if (e.key === 'Enter') {
      // Executa a função de login
      fazerLogin();
    }
  });
  
  // ━━ PERMITIR LOGIN AO PRESSIONAR ENTER NO EMAIL ━━
  // Mesma lógica para o campo de email (usabilidade)
  document.getElementById('login_email').addEventListener('keydown', (e) => {
    // Se a tecla pressionada é "Enter"
    if (e.key === 'Enter') {
      // Executa a função de login
      fazerLogin();
    }
  });
});

// ━━ EXPORTAÇÃO GLOBAL ━━
// Expõe a função fazerLogin para o escopo global para que o onclick do HTML possa chamar
window.fazerLogin = fazerLogin;