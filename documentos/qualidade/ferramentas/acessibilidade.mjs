// ---------------------------------------------------------------------------
// U5 / C3 — verificação automatizada de acabamento e acessibilidade.
//
// Roda no navegador real, em viewport de celular, e mede o que o olho não
// confere com precisão: contraste calculado dos textos, tamanho dos alvos de
// toque, rótulos de botões só com ícone, alternativas textuais das imagens,
// hierarquia de títulos e transbordo horizontal.
//
// Uso: node acessibilidade.mjs [baseURL]
// ---------------------------------------------------------------------------
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:5273';

const ROTAS_PUBLICAS = ['/', '/marketplace', '/login', '/cadastro', '/como-funciona', '/ajuda',
  '/termos', '/politica-de-privacidade'];
const ROTAS_AUTENTICADAS = ['/dashboard', '/meus-anuncios', '/meus-pedidos', '/meus-pagamentos',
  '/favoritos', '/notificacoes', '/perfil', '/perfil/editar', '/planos', '/tributos',
  '/plano-de-negocio', '/privacidade', '/chat', '/criar-anuncio', '/anuncio/wood-001',
  '/impulsionar/hm-001'];

/**
 * Auditoria executada dentro da página.
 *
 * O contraste segue a fórmula de luminância relativa da WCAG 2.2. Texto normal
 * exige 4,5:1 e texto grande (>=24px, ou >=18,66px em negrito) exige 3:1.
 */
const AUDITORIA = () => {
  const problemas = [];

  const lum = ([r, g, b]) => {
    const f = c => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const razao = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  const rgb = s => { const m = (s || '').match(/\d+(\.\d+)?/g); return m ? m.slice(0, 3).map(Number) : null; };
  const alpha = s => { const m = (s || '').match(/\d+(\.\d+)?/g); return m && m.length > 3 ? Number(m[3]) : 1; };
  const hex = c => '#' + c.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  /** Achata uma cor semitransparente sobre o fundo, como o navegador compõe. */
  const sobre = (frente, a, fundo) => frente.map((v, i) => v * a + fundo[i] * (1 - a));

  /**
   * Nome acessível aproximado, na ordem que os leitores de tela usam:
   * aria-labelledby, aria-label, title, texto próprio, alt de imagem interna.
   */
  const nomeAcessivel = el => {
    const porId = el.getAttribute('aria-labelledby');
    if (porId) {
      const refs = porId.split(/\s+/).map(id => document.getElementById(id)?.textContent?.trim() || '');
      if (refs.join(' ').trim()) return refs.join(' ').trim();
    }
    // <Label htmlFor="id"> nomeia o controle, inclusive os do Radix.
    const id = el.getAttribute('id');
    if (id) {
      const rotulo = document.querySelector(`label[for="${id}"]`);
      if (rotulo?.textContent?.trim()) return rotulo.textContent.trim();
    }
    const rotulos = [el.getAttribute('aria-label'), el.getAttribute('title')].filter(Boolean).join(' ').trim();
    if (rotulos) return rotulos;
    const texto = el.textContent.trim();
    if (texto) return texto;
    const img = el.querySelector('img[alt], [role="img"][aria-label]');
    if (img) return (img.getAttribute('alt') || img.getAttribute('aria-label') || '').trim();
    const svgTitulo = el.querySelector('svg title');
    if (svgTitulo) return svgTitulo.textContent.trim();
    return '';
  };

  /**
   * Cor de fundo efetiva: sobe a árvore acumulando as camadas semitransparentes
   * (bg-primary/10, bg-destructive/5 …) e as compõe sobre o primeiro fundo
   * opaco encontrado — que é exatamente o que o navegador pinta.
   */
  const fundoEfetivo = el => {
    const camadas = [];
    let node = el;
    let base = null;
    while (node && node !== document.documentElement) {
      const estilo = getComputedStyle(node);

      /*
        Gradiente (bg-gradient-to-br from-primary to-primary/80) vive em
        background-image, não em background-color — que fica `transparent`.
        Sem tratar este caso, o teste lê "branco sobre branco" e acusa 1,00:1
        onde o olho vê texto claro sobre verde escuro. Aqui tomamos a parada
        mais clara do gradiente: o pior caso para um texto claro.
        */
      const imagem = estilo.backgroundImage;
      if (imagem && imagem.includes('gradient')) {
        const paradas = [...imagem.matchAll(/rgba?\([^)]+\)/g)].map(m => {
          const cor = rgb(m[0]);
          const a = alpha(m[0]);
          return cor ? sobre(cor, a, [255, 255, 255]) : null;
        }).filter(Boolean);
        if (paradas.length) {
          base = paradas.reduce((maisClara, c) => (lum(c) > lum(maisClara) ? c : maisClara));
          break;
        }
      }

      const bg = estilo.backgroundColor;
      const cor = rgb(bg);
      const a = alpha(bg);
      if (cor && a >= 0.95) { base = cor; break; }
      if (cor && a > 0.01) camadas.push([cor, a]);
      node = node.parentElement;
    }
    base ??= rgb(getComputedStyle(document.body).backgroundColor) || [255, 255, 255];
    // Compõe da camada mais distante para a mais próxima do texto.
    for (const [cor, a] of camadas.reverse()) base = sobre(cor, a, base);
    return base;
  };

  const visivel = el => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' &&
      Number(s.opacity) > 0.15;
  };

  /**
   * Opacidade acumulada do elemento e de seus ancestrais.
   *
   * `opacity-80` não mexe no valor de `color`: o navegador aplica a mistura na
   * composição final. Sem contabilizar isso, um texto branco com opacity-80
   * sobre verde é medido como branco puro e o relatório superestima o contraste.
   */
  const opacidadeAcumulada = el => {
    let o = 1;
    let node = el;
    while (node && node !== document.documentElement) {
      o *= Number(getComputedStyle(node).opacity);
      node = node.parentElement;
    }
    return o;
  };

  // 1. Contraste do texto.
  for (const el of document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button, label, li, dt, dd, td, th, div')) {
    if (!visivel(el)) continue;
    const proprio = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!proprio) continue;
    /*
      Controle inativo é isento: a nota 1.4.3 da WCAG 2.2 exclui "texto ou
      imagem de texto que faz parte de um componente de interface inativo".
      O botão "Seu plano atual" cai aqui — ele está desabilitado de propósito,
      para indicar o plano vigente.
    */
    if (el.closest('[disabled], [aria-disabled="true"], [data-disabled]')) continue;

    const s = getComputedStyle(el);
    let cor = rgb(s.color);
    if (!cor || alpha(s.color) < 0.9) continue;
    const px = parseFloat(s.fontSize);
    const peso = Number(s.fontWeight) || 400;
    const grande = px >= 24 || (px >= 18.66 && peso >= 700);
    const exigido = grande ? 3 : 4.5;
    const fundo = fundoEfetivo(el);
    // A opacidade herdada mistura o texto com o fundo antes da leitura.
    const op = opacidadeAcumulada(el);
    if (op < 0.99) cor = sobre(cor, op, fundo);
    const r = razao(cor, fundo);
    if (r < exigido - 0.05) {
      problemas.push({
        tipo: 'contraste',
        detalhe: `${r.toFixed(2)}:1 (exigido ${exigido}:1) — ${px.toFixed(0)}px peso ${peso} — ${hex(cor)} sobre ${hex(fundo)}`,
        texto: el.textContent.trim().slice(0, 55),
      });
    }
  }

  // 2. Alvos de toque. A WCAG 2.2 (2.5.8) pede 24x24 CSS px como mínimo.
  //
  // A norma abre exceção para o alvo "em linha": link dentro de uma frase, cuja
  // altura é ditada pelo texto ao redor. O teste reproduz essa exceção olhando
  // se o elemento divide o parágrafo com texto solto.
  const emLinha = el => {
    const pai = el.parentElement;
    if (!pai) return false;
    const irmaosComTexto = [...pai.childNodes].some(
      n => n.nodeType === 3 && n.textContent.trim().length > 0
    );
    return irmaosComTexto && getComputedStyle(el).display.startsWith('inline');
  };

  for (const el of document.querySelectorAll('button, a[href], input[type="checkbox"], input[type="radio"], [role="button"], [role="switch"]')) {
    if (!visivel(el)) continue;
    if (emLinha(el)) continue;
    // Um <a> que embrulha um <button> reporta a caixa da linha, não a do botão:
    // o alvo real é o filho. O aninhamento em si é reportado no item 8.
    if (el.querySelector('button, a[href], [role="button"]')) continue;
    const r = el.getBoundingClientRect();
    if (Math.min(r.width, r.height) < 24) {
      problemas.push({
        tipo: 'alvo-de-toque',
        detalhe: `${Math.round(r.width)}x${Math.round(r.height)}px (mínimo 24x24)`,
        texto: (nomeAcessivel(el) || el.tagName).slice(0, 55),
      });
    }
  }

  // 8. Conteúdo interativo aninhado: <a> dentro de <a>, <button> dentro de <a>.
  // A especificação do HTML proíbe, e leitores de tela anunciam dois controles
  // onde o usuário vê um só.
  for (const el of document.querySelectorAll('a[href], button, [role="button"]')) {
    if (!visivel(el)) continue;
    const dentro = el.querySelector('a[href], button, [role="button"]');
    if (dentro && visivel(dentro)) {
      problemas.push({
        tipo: 'aninhamento-interativo',
        detalhe: `<${el.tagName.toLowerCase()}> contém <${dentro.tagName.toLowerCase()}>`,
        texto: (nomeAcessivel(el) || '').slice(0, 55),
      });
    }
  }

  // 3. Nome acessível em controles sem texto.
  for (const el of document.querySelectorAll('button, a[href], [role="button"], [role="switch"]')) {
    if (!visivel(el)) continue;
    if (el.getAttribute('aria-hidden') === 'true') continue;
    if (!nomeAcessivel(el)) {
      problemas.push({ tipo: 'sem-nome-acessivel', detalhe: el.tagName.toLowerCase(), texto: String(el.className).slice(0, 55) });
    }
  }

  // 4. Alternativa textual das imagens (alt="" é válido para decorativas).
  for (const img of document.querySelectorAll('img')) {
    if (!visivel(img)) continue;
    if (img.getAttribute('alt') === null) {
      problemas.push({ tipo: 'img-sem-alt', detalhe: img.currentSrc?.slice(-45) || '', texto: '' });
    }
  }

  // 5. Exatamente um <h1> por tela.
  const h1 = [...document.querySelectorAll('h1')].filter(visivel);
  if (h1.length === 0) problemas.push({ tipo: 'hierarquia', detalhe: 'nenhum <h1> visível', texto: '' });
  if (h1.length > 1) problemas.push({ tipo: 'hierarquia', detalhe: `${h1.length} elementos <h1>`, texto: h1.map(e => e.textContent.trim().slice(0, 20)).join(' | ') });

  // 6. Transbordo horizontal — a tela nunca deve rolar para o lado.
  const doc = document.documentElement;
  if (doc.scrollWidth > doc.clientWidth + 2) {
    const culpados = [...document.querySelectorAll('body *')]
      .filter(el => visivel(el) && el.getBoundingClientRect().right > doc.clientWidth + 2)
      .slice(0, 3)
      .map(el => `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`);
    problemas.push({ tipo: 'transbordo-horizontal', detalhe: `${doc.scrollWidth}px > ${doc.clientWidth}px`, texto: culpados.join(', ') });
  }

  // 7. Campos de formulário com rótulo associado.
  for (const campo of document.querySelectorAll('input:not([type="hidden"]), select, textarea')) {
    if (!visivel(campo)) continue;
    const id = campo.getAttribute('id');
    const temLabel = (id && document.querySelector(`label[for="${id}"]`)) ||
      campo.closest('label') || campo.getAttribute('aria-label') ||
      campo.getAttribute('aria-labelledby') || campo.getAttribute('placeholder');
    if (!temLabel) {
      problemas.push({ tipo: 'campo-sem-rotulo', detalhe: campo.getAttribute('name') || campo.type, texto: '' });
    }
  }

  return problemas;
};

const browser = await chromium.launch();
const relatorio = [];

async function auditar(page, rota, tema) {
  await page.goto(`${BASE}${rota}`, { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(600);
  const problemas = await page.evaluate(AUDITORIA);
  relatorio.push({ rota, tema, problemas });
  const marca = problemas.length === 0 ? 'OK  ' : `${String(problemas.length).padStart(2)} ✗`;
  console.log(`  [${marca}] ${tema.padEnd(6)} ${rota}`);
  return problemas.length;
}

for (const tema of ['claro', 'escuro']) {
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    locale: 'pt-BR',
    colorScheme: tema === 'escuro' ? 'dark' : 'light',
  });
  const page = await context.newPage();

  console.log(`\n== Tema ${tema} — rotas públicas ==`);
  for (const rota of ROTAS_PUBLICAS) await auditar(page, rota, tema);

  // Autentica para alcançar as telas protegidas.
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'demo@handmade.com');
  await page.fill('input[type="password"]', 'Demo@1234');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1400);

  console.log(`== Tema ${tema} — rotas autenticadas ==`);
  for (const rota of ROTAS_AUTENTICADAS) await auditar(page, rota, tema);

  await context.close();
}

await browser.close();

// Agrupa por tipo para priorizar a correção.
const porTipo = {};
for (const { rota, tema, problemas } of relatorio) {
  for (const p of problemas) {
    porTipo[p.tipo] ??= [];
    porTipo[p.tipo].push({ rota, tema, ...p });
  }
}

const total = Object.values(porTipo).reduce((a, l) => a + l.length, 0);
console.log('\n=== RESUMO POR TIPO ===');
for (const [tipo, lista] of Object.entries(porTipo).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n${tipo}: ${lista.length}`);
  const amostra = lista.slice(0, 12);
  for (const p of amostra) console.log(`   ${p.tema} ${p.rota} → ${p.detalhe}${p.texto ? ` | "${p.texto}"` : ''}`);
  if (lista.length > amostra.length) console.log(`   … e mais ${lista.length - amostra.length}`);
}
console.log(`\nTELAS AUDITADAS: ${relatorio.length}`);
console.log(`TOTAL DE PROBLEMAS: ${total}`);

writeFileSync('G:/handmade/work/e2e/acessibilidade.json',
  JSON.stringify({ total, telas: relatorio.length, porTipo, relatorio }, null, 2));
process.exit(total === 0 ? 0 : 1);
