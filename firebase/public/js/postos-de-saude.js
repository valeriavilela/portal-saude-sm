/* ============================================================
   Sistema de Agendamento UBS — Santa Maria DF
   js/postos-de-saude.js  (Página: Postos de Saúde)
   
   DESCRIÇÃO: Arquivo que carrega e exibe a lista de todas as 
   Unidades Básicas de Saúde (UBS) cadastradas no sistema.
   ============================================================ */

// ━━ IMPORTAÇÕES ━━
// Importa funções para ler dados da coleção do Firestore
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js';

// Importa a instância do banco de dados Firestore
import { db } from './firebaseConfig.js';

/* ════════════════════════════════════════════════════════════
   FUNÇÃO: RENDERIZAR LISTA DE UBS
   
   Descrição: Busca todas as UBS do Firestore e exibe-as em uma 
   lista formatada na página.
   
   Processo:
   1. Busca a coleção "upas" no Firestore
   2. Formata os dados com número sequencial
   3. Exibe nome, tipo, gestão, CNES e horário de cada UBS
   ════════════════════════════════════════════════════════════ */
async function renderUBSList() {
  // Pega o elemento container onde a lista de UBS será exibida
  const container = document.getElementById('ubs-info-list');
  
  // Se o container não existe, retorna sem fazer nada
  if (!container) return;

  // ━━ EXIBIR MENSAGEM DE CARREGAMENTO ━━
  // Mostra um spinner/mensagem enquanto busca os dados do Firestore
  container.innerHTML = `
    <div class="card-body" style="text-align:center;padding:32px;color:var(--text-muted);">
      Carregando unidades...
    </div>`;

  // ━━ BUSCAR DADOS ━━
  try {
    // Busca todos os documentos da coleção "upas" do Firestore
    const snapshot = await getDocs(collection(db, 'upas'));

    // ━━ VALIDAÇÃO ━━
    // Se a coleção está vazia, mostra mensagem
    if (snapshot.empty) {
      container.innerHTML = `
        <div class="notice" style="margin:16px;">
          <span>Nenhuma UBS cadastrada no momento. Entre em contato com a administração.</span>
        </div>`;
      
      // Retorna sem continuar
      return;
    }

    // ━━ LIMPAR CONTAINER ━━
    // Remove o conteúdo anterior (spinner de carregamento)
    container.innerHTML = '';
    
    // Variável para numerar as UBS sequencialmente (1, 2, 3, ...)
    let i = 1;
    
    // ━━ ITERAR SOBRE CADA UBS ━━
    // Para cada documento da coleção
    snapshot.forEach(docSnap => {
      // Extrai os dados do documento
      const u = docSnap.data();
      
      // ━━ CONSTRUIR HTML DA UBS ━━
      // Monta uma linha com as informações da UBS
      container.innerHTML += `
        <div class="ubs-info-row">
          <!-- Número sequencial da UBS -->
          <div class="ubs-num">${i++}</div>
          
          <!-- Informações da UBS -->
          <div>
            <!-- Nome da UBS em destaque -->
            <div style="font-size:14px;font-weight:600;color:var(--text-main);margin-bottom:4px;">
              ${u.nome}
            </div>
            
            <!-- Detalhes da UBS (sigla, tipo, gestão, etc) -->
            <div style="font-size:13px;color:var(--text-muted);line-height:1.7;">
              Sigla: ${u.codigo} · Tipo: ${u.tipo}<br>
              Gestão: ${u.gestao} · CNES: ${u.cnes}<br>
              Horário: ${u.horario}
            </div>
            
            <!-- Badge indicando disponibilidade -->
            <span class="ubs-badge badge-green" style="margin-top:6px;">⬤ Vagas disponíveis</span>
          </div>
        </div>`;
    });

  } catch (err) {
    // ━━ TRATAMENTO DE ERRO ━━
    // Se houver erro ao buscar os dados do Firestore
    
    // Registra o erro no console para debugging
    console.error('Erro ao carregar postos:', err);
    
    // Exibe mensagem de erro na tela
    container.innerHTML = `
      <div class="notice" style="margin:16px;">
        <span style="color:#c0392b;">Erro ao carregar postos de saúde. Recarregue a página.</span>
      </div>`;
  }
}

/* ════════════════════════════════════════════════════════════
   INICIALIZAÇÃO
   ════════════════════════════════════════════════════════════ */

// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {
  // Chama a função para renderizar a lista de UBS quando a página carrega
  renderUBSList();
});