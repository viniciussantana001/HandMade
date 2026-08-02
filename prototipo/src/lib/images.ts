// ---------------------------------------------------------------------------
// HandMade 5.0 — qualidade e seleção de imagens (U2 e U3)
//
// U2: as fotos do catálogo simulado passam por um construtor de URL que pede
//     a resolução correta para cada slot, com recorte e nitidez consistentes.
// U3: a seleção de fotos usa a galeria/câmera do dispositivo, lendo o arquivo
//     como data URL para pré-visualização e persistência local.
// ---------------------------------------------------------------------------

import { IMAGE_VARIANTS } from './imageManifest';

/** Slots de imagem do aplicativo e a largura de origem ideal para cada um. */
export const IMAGE_SLOTS = {
  thumb: 160,
  card: 640,
  detail: 1080,
  hero: 1280,
  avatar: 240,
} as const;

export type ImageSlot = keyof typeof IMAGE_SLOTS;

/**
 * Caminho base de uma foto local, sem o sufixo de largura.
 *
 * `/materiais/madeira-tabuas-capa-640w.jpg` → `/materiais/madeira-tabuas-capa`
 */
function baseLocal(src: string): string | null {
  const m = src.match(/^(\/materiais\/.+)-\d+w\.jpg$/);
  return m ? m[1] : null;
}

/**
 * Escolhe, entre as larguras que existem em disco, a menor que ainda cobre a
 * largura pedida — e, se nenhuma cobrir, a maior disponível.
 *
 * A consulta é feita ao manifesto gerado a partir dos arquivos reais, e não a
 * uma escada de tamanhos presumida: pedir um arquivo inexistente devolveria
 * 404 e reintroduziria a imagem quebrada que motivou a internalização das fotos.
 */
function variantePorLargura(src: string, alvo: number): string {
  const base = baseLocal(src);
  if (!base) return src;
  const disponiveis = IMAGE_VARIANTS[base];
  if (!disponiveis?.length) return src;
  const escolhida = disponiveis.find(w => w >= alvo) ?? disponiveis[disponiveis.length - 1];
  return `${base}-${escolhida}w.jpg`;
}

/**
 * Normaliza a URL de uma foto do catálogo simulado para o slot pedido.
 *
 * As fotos de demonstração ficam no próprio projeto, gravadas em três larguras.
 * A função devolve a variante adequada ao slot, de modo que a mesma foto
 * apareça nítida na miniatura e na tela de detalhe sem trafegar peso à toa.
 * Fotos escolhidas pelo usuário (`data:` e `blob:`) passam intactas.
 */
export function imageUrl(src: string | undefined, slot: ImageSlot = 'card', dpr = 2): string {
  if (!src) return '';
  if (src.startsWith('data:') || src.startsWith('blob:')) return src;

  const width = IMAGE_SLOTS[slot] * Math.min(dpr, 2);
  if (src.startsWith('/')) return variantePorLargura(src, width);

  // Compatibilidade: anúncios antigos ainda podem guardar uma URL externa.
  try {
    const url = new URL(src);
    url.searchParams.set('w', String(IMAGE_SLOTS[slot]));
    url.searchParams.set('q', slot === 'thumb' ? '70' : '82');
    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('dpr', String(Math.min(dpr, 2)));
    if (slot === 'avatar') url.searchParams.set('h', String(IMAGE_SLOTS[slot]));
    return url.toString();
  } catch {
    return src;
  }
}

/** Gera o atributo srcset para telas de densidade 1x e 2x. */
export function imageSrcSet(src: string | undefined, slot: ImageSlot = 'card'): string | undefined {
  if (!src || src.startsWith('data:') || src.startsWith('blob:')) return undefined;
  const um = imageUrl(src, slot, 1);
  const dois = imageUrl(src, slot, 2);
  // Quando só existe uma largura, repetir o mesmo arquivo em 1x e 2x não ajuda
  // o navegador e ainda confunde a leitura do HTML gerado.
  if (um === dois) return undefined;
  return `${um} 1x, ${dois} 2x`;
}

// --- Seleção de fotos do dispositivo (U3) ----------------------------------

export const MAX_PHOTOS = 8;
export const MAX_PHOTO_SIZE_MB = 8;
export const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
/** Atributo `accept` do input de arquivo — abre a galeria de fotos no celular. */
export const PHOTO_ACCEPT_ATTR = 'image/jpeg,image/png,image/webp,image/heic,image/heif';

export const MIN_PHOTO_DIMENSION = 400;

export interface PhotoValidationError {
  fileName: string;
  reason: string;
}

export interface ProcessedPhoto {
  dataUrl: string;
  fileName: string;
  sizeKb: number;
  width: number;
  height: number;
}

export interface PhotoSelectionResult {
  photos: ProcessedPhoto[];
  errors: PhotoValidationError[];
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
    reader.readAsDataURL(file);
  });
}

function loadImageElement(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Arquivo de imagem inválido.'));
    img.src = dataUrl;
  });
}

/**
 * Reamostra a foto escolhida para no máximo 1600px no maior lado.
 *
 * Fotos de celular chegam com 4000px ou mais e estouram a cota do
 * localStorage. A reamostragem mantém a nitidez necessária para a tela de
 * detalhe e reduz o peso para algo que o protótipo consegue persistir.
 */
async function downscale(img: HTMLImageElement, maxEdge = 1600, quality = 0.86) {
  const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { dataUrl: img.src, width: img.naturalWidth, height: img.naturalHeight };
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);
  return { dataUrl: canvas.toDataURL('image/jpeg', quality), width, height };
}

/**
 * Valida e processa os arquivos escolhidos na galeria ou na câmera.
 *
 * Devolve as fotos aprovadas e a lista de recusas com o motivo, para que o
 * formulário exiba mensagens específicas por arquivo em vez de um erro genérico.
 */
export async function processSelectedPhotos(
  files: FileList | File[],
  currentCount = 0,
  limit = MAX_PHOTOS
): Promise<PhotoSelectionResult> {
  const list = Array.from(files);
  const photos: ProcessedPhoto[] = [];
  const errors: PhotoValidationError[] = [];
  let remaining = Math.max(0, limit - currentCount);

  for (const file of list) {
    if (remaining === 0) {
      errors.push({ fileName: file.name, reason: `Limite de ${limit} fotos atingido.` });
      continue;
    }
    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      errors.push({ fileName: file.name, reason: 'Formato não aceito. Use JPG, PNG ou WEBP.' });
      continue;
    }
    if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
      errors.push({ fileName: file.name, reason: `Arquivo acima de ${MAX_PHOTO_SIZE_MB} MB.` });
      continue;
    }

    try {
      const raw = await readFileAsDataUrl(file);
      const img = await loadImageElement(raw);
      if (img.naturalWidth < MIN_PHOTO_DIMENSION || img.naturalHeight < MIN_PHOTO_DIMENSION) {
        errors.push({
          fileName: file.name,
          reason: `Imagem pequena (${img.naturalWidth}×${img.naturalHeight}px). Mínimo de ${MIN_PHOTO_DIMENSION}px.`,
        });
        continue;
      }
      const resized = await downscale(img);
      photos.push({
        dataUrl: resized.dataUrl,
        fileName: file.name,
        sizeKb: Math.round((resized.dataUrl.length * 0.75) / 1024),
        width: resized.width,
        height: resized.height,
      });
      remaining -= 1;
    } catch {
      errors.push({ fileName: file.name, reason: 'Não foi possível processar esta imagem.' });
    }
  }

  return { photos, errors };
}

/** Processa uma única foto para o avatar, recortada em quadrado. */
export async function processAvatarPhoto(file: File): Promise<{ dataUrl?: string; error?: string }> {
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
    return { error: 'Formato não aceito. Use JPG, PNG ou WEBP.' };
  }
  if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
    return { error: `Arquivo acima de ${MAX_PHOTO_SIZE_MB} MB.` };
  }
  try {
    const raw = await readFileAsDataUrl(file);
    const img = await loadImageElement(raw);
    const edge = Math.min(img.naturalWidth, img.naturalHeight);
    if (edge < 200) return { error: 'Imagem muito pequena. Use uma foto com pelo menos 200px.' };

    // Recorte central em quadrado, saída de 480px para telas de alta densidade.
    const size = 480;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { dataUrl: raw };
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(
      img,
      (img.naturalWidth - edge) / 2,
      (img.naturalHeight - edge) / 2,
      edge,
      edge,
      0,
      0,
      size,
      size
    );
    return { dataUrl: canvas.toDataURL('image/jpeg', 0.88) };
  } catch {
    return { error: 'Não foi possível processar esta imagem.' };
  }
}
