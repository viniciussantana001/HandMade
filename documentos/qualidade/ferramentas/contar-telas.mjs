// ---------------------------------------------------------------------------
// M2 — recontagem de telas e interações do protótipo 5.0.
//
// A monografia herdou da 4.0 a afirmação "55 telas mapeadas e 111 interações".
// A 5.0 removeu a Carteira e somou impulsionamento, pagamento direto, recibo,
// privacidade, tributos e plano de negócio: o número velho não descreve mais o
// artefato. Aqui a contagem é feita por leitura do código, com critério
// declarado, para que qualquer pessoa possa reexecutar e chegar ao mesmo valor.
//
// Critério de TELA CHEIA: um estado visual que o usuário alcança e que ocupa o
// viewport inteiro. São de três tipos:
//   1. rota declarada em App.tsx;
//   2. passo interno de fluxo em etapas (o `step` troca todo o conteúdo);
//   3. retorno antecipado que substitui a tela (registro não encontrado).
//
// Critério de SOBREPOSIÇÃO: diálogo, sheet, drawer ou popover — estado que o
// usuário alcança e que exige uma decisão, mas com a tela anterior visível
// atrás. Contado à parte, porque chamar isso de "tela" e chamar a rota de
// "tela" no mesmo número esconde a diferença.
//
// Critério de INTERAÇÃO: um ponto de controle acionável pelo usuário —
// onClick, onSubmit, onValueChange, onCheckedChange, onChange, onKeyDown e
// navegação por <Link>. Contado uma vez por ocorrência no código, não por
// renderização em lista (um botão dentro de `.map()` é um ponto de interação,
// não N).
//
// O mesmo roteiro roda nas duas versões, para que a comparação 4.0 → 5.0 use um
// único critério e o número novo não seja apenas "maior", mas comparável:
//   node contar_telas.mjs                                     (5.0)
//   node contar_telas.mjs G:/handmade/work/handmade_4.0/src    (4.0)
// ---------------------------------------------------------------------------
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const RAIZ = process.argv[2] || 'G:/handmade/work/handmade_5.0/src';
const ler = p => readFileSync(p, 'utf8');

// --- 1. Rotas -------------------------------------------------------------
const app = ler(`${RAIZ}/App.tsx`);
const rotas = [...app.matchAll(/path="([^"]+)"/g)].map(m => m[1]);
const rotasUnicas = [...new Set(rotas)];

// --- 2. Passos internos de fluxos em etapas -------------------------------
/**
 * Conta os passos de um fluxo somando os valores distintos que o estado de
 * passo assume no arquivo. Cobre tanto o passo numérico (`step === 1`) quanto
 * o nomeado (`step === 'payment'`).
 */
function passos(arquivo) {
  const src = ler(`${RAIZ}/pages/${arquivo}`);
  const numeros = [...src.matchAll(/step === (\d+)/g)].map(m => m[1]);
  const nomes = [...src.matchAll(/step === '([a-z]+)'/g)].map(m => m[1]);
  const setNum = [...src.matchAll(/setStep\((\d+)\)/g)].map(m => m[1]);
  const setNom = [...src.matchAll(/setStep\('([a-z]+)'\)/g)].map(m => m[1]);
  const todos = [...new Set([...numeros, ...nomes, ...setNum, ...setNom])];
  return todos.sort();
}

const paginas = readdirSync(`${RAIZ}/pages`).filter(f => f.endsWith('.tsx'));

// Um fluxo em etapas é aquele cujo estado de passo troca todo o conteúdo. São
// detectados pelo próprio código, não por lista fixa: assim o roteiro vale para
// as duas versões sem edição.
const FLUXOS = paginas.filter(f => /setStep\(/.test(ler(`${RAIZ}/pages/${f}`)));
const etapas = {};
for (const f of FLUXOS) etapas[f] = passos(f);

// --- 3. Estados de página que ocupam a tela inteira ------------------------
/**
 * Retorno antecipado que substitui a tela inteira — o caso de registro ausente
 * ("anúncio não encontrado", "pedido não encontrado").
 *
 * "processando" e "concluído" NÃO entram aqui: nos fluxos em etapas eles já são
 * valores do próprio passo e seriam contados duas vezes.
 */
function estadosDeTela(arquivo) {
  const src = ler(`${RAIZ}/pages/${arquivo}`);
  const achados = [];
  if (/if \(!\w+\)[\s\S]{0,400}?(não encontrad|nao encontrad|não existe)/i.test(src)) {
    achados.push('não encontrado');
  }
  return achados;
}

const estados = {};
for (const p of paginas) {
  const e = estadosDeTela(p);
  if (e.length) estados[p] = e;
}

// --- 4. Sobreposições -----------------------------------------------------
/**
 * Conta diálogos, sheets e drawers pelo elemento de conteúdo, não pelo
 * componente-raiz: `<Dialog>` aparece uma vez por gatilho, mas é
 * `<DialogContent>` que corresponde a um estado que o usuário enxerga.
 */
const SOBREPOSICOES = [
  ['DialogContent', /<DialogContent[\s>]/g],
  ['AlertDialogContent', /<AlertDialogContent[\s>]/g],
  ['SheetContent', /<SheetContent[\s>]/g],
  ['DrawerContent', /<DrawerContent[\s>]/g],
];
const sobreposicoes = {};
for (const [nome] of SOBREPOSICOES) sobreposicoes[nome] = 0;
const sobrePorArquivo = {};

// --- 5. Interações --------------------------------------------------------
const PADROES = [
  ['onClick', /onClick=\{/g],
  ['onSubmit', /onSubmit=\{/g],
  ['onValueChange', /onValueChange=\{/g],
  ['onCheckedChange', /onCheckedChange=\{/g],
  ['onChange', /onChange=\{/g],
  ['onKeyDown', /onKeyDown=\{/g],
  ['Link to', /<Link\s+to=/g],
];

const porArquivo = {};
const totalPorPadrao = {};
for (const [nome] of PADROES) totalPorPadrao[nome] = 0;

/** Varre páginas e componentes de tela; ignora `components/ui` (biblioteca). */
function varrer(dir, prefixo = '') {
  for (const nome of readdirSync(`${RAIZ}/${dir}`, { withFileTypes: true })) {
    if (nome.isDirectory()) {
      if (nome.name === 'ui') continue;                 // primitivas shadcn
      varrer(`${dir}/${nome.name}`, `${prefixo}${nome.name}/`);
      continue;
    }
    if (!nome.name.endsWith('.tsx')) continue;
    const src = ler(`${RAIZ}/${dir}/${nome.name}`);
    let soma = 0;
    for (const [rotulo, re] of PADROES) {
      const n = (src.match(re) || []).length;
      totalPorPadrao[rotulo] += n;
      soma += n;
    }
    if (soma) porArquivo[`${prefixo}${nome.name}`] = soma;
    let somaSobre = 0;
    for (const [rotulo, re] of SOBREPOSICOES) {
      const n = (src.match(re) || []).length;
      sobreposicoes[rotulo] += n;
      somaSobre += n;
    }
    if (somaSobre) sobrePorArquivo[`${prefixo}${nome.name}`] = somaSobre;
  }
}
varrer('pages');
varrer('components');

// --- Relatório ------------------------------------------------------------
const nPassos = Object.values(etapas).reduce((a, v) => a + v.length, 0);
const nEstados = Object.values(estados).reduce((a, v) => a + v.length, 0);
// Cada fluxo em etapas já é contado uma vez como rota: some só os passos extras.
const passosExtras = nPassos - Object.keys(etapas).length;
const telasCheias = rotasUnicas.length + passosExtras + nEstados;
const nSobre = Object.values(sobreposicoes).reduce((a, v) => a + v, 0);
const telas = telasCheias + nSobre;
const interacoes = Object.values(totalPorPadrao).reduce((a, v) => a + v, 0);

console.log('=== ROTAS ===');
console.log(`${rotasUnicas.length} rotas declaradas em App.tsx`);
rotasUnicas.forEach(r => console.log(`  ${r}`));

console.log('\n=== FLUXOS EM ETAPAS ===');
for (const [f, p] of Object.entries(etapas)) {
  console.log(`  ${f.padEnd(20)} ${p.length} passos: ${p.join(', ')}`);
}
console.log(`  passos além da rota base: ${passosExtras}`);

console.log('\n=== ESTADOS DE TELA CHEIA ===');
for (const [f, e] of Object.entries(estados)) {
  console.log(`  ${f.padEnd(22)} ${e.join(', ')}`);
}
console.log(`  total: ${nEstados}`);

console.log('\n=== SOBREPOSIÇÕES ===');
for (const [k, v] of Object.entries(sobreposicoes)) {
  console.log(`  ${k.padEnd(20)} ${String(v).padStart(3)}`);
}
Object.entries(sobrePorArquivo).sort((a, b) => b[1] - a[1])
  .forEach(([f, n]) => console.log(`    ${f.padEnd(26)} ${String(n).padStart(3)}`));
console.log(`  total: ${nSobre}`);

console.log('\n=== INTERAÇÕES POR TIPO ===');
for (const [k, v] of Object.entries(totalPorPadrao)) {
  console.log(`  ${k.padEnd(16)} ${String(v).padStart(4)}`);
}
console.log('\n=== INTERAÇÕES POR ARQUIVO (10 maiores) ===');
Object.entries(porArquivo).sort((a, b) => b[1] - a[1]).slice(0, 10)
  .forEach(([f, n]) => console.log(`  ${f.padEnd(28)} ${String(n).padStart(4)}`));

console.log('\n============================================');
console.log(`  TELAS CHEIAS   ${telasCheias}   (${rotasUnicas.length} rotas + ${passosExtras} passos + ${nEstados} estados)`);
console.log(`  SOBREPOSIÇÕES  ${nSobre}`);
console.log(`  TELAS (total)  ${telas}`);
console.log(`  INTERAÇÕES     ${interacoes}`);
console.log('============================================');

const versao = RAIZ.includes('4.0') ? '4.0' : '5.0';
writeFileSync(`G:/handmade/work/contagem_${versao}.json`, JSON.stringify({
  versao, raiz: RAIZ,
  rotas: rotasUnicas, etapas, estados, sobreposicoes, sobrePorArquivo,
  totalPorPadrao, porArquivo,
  resumo: {
    rotas: rotasUnicas.length, passosExtras, estados: nEstados,
    telasCheias, sobreposicoes: nSobre, telas, interacoes,
  },
}, null, 2));
