// ---------------------------------------------------------------------------
// U5 — solucionador da paleta acessível.
//
// Em vez de propor cores "a olho" e testar depois, este script resolve a
// luminosidade de cada token a partir das restrições reais de contraste da
// WCAG 2.2, considerando só as combinações que o código realmente usa
// (tingimentos /5, /10 e /20, apurados por varredura no src).
//
// Matiz e saturação de marca são preservados: a busca move apenas L.
// ---------------------------------------------------------------------------

const hslToRgb = (h, s, l) => {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const m = l - c / 2;
  const t = hp < 1 ? [c, x, 0] : hp < 2 ? [x, c, 0] : hp < 3 ? [0, c, x]
    : hp < 4 ? [0, x, c] : hp < 5 ? [x, 0, c] : [c, 0, x];
  return t.map(v => (v + m) * 255);
};
const lum = ([r, g, b]) => {
  const f = v => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const over = (fg, a, bg) => fg.map((v, i) => v * a + bg[i] * (1 - a));
const hex = c => '#' + c.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');

// Tingimentos efetivamente presentes no código-fonte.
const TINTS = [0.05, 0.10, 0.20];
const ALVO_TEXTO = 4.5;   // 1.4.3 — texto normal
const ALVO_GRAFICO = 3;   // 1.4.11 — borda, ícone, componente

/**
 * Acha a luminosidade mais próxima da original que satisfaz todas as
 * restrições. `dir` limita a busca: -1 escurece (tema claro), +1 clareia
 * (tema escuro), 0 aceita as duas direções.
 */
function resolver({ h, s, l0, restricoes, dir = 0 }) {
  const passos = [];
  for (let d = 0; d <= 70; d += 0.5) {
    if (dir >= 0) passos.push(l0 + d);
    if (dir <= 0 && d > 0) passos.push(l0 - d);
  }
  for (const l of passos) {
    if (l < 0 || l > 100) continue;
    const cor = hslToRgb(h, s, l);
    if (restricoes.every(({ fundo, alvo }) => ratio(cor, fundo(cor)) >= alvo)) {
      return { l, cor };
    }
  }
  return null;
}

function construir(nome, base) {
  const card = hslToRgb(...base.card);
  const bg = hslToRgb(...base.background);
  const muted = hslToRgb(...base.muted);
  const superficies = [card, bg, muted];
  const dir = nome === 'claro' ? -1 : 1;

  console.log(`\n=================== TEMA ${nome.toUpperCase()} ===================`);
  const saida = {};

  // 1. Texto secundário: legível nas três superfícies.
  const mf = resolver({
    h: base.mutedForeground[0], s: base.mutedForeground[1], l0: base.mutedForeground[2], dir,
    restricoes: superficies.map(sup => ({ fundo: () => sup, alvo: ALVO_TEXTO })),
  });
  saida['muted-foreground'] = [base.mutedForeground[0], base.mutedForeground[1], mf.l];
  console.log(`  muted-foreground  L ${base.mutedForeground[2]} → ${mf.l}  ${hex(mf.cor)}`);

  // 2. Tokens que servem de texto sobre superfície E sobre o próprio tingimento.
  for (const chave of ['primary', 'info', 'success', 'destructive']) {
    const [h, s, l0] = base[chave];
    const restricoes = [
      ...superficies.map(sup => ({ fundo: () => sup, alvo: ALVO_TEXTO })),
      ...TINTS.map(a => ({ fundo: cor => over(cor, a, card), alvo: ALVO_TEXTO })),
    ];
    const sol = resolver({ h, s, l0, restricoes, dir });
    if (!sol) { console.log(`  ${chave}: SEM SOLUÇÃO com S=${s}%`); continue; }
    saida[chave] = [h, s, sol.l];
    console.log(`  ${chave.padEnd(17)} L ${l0} → ${sol.l}  ${hex(sol.cor)}`);
  }

  // 3. warning é fundo sólido vivo; o texto âmbar ganha um token próprio.
  const [wh, ws, wl] = base.warning;
  saida.warning = [wh, ws, wl];
  const wt = resolver({
    h: wh, s: Math.min(ws, 90), l0: wl, dir,
    restricoes: [
      ...superficies.map(sup => ({ fundo: () => sup, alvo: ALVO_TEXTO })),
      ...TINTS.map(a => ({ fundo: () => over(hslToRgb(wh, ws, wl), a, card), alvo: ALVO_TEXTO })),
    ],
  });
  saida['warning-text'] = [wh, Math.min(ws, 90), wt.l];
  console.log(`  warning-text      L ${wl} → ${wt.l}  ${hex(wt.cor)}`);

  // 4. Primeiro plano de cada fundo sólido: branco se passar, senão escuro do matiz.
  for (const chave of ['primary', 'info', 'success', 'destructive', 'warning']) {
    const solido = hslToRgb(...(saida[chave] ?? base[chave]));
    const branco = [255, 255, 255];
    if (ratio(branco, solido) >= ALVO_TEXTO) {
      saida[`${chave}-foreground`] = [0, 0, 100];
      console.log(`  ${(chave + '-foreground').padEnd(17)} branco       ${ratio(branco, solido).toFixed(2)}:1`);
    } else {
      const h = (saida[chave] ?? base[chave])[0];
      const escuro = resolver({ h, s: 90, l0: 12, dir: 0, restricoes: [{ fundo: () => solido, alvo: ALVO_TEXTO }] });
      saida[`${chave}-foreground`] = [h, 90, escuro.l];
      console.log(`  ${(chave + '-foreground').padEnd(17)} ${hex(escuro.cor)}      ${ratio(escuro.cor, solido).toFixed(2)}:1`);
    }
  }

  // 5. Anel de foco: componente gráfico, exige 3:1 contra as superfícies.
  const ring = resolver({
    h: saida.primary[0], s: saida.primary[1], l0: saida.primary[2], dir: 0,
    restricoes: superficies.map(sup => ({ fundo: () => sup, alvo: ALVO_GRAFICO })),
  });
  saida.ring = [saida.primary[0], saida.primary[1], ring.l];

  // 6. Borda: 3:1 não é exigido para borda decorativa, mas melhora a leitura.
  saida.border = base.border;
  saida.input = base.border;

  return saida;
}

const BASE_CLARO = {
  background: [0, 0, 98], card: [0, 0, 100], muted: [220, 14, 94], border: [220, 13, 88],
  mutedForeground: [220, 10, 46], primary: [152, 55, 34], info: [210, 80, 52],
  success: [152, 55, 34], destructive: [0, 72, 51], warning: [38, 92, 50],
};
const BASE_ESCURO = {
  background: [222, 20, 7], card: [222, 18, 11], muted: [220, 14, 16], border: [220, 13, 20],
  mutedForeground: [220, 10, 55], primary: [152, 55, 40], info: [210, 80, 52],
  success: [152, 55, 40], destructive: [0, 72, 51], warning: [38, 92, 50],
};

const claro = construir('claro', BASE_CLARO);
const escuro = construir('escuro', BASE_ESCURO);

// ------------------------- conferência final -------------------------------
function conferir(nome, T, base) {
  const card = hslToRgb(...base.card);
  const bg = hslToRgb(...base.background);
  const muted = hslToRgb(...base.muted);
  let falhas = 0;
  const chk = (rot, f, b, alvo) => {
    const r = ratio(f, b);
    if (r < alvo) { falhas += 1; console.log(`  ✗ ${nome} ${rot} ${r.toFixed(2)}:1 (min ${alvo})`); }
  };
  const cor = k => hslToRgb(...T[k]);

  for (const [sn, sup] of [['card', card], ['background', bg], ['muted', muted]]) {
    chk(`muted-foreground/${sn}`, cor('muted-foreground'), sup, ALVO_TEXTO);
    for (const k of ['primary', 'info', 'success', 'destructive', 'warning-text']) {
      chk(`${k}/${sn}`, cor(k), sup, ALVO_TEXTO);
    }
  }
  for (const k of ['primary', 'info', 'success', 'destructive']) {
    for (const a of TINTS) chk(`${k}/${k}-${a * 100}`, cor(k), over(cor(k), a, card), ALVO_TEXTO);
  }
  for (const a of TINTS) chk(`warning-text/warning-${a * 100}`, cor('warning-text'), over(cor('warning'), a, card), ALVO_TEXTO);
  for (const k of ['primary', 'info', 'success', 'destructive', 'warning']) {
    chk(`${k}-foreground/${k}`, cor(`${k}-foreground`), cor(k), ALVO_TEXTO);
  }
  chk('ring/background', cor('ring'), bg, ALVO_GRAFICO);
  return falhas;
}

const falhas = conferir('claro', claro, BASE_CLARO) + conferir('escuro', escuro, BASE_ESCURO);
console.log(`\n=========== FALHAS RESTANTES: ${falhas} ===========`);

const css = (T) => Object.entries(T)
  .map(([k, v]) => `    --${k}: ${v[0]} ${v[1]}% ${v[2]}%;`).join('\n');
console.log('\n--- :root (claro) ---\n' + css(claro));
console.log('\n--- .dark (escuro) ---\n' + css(escuro));
process.exit(falhas === 0 ? 0 : 1);
