export function validateCPF(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11 || /^(\d)\1+$/.test(clean)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(clean[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== parseInt(clean[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(clean[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  return rest === parseInt(clean[10]);
}

export function validateCNPJ(cnpj: string): boolean {
  const clean = cnpj.replace(/\D/g, '');
  if (clean.length !== 14 || /^(\d)\1+$/.test(clean)) return false;
  const weights1 = [5,4,3,2,9,8,7,6,5,4,3,2];
  const weights2 = [6,5,4,3,2,9,8,7,6,5,4,3,2];
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += parseInt(clean[i]) * weights1[i];
  let rest = sum % 11;
  if (rest < 2) { if (parseInt(clean[12]) !== 0) return false; }
  else { if (parseInt(clean[12]) !== 11 - rest) return false; }
  sum = 0;
  for (let i = 0; i < 13; i++) sum += parseInt(clean[i]) * weights2[i];
  rest = sum % 11;
  if (rest < 2) return parseInt(clean[13]) === 0;
  return parseInt(clean[13]) === 11 - rest;
}

export function maskCPF(value: string): string {
  return value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').substring(0, 14);
}

export function maskCNPJ(value: string): string {
  return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})/, '$1-$2').substring(0, 18);
}

export function maskPhone(value: string): string {
  return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 15);
}

export function maskCEP(value: string): string {
  return value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 9);
}

// --- Cartão de crédito (pagamento direto, 5.0) -----------------------------

export function maskCardNumber(value: string): string {
  const clean = value.replace(/\D/g, '').substring(0, 16);
  return clean.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function maskCardExpiry(value: string): string {
  const clean = value.replace(/\D/g, '').substring(0, 4);
  if (clean.length <= 2) return clean;
  return `${clean.substring(0, 2)}/${clean.substring(2)}`;
}

/** Valida o número do cartão pelo algoritmo de Luhn. */
export function validateCardNumber(value: string): boolean {
  const clean = value.replace(/\D/g, '');
  if (clean.length < 13 || clean.length > 19) return false;
  let sum = 0;
  let double = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean[i], 10);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

/** Valida a validade MM/AA, recusando meses inválidos e datas já vencidas. */
export function validateCardExpiry(value: string): boolean {
  const match = value.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = 2000 + parseInt(match[2], 10);
  if (month < 1 || month > 12) return false;
  // Vence no último instante do mês informado.
  const expiry = new Date(year, month, 0, 23, 59, 59);
  return expiry.getTime() >= Date.now();
}

// --- Validações de formulário compartilhadas -------------------------------

export function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value.trim());
}

export function validatePhone(value: string): boolean {
  const clean = value.replace(/\D/g, '');
  // 10 dígitos (fixo) ou 11 (celular com nono dígito).
  return clean.length === 10 || clean.length === 11;
}

export function validateBirthDate(value: string): { valid: boolean; reason?: string } {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return { valid: false, reason: 'Use o formato DD/MM/AAAA.' };
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  const date = new Date(year, month - 1, day);
  if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
    return { valid: false, reason: 'Data inexistente.' };
  }
  const now = new Date();
  let age = now.getFullYear() - year;
  const beforeBirthday =
    now.getMonth() < month - 1 || (now.getMonth() === month - 1 && now.getDate() < day);
  if (beforeBirthday) age -= 1;
  if (age < 18) return { valid: false, reason: 'É necessário ter 18 anos ou mais.' };
  if (age > 120) return { valid: false, reason: 'Verifique o ano de nascimento.' };
  return { valid: true };
}

export function maskBirthDate(value: string): string {
  const clean = value.replace(/\D/g, '').substring(0, 8);
  if (clean.length <= 2) return clean;
  if (clean.length <= 4) return `${clean.substring(0, 2)}/${clean.substring(2)}`;
  return `${clean.substring(0, 2)}/${clean.substring(2, 4)}/${clean.substring(4)}`;
}

export function getPasswordStrength(password: string): { level: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
  const levels = [
    { level: 0, label: 'Muito fraca', color: 'bg-destructive' },
    { level: 1, label: 'Fraca', color: 'bg-destructive' },
    { level: 2, label: 'Média', color: 'bg-warning' },
    { level: 3, label: 'Boa', color: 'bg-warning' },
    { level: 4, label: 'Muito forte', color: 'bg-success' },
  ];
  return levels[score];
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const maskedLocal = local.substring(0, 2) + '***';
  const domParts = domain.split('.');
  const maskedDomain = domParts[0].substring(0, 2) + '***.' + domParts.slice(1).join('.');
  return `${maskedLocal}@${maskedDomain}`;
}
