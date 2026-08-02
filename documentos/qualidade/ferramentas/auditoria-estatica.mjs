// Auditoria U5 — varredura estática do protótipo 5.0.
// Procura defeitos que passam pelo tsc mas quebram no navegador ou reprovam
// nos critérios de acessibilidade: classes Tailwind inexistentes, <button>
// sem type explícito e utilitários usados mas nunca definidos.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SRC = 'G:/handmade/work/handmade_5.0/src';
const CSS = readFileSync(join(SRC, 'index.css'), 'utf8');

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx|ts)$/.test(p)) out.push(p);
  }
  return out;
}

// Escala real de espaçamento do Tailwind: só 0.5, 1.5, 2.5 e 3.5 existem.
const INVALID_SCALE = /\b(?:w|h|gap|p|m|px|py|mx|my|mt|mb|ml|mr|pt|pb|pl|pr|top|left|right|bottom|inset|space-x|space-y)-(?:4|5|6|7|8|9|10|11|12|13|14|15|16|20|24)\.5\b/g;

const problems = { escala: [], type: [], classesMortas: [] };
const files = walk(SRC).filter(f => !f.includes('components\\ui') && !f.includes('components/ui'));

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const rel = relative(SRC, file).replace(/\\/g, '/');
  const lines = text.split('\n');

  lines.forEach((line, i) => {
    for (const m of line.matchAll(INVALID_SCALE)) {
      problems.escala.push(`${rel}:${i + 1} → ${m[0]}`);
    }
  });

  // <button> sem type: dentro de <form> o padrão é submit e envia o formulário.
  const openings = [...text.matchAll(/<button\b/g)];
  for (const m of openings) {
    const tagEnd = text.indexOf('>', m.index);
    const tag = text.slice(m.index, tagEnd === -1 ? m.index + 400 : tagEnd);
    if (!/\btype=/.test(tag)) {
      problems.type.push(`${rel}:${text.slice(0, m.index).split('\n').length}`);
    }
  }
}

// Utilitários customizados citados no JSX mas ausentes do index.css.
const CUSTOM = ['safe-area-bottom', 'safe-area-top', 'pb-safe-nav', 'scrollbar-hide'];
for (const util of CUSTOM) {
  const usado = files.some(f => readFileSync(f, 'utf8').includes(util));
  const definido = CSS.includes(`.${util}`);
  if (usado && !definido) problems.classesMortas.push(util);
}

const total = problems.escala.length + problems.type.length + problems.classesMortas.length;
console.log('=== AUDITORIA U5 ===');
console.log(`Arquivos analisados: ${files.length} (components/ui de terceiros excluídos)`);
console.log(`\n1. Classes de escala inválidas: ${problems.escala.length}`);
problems.escala.forEach(p => console.log('   ✗ ' + p));
console.log(`\n2. <button> sem type explícito: ${problems.type.length}`);
problems.type.forEach(p => console.log('   ✗ ' + p));
console.log(`\n3. Utilitários usados mas não definidos: ${problems.classesMortas.length}`);
problems.classesMortas.forEach(p => console.log('   ✗ ' + p));
console.log(`\nTOTAL DE PROBLEMAS: ${total}`);
process.exit(total === 0 ? 0 : 1);
