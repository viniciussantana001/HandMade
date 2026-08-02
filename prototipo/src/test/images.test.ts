import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { IMAGE_VARIANTS } from '@/lib/imageManifest';
import { imageSrcSet, imageUrl } from '@/lib/images';

/**
 * Fotos do catálogo simulado (M1).
 *
 * A versão 5.0 deixou de carregar as fotos de demonstração de um banco de
 * imagens externo: uma das URLs passou a responder 404 e quebrou a figura
 * correspondente da monografia. Estes testes protegem as duas garantias que a
 * mudança precisa manter — nunca pedir um arquivo que não existe em disco, e
 * continuar servindo a foto no tamanho do contexto (ganho de U2).
 */
describe('fotos locais do catálogo', () => {
  const CAPA = '/materiais/madeira-tabuas-capa-640w.jpg';

  it('só aponta para larguras que existem no manifesto', () => {
    for (const slot of ['thumb', 'card', 'detail', 'hero', 'avatar'] as const) {
      for (const dpr of [1, 2]) {
        const url = imageUrl(CAPA, slot, dpr);
        const m = url.match(/^(\/materiais\/.+)-(\d+)w\.jpg$/);
        expect(m, `URL fora do padrão: ${url}`).not.toBeNull();
        const [, base, largura] = m!;
        expect(IMAGE_VARIANTS[base]).toContain(Number(largura));
      }
    }
  });

  it('escolhe a menor largura que cobre o slot pedido', () => {
    // thumb (160) em 1x pede 160px; a menor variante que cobre é 320.
    expect(imageUrl(CAPA, 'thumb', 1)).toBe('/materiais/madeira-tabuas-capa-320w.jpg');
    // card (640) em 1x pede 640px: casa exatamente com a variante de 640.
    expect(imageUrl(CAPA, 'card', 1)).toBe('/materiais/madeira-tabuas-capa-640w.jpg');
    // card em 2x pede 1280px.
    expect(imageUrl(CAPA, 'card', 2)).toBe('/materiais/madeira-tabuas-capa-1280w.jpg');
  });

  it('não ultrapassa a maior largura disponível', () => {
    // hero (1280) em 2x pediria 2560px; a maior gerada é 1280.
    expect(imageUrl(CAPA, 'hero', 2)).toBe('/materiais/madeira-tabuas-capa-1280w.jpg');
  });

  it('respeita as larguras menores do avatar', () => {
    const avatar = '/materiais/avatar-vendedora-320w.jpg';
    expect(IMAGE_VARIANTS['/materiais/avatar-vendedora']).toEqual([160, 320]);
    // avatar (240) em 2x pediria 480px; a maior existente é 320.
    expect(imageUrl(avatar, 'avatar', 2)).toBe('/materiais/avatar-vendedora-320w.jpg');
  });

  it('gera srcset com duas densidades quando há variantes distintas', () => {
    const srcset = imageSrcSet(CAPA, 'card');
    expect(srcset).toBe(
      '/materiais/madeira-tabuas-capa-640w.jpg 1x, /materiais/madeira-tabuas-capa-1280w.jpg 2x'
    );
  });

  it('omite o srcset quando 1x e 2x resolveriam para o mesmo arquivo', () => {
    // hero já satura na maior largura, então 1x e 2x coincidem.
    expect(imageSrcSet(CAPA, 'hero')).toBeUndefined();
  });

  it('devolve intactas as fotos escolhidas pelo usuário', () => {
    const dataUrl = 'data:image/jpeg;base64,AAAA';
    expect(imageUrl(dataUrl, 'card')).toBe(dataUrl);
    expect(imageSrcSet(dataUrl, 'card')).toBeUndefined();
    expect(imageUrl('blob:http://x/y', 'card')).toBe('blob:http://x/y');
  });

  it('não quebra com caminho local fora do manifesto', () => {
    const desconhecida = '/materiais/inexistente-640w.jpg';
    expect(imageUrl(desconhecida, 'card')).toBe(desconhecida);
  });

  it('devolve string vazia quando não há foto', () => {
    expect(imageUrl(undefined, 'card')).toBe('');
  });

  it('mantém o comportamento antigo para URL externa remanescente', () => {
    const externa = 'https://images.unsplash.com/photo-123?w=800';
    const url = imageUrl(externa, 'thumb');
    expect(url).toContain('w=160');
    expect(url).toContain('q=70');
  });
});

/**
 * Guarda de regressão do próprio catálogo: nenhum anúncio semeado pode voltar
 * a depender de uma foto hospedada fora do projeto.
 *
 * A verificação lê o código-fonte de `seedData.ts`, e não o módulo importado:
 * o arquivo exporta só a função `seedIfEmpty`, então os dados não aparecem em
 * `JSON.stringify` do módulo — uma asserção sobre o módulo passaria sem
 * examinar nada.
 */
describe('catálogo semeado', () => {
  // `import.meta.url` não é um URL file: sob o ambiente jsdom do Vitest;
  // process.cwd() é a raiz do projeto quando os testes rodam por `npm test`.
  const fonte = readFileSync(resolve(process.cwd(), 'src/lib/seedData.ts'), 'utf8');

  it('não referencia nenhuma imagem externa', () => {
    expect(fonte).not.toContain('images.unsplash.com');
    expect(fonte).not.toMatch(/https?:\/\/[^'"\s]+\.(jpg|jpeg|png|webp)/i);
  });

  it('aponta apenas para fotos presentes no manifesto', () => {
    const caminhos = [...fonte.matchAll(/\/materiais\/[\w-]+-\d+w\.jpg/g)].map(m => m[0]);
    expect(caminhos.length).toBeGreaterThan(0);
    for (const caminho of caminhos) {
      const [, base, largura] = caminho.match(/^(\/materiais\/.+)-(\d+)w\.jpg$/)!;
      expect(IMAGE_VARIANTS[base], `sem manifesto: ${caminho}`).toBeDefined();
      expect(IMAGE_VARIANTS[base]).toContain(Number(largura));
    }
  });
});
