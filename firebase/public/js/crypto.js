/* ============================================================
   js/crypto.js
   Módulo de Criptografia — Portal Saúde SM
   Algoritmo: AES-GCM 256-bit via Web Crypto API (nativa)

   ⚠ AVISO DE SEGURANÇA — LEIA ANTES DE USAR EM PRODUÇÃO:
   ──────────────────────────────────────────────────────────
   A chave definida em CRYPTO_KEY_HEX fica no código-fonte do
   cliente (JavaScript público). Qualquer pessoa que inspecionar
   o bundle JS consegue extraí-la e descriptografar os CPFs.

   Isso NÃO atende plenamente à LGPD para dados sensíveis em
   produção, mas é uma melhoria significativa em relação ao
   armazenamento em texto puro, pois:
     • Dificulta varreduras automatizadas no Firestore.
     • Impede acesso acidental via console do Firebase.
     • Demonstra intenção de proteção (relevante para auditorias).

   ALTERNATIVA SEGURA PARA PRODUÇÃO:
   ──────────────────────────────────
   Use Firebase Functions (backend) para cifrar/decifrar o CPF
   no servidor, onde a chave fica em variáveis de ambiente
   (firebase functions:config:set crypto.key="...") e nunca
   é exposta ao cliente. O fluxo seria:

     Cliente → chama HTTPS Callable Function com CPF em texto claro
     Function → cifra CPF com chave do servidor → salva no Firestore
     Function → descriptografa CPF antes de retornar ao admin

   Enquanto o backend não está implementado, use este módulo
   como camada de ofuscação de baixo custo.
   ============================================================ */

'use strict';

/* ── CHAVE DE 256 BITS EM HEX ──────────────────────────────
   Gere uma chave forte antes de implantar:
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   Substitua o valor abaixo pelo gerado e não versione este
   arquivo em repositórios públicos (adicione ao .gitignore).
   ─────────────────────────────────────────────────────────── */
const CRYPTO_KEY_HEX =
  'a3f8c2e1d94b7065f2318ae6c041b9d57e8f0a4c6b23d1e985740236f1c9a8b2';

/* ── IMPORTA A CHAVE UMA VEZ (lazy singleton) ── */
let _cachedKey = null;

async function _getKey() {
  if (_cachedKey) return _cachedKey;

  const keyBytes = hexToBytes(CRYPTO_KEY_HEX);
  _cachedKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,          // não exportável no contexto JS
    ['encrypt', 'decrypt']
  );
  return _cachedKey;
}

/* ── AUXILIARES ── */

/** Converte string hex → Uint8Array */
function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

/** Converte Uint8Array → string Base64 (safe para Firestore) */
function bytesToBase64(bytes) {
  return btoa(String.fromCharCode(...bytes));
}

/** Converte string Base64 → Uint8Array */
function base64ToBytes(b64) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

/* ============================================================
   encryptData(plaintext)
   ──────────────────────
   Recebe o CPF em texto claro (somente dígitos recomendado).
   Retorna uma string Base64 no formato  <IV_12bytes>|<ciphertext>
   que é segura para armazenar como campo string no Firestore.

   AES-GCM gera um IV aleatório de 12 bytes a cada cifração,
   garantindo que dois CPFs iguais produzam textos cifrados
   diferentes (proteção contra ataques de comparação).
   ============================================================ */
export async function encryptData(plaintext) {
  if (!plaintext) return '';

  try {
    const key       = await _getKey();
    const iv        = crypto.getRandomValues(new Uint8Array(12)); // 96 bits — padrão GCM
    const encoded   = new TextEncoder().encode(plaintext);

    const cipherBuf = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    // Empacota IV + ciphertext em Base64 separados por "|"
    const ivB64     = bytesToBase64(iv);
    const cipherB64 = bytesToBase64(new Uint8Array(cipherBuf));
    return `${ivB64}|${cipherB64}`;

  } catch (err) {
    console.error('[crypto] Erro ao cifrar CPF:', err);
    throw new Error('Falha na criptografia do CPF.');
  }
}

/* ============================================================
   decryptData(ciphertext)
   ────────────────────────
   Recebe a string Base64 gerada por encryptData().
   Retorna o CPF em texto claro.

   Retorna null se o valor for nulo/vazio (compatibilidade
   com documentos antigos que não têm campo cpfCifrado).
   ============================================================ */
export async function decryptData(ciphertext) {
  if (!ciphertext) return null;

  // Detecta valores legados (texto puro — somente dígitos, 11 chars)
  // Se não contiver "|" não é um valor cifrado por este módulo
  if (!ciphertext.includes('|')) {
    console.warn('[crypto] CPF não cifrado detectado (dado legado).');
    return ciphertext; // retorna como está para não quebrar dados antigos
  }

  try {
    const [ivB64, cipherB64] = ciphertext.split('|');
    const iv        = base64ToBytes(ivB64);
    const cipherBuf = base64ToBytes(cipherB64);
    const key       = await _getKey();

    const plainBuf  = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      cipherBuf
    );

    return new TextDecoder().decode(plainBuf);

  } catch (err) {
    console.error('[crypto] Erro ao decifrar CPF:', err);
    // Não lança exceção para não quebrar a UI — retorna indicador de erro
    return '[erro ao descriptografar]';
  }
}