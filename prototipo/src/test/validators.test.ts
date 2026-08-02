// ---------------------------------------------------------------------------
// C2 — testes de validação de formulário (U4)
//
// A versão 4.0 aceitava CPF inválido, cartão com dígito errado e data de
// nascimento impossível. Estes testes fixam as regras corrigidas.
// ---------------------------------------------------------------------------
import { describe, it, expect } from 'vitest';
import {
  validateCPF,
  validateCNPJ,
  maskCPF,
  maskCNPJ,
  maskPhone,
  maskCEP,
  maskCardNumber,
  maskCardExpiry,
  validateCardNumber,
  validateCardExpiry,
  validateEmail,
  validatePhone,
  validateBirthDate,
  maskBirthDate,
  getPasswordStrength,
  maskEmail,
} from '@/lib/validators';

describe('CPF e CNPJ', () => {
  it('aceita CPF com dígitos verificadores corretos', () => {
    expect(validateCPF('529.982.247-25')).toBe(true);
    expect(validateCPF('52998224725')).toBe(true);
  });

  it('recusa CPF com dígito verificador errado, tamanho errado ou repetido', () => {
    expect(validateCPF('529.982.247-24')).toBe(false);
    expect(validateCPF('123')).toBe(false);
    expect(validateCPF('111.111.111-11')).toBe(false);
  });

  it('aceita CNPJ válido e recusa inválido', () => {
    expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
    expect(validateCNPJ('11.222.333/0001-80')).toBe(false);
    expect(validateCNPJ('00.000.000/0000-00')).toBe(false);
  });

  it('formata as máscaras progressivamente, sem estourar o tamanho', () => {
    expect(maskCPF('52998224725')).toBe('529.982.247-25');
    expect(maskCNPJ('11222333000181')).toBe('11.222.333/0001-81');
    expect(maskPhone('11999990000')).toBe('(11) 99999-0000');
    expect(maskCEP('13840000')).toBe('13840-000');
    expect(maskCPF('529982247259999')).toHaveLength(14);
  });
});

describe('cartão de crédito', () => {
  it('valida o número pelo algoritmo de Luhn', () => {
    expect(validateCardNumber('4111 1111 1111 1111')).toBe(true);
    expect(validateCardNumber('5555 5555 5555 4444')).toBe(true);
    expect(validateCardNumber('4111 1111 1111 1112')).toBe(false);
  });

  it('recusa números curtos ou longos demais', () => {
    expect(validateCardNumber('4111')).toBe(false);
    expect(validateCardNumber('41111111111111111111')).toBe(false);
  });

  it('agrupa o número em blocos de quatro dígitos', () => {
    expect(maskCardNumber('4111111111111111')).toBe('4111 1111 1111 1111');
    expect(maskCardNumber('41111111111111119999')).toBe('4111 1111 1111 1111');
  });

  it('formata e valida a validade MM/AA', () => {
    expect(maskCardExpiry('1230')).toBe('12/30');
    expect(validateCardExpiry('12/30')).toBe(true);
    expect(validateCardExpiry('13/30')).toBe(false);
    expect(validateCardExpiry('00/30')).toBe(false);
    expect(validateCardExpiry('12/20')).toBe(false);
    expect(validateCardExpiry('1230')).toBe(false);
  });
});

describe('contato e identidade', () => {
  it('valida e-mail com domínio completo', () => {
    expect(validateEmail('maria@handmade.com.br')).toBe(true);
    expect(validateEmail('maria@handmade')).toBe(false);
    expect(validateEmail('maria handmade.com')).toBe(false);
  });

  it('aceita telefone fixo de 10 e celular de 11 dígitos', () => {
    expect(validatePhone('(11) 3333-4444')).toBe(true);
    expect(validatePhone('(11) 99999-0000')).toBe(true);
    expect(validatePhone('(11) 999')).toBe(false);
  });

  it('exige maioridade e recusa datas impossíveis', () => {
    expect(validateBirthDate('15/03/1990').valid).toBe(true);
    expect(validateBirthDate('31/02/1990').valid).toBe(false);
    expect(validateBirthDate('15/03/2020').valid).toBe(false);
    expect(validateBirthDate('15/03/1990').reason).toBeUndefined();
    expect(validateBirthDate('15/03/2020').reason).toContain('18 anos');
  });

  it('formata a data de nascimento durante a digitação', () => {
    expect(maskBirthDate('15')).toBe('15');
    expect(maskBirthDate('1503')).toBe('15/03');
    expect(maskBirthDate('15031990')).toBe('15/03/1990');
  });
});

describe('senha e privacidade', () => {
  it('classifica a força da senha em cinco níveis', () => {
    expect(getPasswordStrength('abc').level).toBe(0);
    expect(getPasswordStrength('abcdefgh').level).toBe(1);
    expect(getPasswordStrength('Abcdefg1').level).toBe(3);
    expect(getPasswordStrength('Abcdefg1!').level).toBe(4);
  });

  it('mascara o e-mail exibido publicamente (LGPD)', () => {
    expect(maskEmail('maria.silva@gmail.com')).toBe('ma***@gm***.com');
    expect(maskEmail('sem-arroba')).toBe('sem-arroba');
  });
});
