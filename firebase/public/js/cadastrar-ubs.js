/* ============================================================
   js/cadastrar-ubs.js  (Cadastrar e Editar UBS)
   ============================================================ */

import {
  collection, addDoc, doc, getDoc, updateDoc, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js';
import { auth, db } from './firebaseConfig.js';

const DIAS = [
  { key: 'seg', label: 'Segunda-feira' },
  { key: 'ter', label: 'Terça-feira'   },
  { key: 'qua', label: 'Quarta-feira'  },
  { key: 'qui', label: 'Quinta-feira'  },
  { key: 'sex', label: 'Sexta-feira'   },
  { key: 'sab', label: 'Sábado'        },
];

const ALL_TIMES = [
  '07:00','07:30','08:00','08:30','09:00','09:30',
  '10:00','10:30','11:00','11:30','12:00','12:30',
  '13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30',
];

const ESPECIALIDADES = [
  'Clínico Geral','Pediatria','Ginecologia','Obstetrícia',
  'Cardiologia','Ortopedia','Dermatologia','Oftalmologia',
  'Psiquiatria','Neurologia','Endocrinologia','Urologia',
  'Gastroenterologia','Pneumologia','Reumatologia','Oncologia',
  'Otorrinolaringologia','Nutrição','Fisioterapia','Psicologia',
];

/* ── Verifica se é edição ou cadastro ── */
const params  = new URLSearchParams(window.location.search);
const editId  = params.get('id'); // ex: cadastrar-ubs.html?id=abc123
const isEdit  = !!editId;

/* ── AUTH ── */
auth.onAuthStateChanged(async (user) => {
  if (!user) { window.location.href = 'loginadmin.html'; return; }

  // Renderiza formulário
  renderEspecGrid();
  renderDiasGrid();

  // Se for edição, carrega os dados da UBS
  if (isEdit) {
    document.getElementById('pageTitle').textContent    = 'Editar UBS';
    document.getElementById('cardTitle').textContent    = 'Editar UBS';
    document.getElementById('btnSalvar').textContent    = 'Salvar Alterações';
    document.getElementById('breadcrumbAtual').textContent = 'Editar UBS';
    await carregarDadosUBS(editId);
  }
});

/* ============================================================
   CARREGAR DADOS PARA EDIÇÃO
   ============================================================ */
async function carregarDadosUBS(id) {
  try {
    const snap = await getDoc(doc(db, 'upas', id));
    if (!snap.exists()) { alert('UBS não encontrada.'); window.location.href = 'admin.html'; return; }

    const u = snap.data();

    // Preenche campos básicos
    document.getElementById('nome').value    = u.nome    || '';
    document.getElementById('codigo').value  = u.codigo  || '';
    document.getElementById('cnes').value    = u.cnes    || '';

    const setSelect = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    };
    setSelect('tipo',    u.tipo);
    setSelect('gestao',  u.gestao);
    setSelect('horario', u.horario);

    // Marca especialidades
    const especSalvas = u.especialidades || [];
    document.querySelectorAll('input[name="espec"]').forEach(cb => {
      cb.checked = especSalvas.includes(cb.value);
    });

    // Marca horários por dia
    const horariosPorDia = u.horariosPorDia || {};
    DIAS.forEach(({ key }) => {
      const horariosDodia = horariosPorDia[key];
      if (!horariosDodia || horariosDodia.length === 0) return;

      // Ativa o dia
      const checkAtivo = document.getElementById(`ativo-${key}`);
      if (checkAtivo) {
        checkAtivo.checked = true;
        toggleDia(key);
      }

      // Marca os horários
      horariosDodia.forEach(t => {
        const cb = document.querySelector(`input[name="${key}"][value="${t}"]`);
        if (cb) { cb.checked = true; }
      });
      atualizarCount(key);
    });

  } catch (err) {
    console.error('Erro ao carregar UBS:', err);
    alert('Erro ao carregar dados da UBS.');
  }
}

/* ============================================================
   RENDERIZAR ESPECIALIDADES
   ============================================================ */
function renderEspecGrid() {
  const grid = document.getElementById('especGrid');
  if (!grid) return;
  grid.innerHTML = ESPECIALIDADES.map(e => `
    <label class="espec-check">
      <input type="checkbox" name="espec" value="${e}">
      <span>${e}</span>
    </label>`).join('');
}

/* ============================================================
   RENDERIZAR DIAS E HORÁRIOS
   ============================================================ */
function renderDiasGrid() {
  const grid = document.getElementById('diasGrid');
  if (!grid) return;
  grid.innerHTML = '';

  DIAS.forEach(({ key, label }) => {
    const card = document.createElement('div');
    card.className = 'dia-card dia-disabled';
    card.id = `card-${key}`;
    card.innerHTML = `
      <div class="dia-header">
        <label>
          <input type="checkbox" id="ativo-${key}" onchange="toggleDia('${key}')">
          ${label}
        </label>
        <span style="font-size:11px;opacity:0.8;" id="count-${key}">0 horários</span>
      </div>
      <div class="horarios-grid" id="horarios-${key}">
        ${ALL_TIMES.map(t => `
          <label class="horario-check">
            <input type="checkbox" name="${key}" value="${t}" onchange="atualizarCount('${key}')">
            ${t}
          </label>`).join('')}
      </div>`;
    grid.appendChild(card);
  });
}

function toggleDia(key) {
  const ativo = document.getElementById(`ativo-${key}`).checked;
  document.getElementById(`card-${key}`).classList.toggle('dia-disabled', !ativo);
  atualizarCount(key);
}

function atualizarCount(key) {
  const n = document.querySelectorAll(`input[name="${key}"]:checked`).length;
  document.getElementById(`count-${key}`).textContent = `${n} horário${n !== 1 ? 's' : ''}`;
}

function cancelar() { window.location.href = 'admin.html'; }

/* ============================================================
   SALVAR (cadastro ou edição)
   ============================================================ */
async function salvar() {
  const nome    = document.getElementById('nome').value.trim();
  const codigo  = document.getElementById('codigo').value.trim();
  const tipo    = document.getElementById('tipo').value;
  const gestao  = document.getElementById('gestao').value;
  const cnes    = document.getElementById('cnes').value.trim();
  const horario = document.getElementById('horario').value;

  if (!nome || !codigo || !tipo || !gestao || !cnes || !horario) {
    alert('Preencha todos os campos obrigatórios.'); return;
  }

  const especialidades = [...document.querySelectorAll('input[name="espec"]:checked')]
    .map(el => el.value);
  if (especialidades.length === 0) {
    alert('Selecione ao menos uma especialidade.'); return;
  }

  const horariosPorDia = {};
  let totalHorarios = 0;
  DIAS.forEach(({ key }) => {
    if (!document.getElementById(`ativo-${key}`).checked) return;
    const selecionados = [...document.querySelectorAll(`input[name="${key}"]:checked`)]
      .map(el => el.value);
    if (selecionados.length > 0) {
      horariosPorDia[key] = selecionados;
      totalHorarios += selecionados.length;
    }
  });

  if (totalHorarios === 0) {
    alert('Selecione ao menos um horário em algum dia da semana.'); return;
  }

  const btn = document.getElementById('btnSalvar');
  btn.disabled = true;
  btn.textContent = isEdit ? 'Salvando...' : 'Salvando...';

  try {
    const dados = { nome, codigo, tipo, gestao, cnes, horario, especialidades, horariosPorDia };

    if (isEdit) {
      // EDIÇÃO — atualiza documento existente
      await updateDoc(doc(db, 'upas', editId), {
        ...dados,
        atualizadoEm:  serverTimestamp(),
        atualizadoPor: auth.currentUser?.email || 'admin'
      });
      alert(`UBS "${nome}" atualizada com sucesso!`);
    } else {
      // CADASTRO — cria novo documento
      await addDoc(collection(db, 'upas'), {
        ...dados,
        criadoEm:  serverTimestamp(),
        criadoPor: auth.currentUser?.email || 'admin'
      });
      alert(`UBS "${nome}" cadastrada com sucesso!`);
    }

    window.location.href = 'admin.html';

  } catch (err) {
    console.error(err);
    alert('Erro ao salvar. Tente novamente.');
    btn.disabled = false;
    btn.textContent = isEdit ? 'Salvar Alterações' : 'Salvar';
  }
}

window.salvar         = salvar;
window.cancelar       = cancelar;
window.toggleDia      = toggleDia;
window.atualizarCount = atualizarCount;