// ---------------------------------------------------------------------------
// C2 — teste de fluxo end-to-end do HandMade 5.0
//
// Percorre os caminhos que quebravam na versão 4.0 e verifica, no navegador
// real, que nenhuma tela fica branca. "Tela branca" aqui tem definição
// operacional: a raiz da aplicação renderizada com menos de 40 caracteres de
// texto visível.
//
// Uso: node flows.mjs [baseURL]
// ---------------------------------------------------------------------------
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:5273';
const SHOTS = 'G:/handmade/work/e2e/shots';
mkdirSync(SHOTS, { recursive: true });

const results = [];
let shotIndex = 0;

function record(nome, ok, detalhe = '') {
  results.push({ nome, ok, detalhe });
  const marca = ok ? 'PASSOU' : 'FALHOU';
  console.log(`  [${marca}] ${nome}${detalhe ? ` — ${detalhe}` : ''}`);
}

/** Detecta tela branca: pouco texto visível na raiz da aplicação. */
async function assertNotBlank(page, nome) {
  await page.waitForTimeout(350);
  const texto = await page.evaluate(() => {
    const root = document.getElementById('root');
    return root ? (root.innerText || '').trim() : '';
  });
  const ok = texto.length >= 40;
  record(nome, ok, ok ? `${texto.length} caracteres visíveis` : `apenas ${texto.length} caracteres — TELA BRANCA`);
  return ok;
}

async function shot(page, nome) {
  shotIndex += 1;
  const arquivo = `${SHOTS}/${String(shotIndex).padStart(2, '0')}-${nome}.png`;
  await page.screenshot({ path: arquivo, fullPage: false });
  return arquivo;
}

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'demo@handmade.com');
  await page.fill('input[type="password"]', 'Demo@1234');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1200);
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 412, height: 915 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  locale: 'pt-BR',
  timezoneId: 'America/Sao_Paulo',
});
const page = await context.newPage();

const erros = [];
page.on('console', m => { if (m.type() === 'error') erros.push(m.text()); });
page.on('pageerror', e => erros.push(`pageerror: ${e.message}`));

try {
  console.log('\n== Fluxo 1: abertura e navegação pública ==');
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await assertNotBlank(page, 'Home carrega com conteúdo');
  await shot(page, 'home');

  await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle' });
  await assertNotBlank(page, 'Marketplace carrega');
  await shot(page, 'marketplace');

  console.log('\n== Fluxo 2: autenticação ==');
  await login(page);
  const naoEstaNoLogin = !page.url().includes('/login');
  record('Login autentica e sai da tela de login', naoEstaNoLogin, page.url().replace(BASE, ''));
  await shot(page, 'pos-login');

  console.log('\n== Fluxo 3: telas autenticadas ==');
  for (const [rota, nome] of [
    ['/dashboard', 'painel'],
    ['/meus-anuncios', 'meus-anuncios'],
    ['/meus-pedidos', 'meus-pedidos'],
    ['/meus-pagamentos', 'meus-pagamentos'],
    ['/favoritos', 'favoritos'],
    ['/notificacoes', 'notificacoes'],
    ['/perfil', 'perfil'],
    ['/planos', 'planos'],
    ['/tributos', 'tributos'],
    ['/plano-de-negocio', 'plano-de-negocio'],
    ['/privacidade', 'privacidade'],
    ['/termos', 'termos'],
    ['/politica-de-privacidade', 'politica-privacidade'],
    ['/ajuda', 'ajuda'],
    ['/como-funciona', 'como-funciona'],
    ['/chat', 'mensagens'],
  ]) {
    await page.goto(`${BASE}${rota}`, { waitUntil: 'networkidle' });
    await assertNotBlank(page, `Tela ${rota}`);
    await shot(page, nome);
  }

  console.log('\n== Fluxo 4: B2 — impulsionamento (regressão da tela branca) ==');
  await page.goto(`${BASE}/meus-anuncios`, { waitUntil: 'networkidle' });
  const temAnuncio = await page.locator('text=/Impulsionar/i').count();
  if (temAnuncio > 0) {
    await page.locator('text=/Impulsionar/i').first().click();
    await page.waitForTimeout(900);
    await assertNotBlank(page, 'B2 — tela de impulsionamento abre');
    await shot(page, 'impulsionar-planos');

    // Escolhe o plano de 7 dias e avança até o pagamento.
    const plano = page.locator('text=/7 dias/i').first();
    if (await plano.count()) {
      await plano.click();
      await page.waitForTimeout(400);
    }
    const avancar = page.locator('button:has-text("Continuar"), button:has-text("Avançar"), button:has-text("Ir para o pagamento")').first();
    if (await avancar.count()) {
      await avancar.click();
      await page.waitForTimeout(700);
      await assertNotBlank(page, 'B2 — passo de pagamento do impulso');
      await shot(page, 'impulsionar-pagamento');

      const confirmar = page.locator('button:has-text("Pagar"), button:has-text("Confirmar")').first();
      if (await confirmar.count()) {
        await confirmar.click();
        // O processamento simulado leva ~1,4 s a 2,1 s.
        await page.waitForTimeout(3800);
        await assertNotBlank(page, 'B2 — conclusão do impulso NÃO deixa tela branca');
        await shot(page, 'impulsionar-concluido');
      }
    }
  } else {
    record('B2 — botão de impulsionar encontrado', false, 'nenhum anúncio do usuário demo');
  }

  console.log('\n== Fluxo 5: B3 — compra com pagamento direto ==');
  await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle' });
  // Precisa ser anúncio de OUTRO vendedor e que não seja doação: o próprio
  // anunciante não vê botão de compra, e doação não tem preço para pagar.
  const candidatos = await page.locator('a[href^="/anuncio/"]').evaluateAll(nodes =>
    nodes
      .map(n => ({ href: n.getAttribute('href') || '', texto: n.innerText || '' }))
      .filter(c => !c.href.includes('demo-own') && !/doação|grátis/i.test(c.texto))
      .map(c => c.href)
  );
  record('Anúncio de terceiro disponível para compra', candidatos.length > 0, candidatos[0] || 'nenhum');
  if (candidatos.length) {
    await page.goto(`${BASE}${candidatos[0]}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    await assertNotBlank(page, 'Detalhe do anúncio abre');
    await shot(page, 'anuncio-detalhe');

    const comprar = page.locator('button:has-text("Comprar")').first();
    if (await comprar.count()) {
      await comprar.click();
      await page.waitForTimeout(1100);
      await assertNotBlank(page, 'B3 — checkout de pagamento direto abre');
      const noCheckout = page.url().includes('/pagamento/');
      record('B3 — rota de pagamento direto', noCheckout, page.url().replace(BASE, ''));
      await shot(page, 'checkout-metodo');

      // PIX é o primeiro método; confirma e segue até o recibo.
      const pix = page.locator('text=/PIX/').first();
      if (await pix.count()) { await pix.click(); await page.waitForTimeout(300); }
      const continuar = page.locator('button:has-text("Continuar"), button:has-text("Revisar")').first();
      if (await continuar.count()) {
        await continuar.click();
        await page.waitForTimeout(600);
        await assertNotBlank(page, 'B3 — passo de confirmação');
        await shot(page, 'checkout-confirmacao');

        const pagar = page.locator('button:has-text("Pagar"), button:has-text("Confirmar pagamento")').first();
        if (await pagar.count()) {
          await pagar.click();
          await page.waitForTimeout(4200);
          await assertNotBlank(page, 'B3 — recibo emitido sem tela branca');
          const temRecibo = (await page.locator('text=/HM-\\d{4}-\\d{6}/').count()) > 0;
          record('B3 — recibo com código HM-AAAA-NNNNNN', temRecibo);
          await shot(page, 'recibo');
        }
      }
    } else {
      const rotulos = await page.locator('button').allInnerTexts();
      record('Botão de compra encontrado no anúncio', false, `botões: ${rotulos.slice(0, 6).join(' / ')}`);
    }
  }

  console.log('\n== Fluxo 6: B1 — encerrar sessão (regressão da tela branca) ==');
  await page.goto(`${BASE}/perfil`, { waitUntil: 'networkidle' });
  const sair = page.locator('text=/Sair da conta|Encerrar sessão|Sair/i').last();
  if (await sair.count()) {
    await sair.click();
    await page.waitForTimeout(500);
    // Diálogo de confirmação (U4).
    const confirmarSaida = page.locator('button:has-text("Sair"), button:has-text("Confirmar")').last();
    if (await confirmarSaida.count()) {
      await confirmarSaida.click();
    }
    await page.waitForTimeout(1400);
    await assertNotBlank(page, 'B1 — após sair, a tela NÃO fica branca');
    const foiParaLogin = page.url().includes('/login');
    record('B1 — redireciona para /login', foiParaLogin, page.url().replace(BASE, ''));
    await shot(page, 'pos-logout');

    // O botão "voltar" não deve retornar a uma tela autenticada.
    await page.goBack();
    await page.waitForTimeout(900);
    await assertNotBlank(page, 'B1 — voltar após sair não deixa tela branca');
    const naoVoltouAutenticado = !page.url().includes('/perfil');
    record('B1 — voltar não retorna à tela autenticada', naoVoltouAutenticado, page.url().replace(BASE, ''));
    await shot(page, 'pos-logout-voltar');
  } else {
    record('Botão de sair encontrado no perfil', false);
  }

  console.log('\n== Fluxo 7: rota inexistente ==');
  await page.goto(`${BASE}/rota-que-nao-existe`, { waitUntil: 'networkidle' });
  await assertNotBlank(page, 'Rota inexistente mostra página 404');
  await shot(page, '404');

  console.log('\n== Fluxo 8: carteira removida (B3) ==');
  await page.goto(`${BASE}/carteira`, { waitUntil: 'networkidle' });
  const carteiraRemovida = (await page.locator('text=/não encontrada|404/i').count()) > 0;
  record('/carteira não existe mais', carteiraRemovida);
} catch (erro) {
  record('Execução completa do roteiro', false, erro.message);
} finally {
  // As duas rotas inexistentes são visitadas de propósito (fluxos 7 e 8): o
  // console.error da própria página 404 é comportamento esperado, não defeito.
  const errosReais = erros.filter(
    e =>
      !/favicon|manifest|404 \(Not Found\).*\.(png|ico|svg)|Download the React DevTools/i.test(e) &&
      !/attempted to access non-existent route: \/(rota-que-nao-existe|carteira)/i.test(e)
  );
  record('Nenhum erro de console durante o roteiro', errosReais.length === 0,
    errosReais.length ? errosReais.slice(0, 3).join(' | ') : '');

  const passou = results.filter(r => r.ok).length;
  const total = results.length;
  console.log(`\n=== ${passou}/${total} verificações passaram ===`);
  const falhas = results.filter(r => !r.ok);
  if (falhas.length) {
    console.log('\nFalhas:');
    falhas.forEach(f => console.log(`  - ${f.nome}${f.detalhe ? `: ${f.detalhe}` : ''}`));
  }
  writeFileSync('G:/handmade/work/e2e/resultado.json', JSON.stringify({ passou, total, results, erros: errosReais }, null, 2));
  await browser.close();
  process.exit(falhas.length ? 1 : 0);
}
