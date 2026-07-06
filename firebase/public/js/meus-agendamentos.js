/* ============================================================
   Sistema de Agendamento UBS — Santa Maria DF
   js/meus-agendamentos.js  (Página: Meus Agendamentos)

   ALTERAÇÕES EM RELAÇÃO À VERSÃO ANTERIOR:
   ─────────────────────────────────────────
   1. Import de onAuthStateChanged e signInAnonymously.
      O usuário precisa estar autenticado para que as novas
      regras do Firestore permitam a leitura do próprio
      documento (resource.data.uid == request.auth.uid).

   2. A query de busca agora filtra por UID além do CPF cifrado:
        where('uid', '==', currentUID)
      Isso garante que, mesmo sem as regras no servidor (em caso
      de configuração temporária mais permissiva), a aplicação
      só exiba os documentos do usuário atual.

   3. Import de decryptData (crypto.js) para descriptografar o
      campo cpfCifrado ao exibir os agendamentos.
      O CPF descriptografado é formatado (XXX.XXX.XXX-XX) para
      exibição; o valor cifrado nunca aparece na UI.

   4. Compatibilidade com documentos legados:
      decryptData() retorna o valor original se não encontrar
      o separador "|" — documentos antigos continuam visíveis.

   5. Fluxo de busca: o usuário digita o CPF → o sistema
      CIFRA o CPF digitado e compara com cpfCifrado no Firestore.
      ⚠ PROBLEMA IMPORTANTE:
        AES-GCM usa IV aleatório, então dois cifrados do mesmo
        CPF são diferentes. Não é possível fazer WHERE cpfCifrado
        == <valor cifrado agora>.

      SOLUÇÃO ADOTADA (client-side, dado que não há backend):
        • O usuário digita o CPF.
        • A query filtra por uid (o usuário vê apenas os seus).
        • Do lado do cliente, decripta cada documento e compara
          o CPF em texto claro com o digitado.
        • Isso mantém o CPF fora do Firestore em texto puro e
          é adequado para volumes pequenos (pacientes individuais
          têm poucos agendamentos).

      ALTERNATIVA COM BACKEND:
        • Firebase Function recebe o CPF, faz query no servidor
          com um HMAC determinístico (cpfHMAC) como índice.
        • O HMAC é calculado com chave secreta no servidor.
        • O cliente NUNCA vê o HMAC nem a chave.
   ============================================================ */

import {
  collection, query, where, getDocs,
  doc, updateDoc
} from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js';

import {
  onAuthStateChanged,
  signInAnonymously
} from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js';

import { auth, db }    from './firebaseConfig.js';
import { decryptData } from './crypto.js';

const MONTHS = [
  'JAN','FEV','MAR','ABR','MAI','JUN',
  'JUL','AGO','SET','OUT','NOV','DEZ'
];

/* ── UID DO USUÁRIO AUTENTICADO ── */
let currentUID = null;

/* ── Inicializa auth anônima ── */
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUID = user.uid;
  } else {
    try {
      const cred = await signInAnonymously(auth);
      currentUID = cred.user.uid;
    } catch (err) {
      console.error('[meus-agendamentos] Erro ao autenticar:', err);
    }
  }
});

/* ============================================================
   VERIFICA SE AINDA PODE CANCELAR (até 24h antes)
   ============================================================ */
function podeCancelar(data, hora, status) {
  if (status !== 'ativo') return false;

  const [ano, mes, dia] = data.split('-').map(Number);
  const [h, m]          = hora.split(':').map(Number);
  const dtAgendamento   = new Date(ano, mes - 1, dia, h, m, 0);
  const limite          = new Date(dtAgendamento.getTime() - 24 * 60 * 60 * 1000);

  return new Date() <= limite;
}

/* ── Formata CPF puro (11 dígitos) para XXX.XXX.XXX-XX ── */
function formatarCPF(cpfDigitos) {
  if (!cpfDigitos || cpfDigitos.length < 11) return cpfDigitos || '—';
  return cpfDigitos.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

/* ============================================================
   BUSCAR AGENDAMENTOS POR CPF
   ─────────────────────────────
   Estratégia:
   1. Busca os documentos do uid do usuário autenticado.
   2. Para cada documento, descriptografa cpfCifrado.
   3. Compara o CPF descriptografado com o digitado.
   4. Renderiza apenas os que correspondem.
   ============================================================ */
async function buscarAgendamentos() {
  const cpfInput = document.getElementById('cpfBusca');
  if (!cpfInput) return;

  const cpfDigitado = cpfInput.value.replace(/\D/g, '');

  if (cpfDigitado.length !== 11) {
    alert('Digite um CPF válido com 11 dígitos.');
    return;
  }

  /* ── Garante UID ── */
  if (!currentUID) {
    try {
      const cred = await signInAnonymously(auth);
      currentUID = cred.user.uid;
    } catch (err) {
      alert('Erro de autenticação. Recarregue a página.');
      return;
    }
  }

  const container = document.getElementById('myAgendContainer');
  container.innerHTML = `
    <div style="text-align:center;padding:32px;color:var(--text-muted);font-size:14px;">
      Buscando agendamentos...
    </div>`;

  try {
    /* ── Query filtra pelo UID do usuário autenticado ── */
    const q        = query(
      collection(db, 'agendamentos'),
      where('uid', '==', currentUID)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      container.innerHTML = `
        <div style="text-align:center;padding:32px;color:var(--text-muted);font-size:14px;">
          Nenhum agendamento encontrado para este CPF.
        </div>`;
      return;
    }

    /* ── Descriptografa e filtra por CPF ── */
    const agendamentos = [];
    for (const d of snapshot.docs) {
      const data = d.data();

      /* Descriptografa cpfCifrado */
      let cpfDecriptado = null;
      if (data.cpfCifrado) {
        cpfDecriptado = await decryptData(data.cpfCifrado);
      } else if (data.cpf) {
        /* Compatibilidade com documentos legados (texto puro) */
        cpfDecriptado = data.cpf;
      }

      /* Filtra pelo CPF digitado */
      if (cpfDecriptado && cpfDecriptado.replace(/\D/g,'') === cpfDigitado) {
        agendamentos.push({
          id: d.id,
          ...data,
          _cpfDecriptado: cpfDecriptado  // apenas em memória
        });
      }
    }

    agendamentos.sort((a, b) => (a.data > b.data ? -1 : 1));

    if (agendamentos.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:32px;color:var(--text-muted);font-size:14px;">
          Nenhum agendamento encontrado para este CPF.
        </div>`;
      return;
    }

    container.innerHTML = '';
    agendamentos.forEach(a => {
      const [ano, mes, dia] = a.data.split('-');
      const monthName       = MONTHS[parseInt(mes) - 1] || '';

      let statusClass = 'status-confirmed';
      let statusText  = 'Confirmado';
      if (a.status === 'cancelado') { statusClass = 'status-cancelled'; statusText = 'Cancelado'; }
      else if (a.status === 'realizado') { statusClass = 'status-done'; statusText = 'Realizado'; }

      const podeCanc = podeCancelar(a.data, a.hora, a.status);

      let avisoCanc = '';
      if (a.status === 'ativo') {
        const [h, m]  = a.hora.split(':').map(Number);
        const dtAgend = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia), h, m, 0);
        const limite  = new Date(dtAgend.getTime() - 24 * 60 * 60 * 1000);
        const agora   = new Date();

        if (agora > limite) {
          avisoCanc = `<div style="font-size:11px;color:#e74c3c;margin-top:4px;">
                         Prazo de cancelamento encerrado
                       </div>`;
        } else {
          const diffMs  = limite - agora;
          const diffH   = Math.floor(diffMs / (1000 * 60 * 60));
          const diffMin = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          avisoCanc = `<div style="font-size:11px;color:#27ae60;margin-top:4px;">
                         Cancelamento disponível por mais ${diffH}h ${diffMin}min
                       </div>`;
        }
      }

      container.innerHTML += `
        <div class="myagend-item">
          <div class="myagend-date">
            <div class="day">${dia}</div>
            <div class="month">${monthName}</div>
          </div>
          <div class="myagend-info">
            <h4>${a.ubsNome || 'UBS'}</h4>
            <p>
              ${a.especialidade || 'Consulta'}<br>
              Horário: ${a.hora || '--'} · Protocolo: <strong>${a.protocolo || '--'}</strong>
            </p>
            ${avisoCanc}
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
            <span class="status-badge ${statusClass}">${statusText}</span>
            ${podeCanc
              ? `<button class="btn btn-cancel" style="font-size:12px;padding:4px 10px;"
                   onclick="cancelarAgendamento('${a.id}', '${a.protocolo}')">
                   Cancelar
                 </button>`
              : ''}
          </div>
        </div>`;
    });

  } catch (err) {
    console.error('Erro ao buscar agendamentos:', err);
    container.innerHTML = `
      <div style="text-align:center;padding:32px;color:#c0392b;font-size:14px;">
        Erro ao buscar agendamentos. Tente novamente.
      </div>`;
  }
}

/* ============================================================
   CANCELAR AGENDAMENTO
   As novas regras do Firestore permitem update apenas quando
   request.auth.uid == resource.data.uid, portanto o usuário
   precisa estar com o mesmo UID da sessão em que agendou.
   ============================================================ */
async function cancelarAgendamento(id, protocolo) {
  if (!confirm(`Deseja cancelar o agendamento ${protocolo}?\n\nEsta ação não pode ser desfeita.`)) return;

  try {
    await updateDoc(doc(db, 'agendamentos', id), {
      status: 'cancelado',
      canceladoEm: new Date().toISOString()
    });
    alert('Agendamento cancelado com sucesso.');
    buscarAgendamentos();
  } catch (err) {
    console.error('Erro ao cancelar:', err);
    alert('Erro ao cancelar. Tente novamente.');
  }
}

/* ── MÁSCARA DE CPF ── */
function maskCPF(el) {
  let v = el.value.replace(/\D/g, '').slice(0, 11);
  if      (v.length > 9) v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  else if (v.length > 6) v = v.replace(/^(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
  else if (v.length > 3) v = v.replace(/^(\d{3})(\d+)/, '$1.$2');
  el.value = v;
}

/* ── EXPÕE FUNÇÕES PARA O HTML ── */
window.buscarAgendamentos  = buscarAgendamentos;
window.cancelarAgendamento = cancelarAgendamento;
window.maskCPF             = maskCPF;

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('cpfBusca');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') buscarAgendamentos();
    });
  }
});