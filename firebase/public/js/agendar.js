/* ============================================================
   Sistema de Agendamento UBS — Santa Maria DF
   js/agendar.js  (Página: Fazer Agendamento)
   ============================================================ */

import {
  collection, getDocs, addDoc, query,
  where, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js';

import {
  signInAnonymously,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js';

import { auth, db }    from './firebaseConfig.js';
import { encryptData } from './crypto.js';

const DIA_KEY = { 0:'dom', 1:'seg', 2:'ter', 3:'qua', 4:'qui', 5:'sex', 6:'sab' };

const MONTHS = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];

let ubsData         = [];
let ubsSelecionada  = null;
let dataSelecionada = null;
let calDate         = new Date();
calDate.setDate(1);

const ANO_ATUAL = new Date().getFullYear();

let ultimoAgendamento = null;
let currentUID        = null;

/* ============================================================
   AUTENTICAÇÃO — resolve uma Promise quando o uid estiver pronto
   Garante que nenhuma query dispara antes do auth estar pronto.
   ============================================================ */
const authReady = new Promise((resolve) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUID = user.uid;
      resolve(user.uid);
    } else {
      try {
        const credential = await signInAnonymously(auth);
        currentUID = credential.user.uid;
        resolve(credential.user.uid);
      } catch (err) {
        console.error('[agendar] Erro ao autenticar anonimamente:', err);
        resolve(null); // deixa continuar, addDoc vai falhar com mensagem clara
      }
    }
  });
});

/* ============================================================
   CARREGAR UBS DO FIRESTORE
   ============================================================ */
async function carregarUBS() {
  const container = document.getElementById('ubsCardContainer');
  if (!container) return;

  container.innerHTML = `
    <div style="grid-column:1/-1;padding:24px;text-align:center;color:var(--text-muted);">
      Carregando unidades...
    </div>`;

  try {
    const snapshot = await getDocs(collection(db, 'upas'));

    if (snapshot.empty) {
      container.innerHTML = `
        <div style="grid-column:1/-1;padding:32px;text-align:center;color:var(--text-muted);">
          Nenhuma UBS disponível para agendamento no momento.
        </div>`;
      return;
    }

    ubsData = [];
    snapshot.forEach(doc => ubsData.push({ id: doc.id, ...doc.data() }));
    renderUBSCards();

  } catch (err) {
    console.error('Erro ao carregar UBS:', err);
    container.innerHTML = `
      <div style="grid-column:1/-1;padding:32px;text-align:center;color:#c0392b;">
        Erro ao carregar unidades. Recarregue a página.
      </div>`;
  }
}

/* ============================================================
   RENDERIZAR CARDS DE UBS
   ============================================================ */
function renderUBSCards() {
  const container = document.getElementById('ubsCardContainer');
  if (!container) return;

  container.innerHTML = '';
  ubsData.forEach((u) => {
    container.innerHTML += `
      <div class="ubs-card" onclick="selectUBS(this, '${u.id}', '${u.nome.replace(/'/g,"\\'")}')">
        <div class="ubs-name">${u.nome}</div>
        <div class="ubs-addr">
          Tipo: ${u.tipo} · Gestão: ${u.gestao}<br>
          CNES: ${u.cnes} · ${u.horario}
        </div>
        <span class="ubs-badge badge-green">⬤ Vagas disponíveis</span>
      </div>`;
  });
}

/* ============================================================
   SELECIONAR UBS
   ============================================================ */
function selectUBS(el, id, nome) {
  document.querySelectorAll('.ubs-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  ubsSelecionada  = { id, nome };
  dataSelecionada = null;

  document.getElementById('hora').innerHTML = '<option value="">Selecione a data primeiro</option>';
  document.getElementById('calendarioWrapper').style.display = 'block';
  document.getElementById('dataSelecionadaLabel').textContent = '';

  const ubs = ubsData.find(u => u.id === id);
  const selEspec = document.getElementById('especialidade');
  selEspec.innerHTML = '<option value="">Selecione...</option>';
  (ubs?.especialidades || []).sort().forEach(e => {
    selEspec.innerHTML += `<option value="${e}">${e}</option>`;
  });

  renderCal();
}

/* ============================================================
   CALENDÁRIO
   ============================================================ */
function renderCal() {
  if (!ubsSelecionada) return;

  const ubs        = ubsData.find(u => u.id === ubsSelecionada.id);
  const diasAtivos = Object.keys(ubs?.horariosPorDia || {});

  document.getElementById('calMonthLabel').textContent =
    `${MONTHS[calDate.getMonth()]} ${calDate.getFullYear()}`;

  const grid      = document.getElementById('calDays');
  grid.innerHTML  = '';

  const firstDay  = new Date(calDate.getFullYear(), calDate.getMonth(), 1).getDay();
  const totalDays = new Date(calDate.getFullYear(), calDate.getMonth() + 1, 0).getDate();
  const today     = new Date();
  today.setHours(0,0,0,0);

  for (let i = 0; i < firstDay; i++) {
    grid.innerHTML += `<div class="cal-day empty"></div>`;
  }

  for (let day = 1; day <= totalDays; day++) {
    const dt      = new Date(calDate.getFullYear(), calDate.getMonth(), day, 12, 0, 0);
    const isPast  = dt < today;
    const diaKey  = DIA_KEY[dt.getDay()];
    const temHora = diasAtivos.includes(diaKey);
    const disabled = isPast || !temHora || calDate.getFullYear() !== ANO_ATUAL;

    const dd    = String(day).padStart(2, '0');
    const mm    = String(calDate.getMonth() + 1).padStart(2, '0');
    const label = `${calDate.getFullYear()}-${mm}-${dd}`;

    let cls = 'cal-day';
    if (disabled)                  cls += ' disabled';
    if (label === dataSelecionada) cls += ' selected';

    const click = !disabled ? `selectDate(this,'${label}')` : '';
    grid.innerHTML += `<div class="${cls}" onclick="${click}">${day}</div>`;
  }
}

function changeMonth(dir) {
  const novaData = new Date(calDate.getFullYear(), calDate.getMonth() + dir, 1);
  if (novaData.getFullYear() !== ANO_ATUAL) return;
  calDate = novaData;
  renderCal();
}

async function selectDate(el, label) {
  document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  dataSelecionada = label;

  const [ano, mes, dia] = label.split('-');
  document.getElementById('dataSelecionadaLabel').textContent = `${dia}/${mes}/${ano}`;

  await carregarHorarios();
}

/* ============================================================
   CARREGAR HORÁRIOS
   Aguarda authReady antes de fazer a query no Firestore.
   Sem isso, a query disparava antes do login anônimo terminar
   e a regra "allow list: if request.auth != null" negava.
   ============================================================ */
async function carregarHorarios() {
  const selectHora = document.getElementById('hora');

  if (!dataSelecionada || !ubsSelecionada) {
    selectHora.innerHTML = '<option value="">Selecione a UBS e a data primeiro</option>';
    return;
  }

  selectHora.innerHTML = '<option value="">Carregando horários...</option>';

  /* ── Garante que o usuário está autenticado antes da query ── */
  await authReady;

  const [ano, mes, dia] = dataSelecionada.split('-').map(Number);
  const dt      = new Date(ano, mes - 1, dia, 12, 0, 0);
  const diaKey  = DIA_KEY[dt.getDay()];

  const ubs             = ubsData.find(u => u.id === ubsSelecionada.id);
  const horariosDoAdmin = (ubs?.horariosPorDia?.[diaKey] || []).sort();

  if (horariosDoAdmin.length === 0) {
    selectHora.innerHTML = '<option value="">Sem horários disponíveis neste dia</option>';
    return;
  }

  try {
    const q = query(
      collection(db, 'agendamentos'),
      where('ubsId',  '==', ubsSelecionada.id),
      where('data',   '==', dataSelecionada),
      where('status', '==', 'ativo')
    );
    const snapshot = await getDocs(q);
    const ocupados = new Set();
    snapshot.forEach(doc => ocupados.add(doc.data().hora));

    selectHora.innerHTML = '<option value="">Selecione...</option>';
    horariosDoAdmin.forEach(t => {
      const ocupado = ocupados.has(t);
      selectHora.innerHTML += `
        <option value="${t}" ${ocupado ? 'disabled' : ''}>
          ${t}${ocupado ? ' — Ocupado' : ''}
        </option>`;
    });
  } catch (err) {
    console.error('[agendar] Erro ao carregar horários:', err);
    selectHora.innerHTML = '<option value="">Erro ao carregar horários</option>';
  }
}

/* ============================================================
   MÁSCARA DE CPF
   ============================================================ */
function maskCPF(el) {
  let v = el.value.replace(/\D/g, '').slice(0, 11);
  if      (v.length > 9) v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  else if (v.length > 6) v = v.replace(/^(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
  else if (v.length > 3) v = v.replace(/^(\d{3})(\d+)/, '$1.$2');
  el.value = v;
}

/* ============================================================
   GERAR PDF DO COMPROVANTE
   ============================================================ */
function gerarPDF(dados) {
  const { nome, cpf, especialidade, ubsNome, data, hora, criadoEm } = dados;
  const [ano, mes, dia] = data.split('-');
  const dataFmt = `${dia}/${mes}/${ano}`;

  const lang = (() => { try { return localStorage.getItem('lang') || 'pt'; } catch(e) { return 'pt'; } })();
  const t = window.translations[lang];

  const html = `
    <!DOCTYPE html>
    <html lang="${document.documentElement.lang || 'pt-BR'}">
    <head>
      <meta charset="UTF-8">
      <title>${t.pdf_title}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Arial, sans-serif; font-size: 13px; color: #222; background: #fff; }
        .page { max-width: 680px; margin: 0 auto; padding: 40px 32px; }
        .header-doc { display:flex; align-items:center; gap:20px; border-bottom: 3px solid #1a3a6b; padding-bottom: 16px; margin-bottom: 24px; }
        .header-doc h1 { font-size: 15px; color: #1a3a6b; line-height: 1.5; }
        .header-doc p  { font-size: 12px; color: #555; margin-top: 4px; }
        .titulo { font-size: 17px; font-weight: 700; color: #1a3a6b; text-align: center; margin-bottom: 6px; }
        .subtitulo { font-size: 12px; color: #777; text-align: center; margin-bottom: 24px; }
        .bloco { border: 1px solid #dde3ec; border-radius: 8px; padding: 16px 20px; margin-bottom: 16px; }
        .bloco-titulo { font-size: 11px; font-weight: 700; color: #1a3a6b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 1px solid #e8eef8; padding-bottom: 6px; }
        .linha { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .linha:last-child { margin-bottom: 0; }
        .label { color: #777; font-size: 12px; }
        .valor { font-weight: 600; font-size: 13px; color: #222; text-align: right; }
        .destaque { background: #e8f4fd; border: 1px solid #b3d9f7; border-radius: 8px; padding: 16px 20px; margin-bottom: 16px; text-align: center; }
        .destaque .data-hora { font-size: 22px; font-weight: 700; color: #1a3a6b; margin-bottom: 4px; }
        .destaque .ubs-nome  { font-size: 14px; color: #555; }
        .aviso { background: #fff8e1; border: 1px solid #ffe082; border-radius: 8px; padding: 12px 16px; font-size: 12px; color: #7a5c00; margin-bottom: 16px; }
        .aviso strong { display: block; margin-bottom: 4px; }
        .footer-doc { border-top: 1px solid #dde3ec; padding-top: 12px; text-align: center; font-size: 11px; color: #999; margin-top: 8px; }
        .status-badge { display:inline-block; background:#27ae60; color:#fff; font-size:12px; font-weight:600; padding:4px 14px; border-radius:20px; margin-bottom:12px; }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="header-doc">
          <div>
            <h1>${t.gov_secao}<br>${t.main_title}</h1>
            <p>${t.subtitle}</p>
          </div>
        </div>
        <div class="titulo">${t.pdf_title}</div>
        <div class="subtitulo">${t.pdf_generated} ${criadoEm}</div>
        <span class="status-badge">${t.pdf_confirmed}</span>
        <div class="destaque">
          <div class="data-hora">${dataFmt} · ${hora}</div>
          <div class="ubs-nome">${ubsNome}</div>
        </div>
        <div class="bloco">
          <div class="bloco-titulo">${t.pdf_patient_data}</div>
          <div class="linha">
            <span class="label">${t.pdf_full_name}</span>
            <span class="valor">${nome}</span>
          </div>
          <div class="linha">
            <span class="label">CPF</span>
            <span class="valor">${cpf}</span>
          </div>
        </div>
        <div class="bloco">
          <div class="bloco-titulo">${t.pdf_consult_data}</div>
          <div class="linha">
            <span class="label">${t.pdf_health_unit}</span>
            <span class="valor">${ubsNome}</span>
          </div>
          <div class="linha">
            <span class="label">${t.pdf_specialty}</span>
            <span class="valor">${especialidade}</span>
          </div>
          <div class="linha">
            <span class="label">${t.pdf_date}</span>
            <span class="valor">${dataFmt}</span>
          </div>
          <div class="linha">
            <span class="label">${t.pdf_time}</span>
            <span class="valor">${hora}</span>
          </div>
        </div>
        <div class="aviso">
          <strong>${t.pdf_important}</strong>
          ${t.pdf_notice}
        </div>
        <div class="footer-doc">
          ${t.pdf_footer}<br>
          ${t.footer_rights}
        </div>
      </div>
    </body>
    </html>`;

  const janela = window.open('', '_blank', 'width=780,height=900');
  janela.document.write(html);
  janela.document.close();
  janela.onload = () => janela.print();
}

/* ============================================================
   CONFIRMAR AGENDAMENTO
   ============================================================ */
async function confirmarAgendamento() {
  const ubs           = ubsSelecionada;
  const data          = dataSelecionada;
  const hora          = document.getElementById('hora').value;
  const nome          = document.getElementById('nome').value.trim();
  const cpf           = document.getElementById('cpf').value.trim();
  const especialidade = document.getElementById('especialidade').value;

  if (!ubs)                                { alert('Selecione uma UBS.');        return; }
  if (!data)                               { alert('Selecione uma data.');        return; }
  if (!hora)                               { alert('Selecione um horário.');      return; }
  if (!nome || !cpf || !especialidade)     { alert('Preencha todos os campos.'); return; }
  if (cpf.replace(/\D/g,'').length !== 11) { alert('CPF inválido.');             return; }

  /* ── Garante UID ── */
  const uid = await authReady;
  if (!uid) {
    alert('Erro de autenticação. Recarregue a página e tente novamente.');
    return;
  }

  const btn = document.querySelector('.btn-primary');
  btn.disabled    = true;
  btn.textContent = 'Salvando...';

  try {
    /* Verifica se horário ainda está livre */
    const q = query(
      collection(db, 'agendamentos'),
      where('ubsId',  '==', ubs.id),
      where('data',   '==', data),
      where('hora',   '==', hora),
      where('status', '==', 'ativo')
    );
    const check = await getDocs(q);
    if (!check.empty) {
      alert('Este horário foi ocupado agora. Escolha outro horário.');
      await carregarHorarios();
      btn.disabled    = false;
      btn.textContent = 'Confirmar agendamento';
      return;
    }

    /* Cifra o CPF */
    const cpfDigitos = cpf.replace(/\D/g, '');
    const cpfCifrado = await encryptData(cpfDigitos);

    const agora    = new Date();
    const criadoEm = agora.toLocaleString('pt-BR');
    const protocolo = 'AGD-' + Date.now().toString(36).toUpperCase();

    await addDoc(collection(db, 'agendamentos'), {
      ubsId:        ubs.id,
      ubsNome:      ubs.nome,
      data,
      hora,
      nome,
      cpfCifrado,
      especialidade,
      protocolo,
      status:       'ativo',
      uid,
      criadoEm:     serverTimestamp()
    });

    ultimoAgendamento = { nome, cpf, especialidade, ubsNome: ubs.nome, data, hora, protocolo, criadoEm };

    document.getElementById('sucessoArea').style.display    = 'block';
    document.getElementById('formularioArea').style.display = 'none';

  } catch (err) {
    console.error('Erro ao agendar:', err);
    alert('Erro ao realizar agendamento. Tente novamente.');
    btn.disabled    = false;
    btn.textContent = 'Confirmar agendamento';
  }
}

/* ── BAIXAR COMPROVANTE ── */
function baixarComprovante() {
  if (ultimoAgendamento) gerarPDF(ultimoAgendamento);
}

/* ── NOVO AGENDAMENTO ── */
function novoAgendamento() {
  ultimoAgendamento = null;
  document.getElementById('sucessoArea').style.display   = 'none';
  document.getElementById('formularioArea').style.display = 'block';

  document.getElementById('nome').value          = '';
  document.getElementById('cpf').value           = '';
  document.getElementById('hora').innerHTML      = '<option value="">Selecione a UBS e a data primeiro</option>';
  document.getElementById('especialidade').value = '';
  document.getElementById('calendarioWrapper').style.display = 'none';
  document.getElementById('dataSelecionadaLabel').textContent = '';
  document.querySelectorAll('.ubs-card').forEach(c => c.classList.remove('selected'));
  ubsSelecionada  = null;
  dataSelecionada = null;
}

/* ── EXPÕE FUNÇÕES PARA O HTML ── */
window.selectUBS            = selectUBS;
window.selectDate           = selectDate;
window.changeMonth          = changeMonth;
window.maskCPF              = maskCPF;
window.confirmarAgendamento = confirmarAgendamento;
window.baixarComprovante    = baixarComprovante;
window.novoAgendamento      = novoAgendamento;

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  carregarUBS();
});