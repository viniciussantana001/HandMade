// ---------------------------------------------------------------------------
// HandMade 5.0 — conteúdo jurídico e de conformidade
//
// Este módulo concentra o CONTEÚDO de produto (Termos de Uso, Política de
// Privacidade, LGPD, cookies e orientação tributária) exibido nas telas do
// protótipo. É conteúdo informativo do produto, versionado para permitir o
// registro de consentimento previsto no art. 8º da LGPD.
// ---------------------------------------------------------------------------

export const CURRENT_TERMS_VERSION = '2.0';
export const CURRENT_PRIVACY_VERSION = '2.0';
export const LEGAL_LAST_UPDATE = '29 de julho de 2026';

export const CONTROLLER = {
  name: 'HandMade Tecnologia e Economia Circular Ltda.',
  cnpj: '00.000.000/0001-00 (fictício — projeto acadêmico)',
  address: 'Mogi Guaçu, São Paulo, Brasil',
  email: 'contato@handmade.com.br',
  dpo_name: 'Encarregado de Proteção de Dados (DPO)',
  dpo_email: 'dpo@handmade.com.br',
  privacy_center: 'Perfil › Privacidade e dados',
};

export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

// --- TERMOS DE USO ---------------------------------------------------------
export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: 'aceitacao',
    title: '1. Aceitação dos Termos',
    paragraphs: [
      'Estes Termos de Uso regulam o acesso e a utilização da plataforma HandMade, um marketplace mobile dedicado à economia circular, que conecta pessoas físicas, artesãos, pequenos empreendedores e empresas para a compra, venda, doação e troca de materiais reutilizáveis e excedentes.',
      'Ao criar uma conta, você declara ter lido e concordado integralmente com estes Termos e com a Política de Privacidade. O aceite é registrado com data, hora e versão do documento, conforme exige o art. 8º da Lei nº 13.709/2018 (LGPD).',
      'Caso não concorde com qualquer disposição, não conclua o cadastro e não utilize a plataforma.',
    ],
  },
  {
    id: 'elegibilidade',
    title: '2. Quem pode usar a HandMade',
    paragraphs: [
      'O uso da plataforma é permitido a pessoas maiores de 18 anos plenamente capazes e a pessoas jurídicas regularmente constituídas, representadas por pessoa autorizada.',
    ],
    bullets: [
      'Pessoa física (PF): cadastro com nome completo, CPF e data de nascimento.',
      'Pessoa jurídica (PJ): cadastro com CNPJ, razão social, segmento e responsável pela conta.',
      'É vedado o cadastro por menores de 18 anos. Identificada essa situação, a conta é suspensa e os dados excluídos, salvo obrigação legal de guarda.',
      'Cada pessoa ou empresa pode manter uma única conta ativa. Contas duplicadas podem ser unificadas ou encerradas.',
    ],
  },
  {
    id: 'papel',
    title: '3. Papel da HandMade na negociação',
    paragraphs: [
      'A HandMade atua como plataforma de intermediação: aproxima anunciantes e interessados, oferece ferramentas de busca, comunicação, pagamento e reputação. A HandMade não é proprietária, fabricante, importadora nem detentora dos materiais anunciados.',
      'A responsabilidade pela veracidade das informações do anúncio, pela existência, procedência, qualidade, quantidade e legalidade do material é exclusiva do anunciante.',
      'A HandMade não participa da entrega física, do transporte, do carregamento ou da conferência dos materiais, salvo quando essa função for expressamente contratada como serviço adicional.',
    ],
  },
  {
    id: 'anuncios',
    title: '4. Regras para anúncios',
    paragraphs: [
      'O anunciante é o único responsável pelo conteúdo publicado e garante que possui a propriedade ou a autorização necessária para ofertar o material.',
    ],
    bullets: [
      'As fotos devem ser do material real ofertado, não podendo ser retiradas de catálogos, sites de terceiros ou bancos de imagem.',
      'A descrição deve informar de forma clara a condição do material, a quantidade, a unidade de medida e eventuais defeitos relevantes.',
      'O preço anunciado deve ser o preço praticado, vedada a prática de atrair o interesse com valor irreal e negociar outro valor.',
      'É proibido anunciar: resíduos perigosos sujeitos a licenciamento específico, armas e munições, medicamentos, agrotóxicos, produtos furtados, animais, itens falsificados e qualquer material cuja circulação seja vedada por lei.',
      'Resíduos classificados como perigosos pela NBR 10.004 somente podem ser negociados entre agentes licenciados e com o devido Manifesto de Transporte de Resíduos (MTR).',
      'Anúncios duplicados, com categoria incorreta ou com dados de contato no lugar da descrição podem ser removidos.',
    ],
  },
  {
    id: 'pagamento',
    title: '5. Pagamento direto e taxa de serviço',
    paragraphs: [
      'A partir da versão 5.0, todos os pagamentos na HandMade são diretos: o comprador escolhe o método (PIX, cartão de crédito ou boleto), confirma o pagamento e recebe imediatamente o comprovante. Não existe carteira, saldo, depósito prévio ou saque na plataforma.',
      'O valor da venda é repassado ao vendedor pelo provedor de pagamento após a confirmação de recebimento pelo comprador, descontada a taxa de serviço da plataforma.',
      'A taxa de serviço incide sobre o valor da venda e varia conforme o plano: 5% no plano Gratuito, 3% no plano Pro e 2% no plano Empresarial. A taxa é informada de forma destacada antes da confirmação de qualquer pagamento.',
      'O impulsionamento de anúncios ("Impulsionar") é um serviço avulso, pago diretamente no ato da contratação, com preço e duração informados antes da confirmação.',
      'Doações e trocas não geram cobrança de taxa de serviço.',
    ],
  },
  {
    id: 'protecao',
    title: '6. Proteção ao comprador',
    paragraphs: [
      'Pagamentos realizados pela plataforma contam com proteção: se o material não for entregue ou for substancialmente diferente do anunciado, o comprador pode abrir uma solicitação de análise em até 7 dias corridos após o recebimento ou após a data prevista de entrega.',
      'Aprovada a solicitação, o valor pago é devolvido pelo mesmo método de pagamento utilizado, nos prazos do provedor: PIX em até 1 dia útil, cartão de crédito em até 2 faturas e boleto em até 5 dias úteis após o envio dos dados bancários.',
      'A proteção não cobre: divergências de expectativa não descritas no anúncio, danos causados pelo próprio comprador no transporte quando a retirada foi feita por ele, e negociações combinadas fora da plataforma.',
    ],
  },
  {
    id: 'condutas',
    title: '7. Condutas vedadas',
    paragraphs: ['O uso da plataforma pressupõe boa-fé. São condutas vedadas, sujeitas a advertência, suspensão ou encerramento da conta:'],
    bullets: [
      'Publicar informações falsas, enganosas ou de terceiros sem autorização.',
      'Combinar pagamento por fora com o objetivo de burlar a taxa de serviço e a proteção ao comprador.',
      'Utilizar o chat para assédio, discriminação, ameaça, spam ou propaganda não relacionada ao anúncio.',
      'Manipular a reputação com avaliações falsas, contas de apoio ou combinação entre usuários.',
      'Raspar dados, automatizar acessos ou tentar contornar limites técnicos da plataforma.',
    ],
  },
  {
    id: 'propriedade',
    title: '8. Propriedade intelectual',
    paragraphs: [
      'A marca HandMade, o aplicativo, a identidade visual, os textos institucionais e o código-fonte pertencem à HandMade e não podem ser copiados, distribuídos ou modificados sem autorização por escrito.',
      'O conteúdo que você publica — fotos, descrições, vídeos e avaliações — continua sendo seu. Ao publicar, você concede à HandMade uma licença não exclusiva, gratuita e limitada para exibir, redimensionar, indexar e divulgar esse conteúdo nas telas do aplicativo, em materiais de divulgação da plataforma e em resultados de busca, enquanto o anúncio estiver ativo.',
      'Essa licença termina com a exclusão do anúncio, ressalvadas as cópias mantidas em registros de pedidos concluídos, necessárias para comprovar a transação, e as cópias em cache de terceiros fora do controle da plataforma.',
      'Você declara ser o autor das fotos publicadas ou ter autorização do autor. Notificações de violação de direito autoral podem ser enviadas para contato@handmade.com.br e o conteúdo apontado é removido preventivamente até a análise.',
    ],
  },
  {
    id: 'tributos',
    title: '9. Obrigações fiscais do vendedor',
    paragraphs: [
      'A responsabilidade pelo cumprimento das obrigações tributárias decorrentes das vendas é exclusiva do vendedor. A HandMade não emite notas fiscais em nome dos vendedores.',
      'A plataforma oferece conteúdo orientativo sobre regimes e obrigações em "Ajuda › Tributos e obrigações do vendedor". Esse conteúdo é informativo e não substitui a orientação de um contador.',
      'A HandMade pode prestar informações às autoridades fiscais quando legalmente obrigada, inclusive na forma da legislação aplicável a plataformas digitais.',
    ],
  },
  {
    id: 'suspensao',
    title: '10. Suspensão e encerramento',
    paragraphs: [
      'A HandMade pode suspender ou encerrar contas que violem estes Termos, com aviso prévio sempre que possível e com direito de resposta. Em situações de risco evidente a outros usuários, a suspensão pode ser imediata.',
      'Você pode encerrar sua conta a qualquer momento em "Perfil › Privacidade e dados › Excluir minha conta". Pedidos em andamento devem ser concluídos ou cancelados antes da exclusão.',
    ],
  },
  {
    id: 'alteracoes',
    title: '11. Alterações destes Termos',
    paragraphs: [
      'Estes Termos podem ser atualizados para refletir mudanças no produto ou na legislação. Alterações relevantes são comunicadas no aplicativo com pelo menos 15 dias de antecedência, e um novo aceite é solicitado quando a mudança afetar direitos ou obrigações.',
      'A versão vigente e o histórico de versões ficam sempre disponíveis nesta tela.',
    ],
  },
  {
    id: 'foro',
    title: '12. Lei aplicável e foro',
    paragraphs: [
      'Aplicam-se a lei brasileira, o Código de Defesa do Consumidor (Lei nº 8.078/1990), o Marco Civil da Internet (Lei nº 12.965/2014) e a LGPD (Lei nº 13.709/2018).',
      'Fica eleito o foro do domicílio do consumidor para dirimir controvérsias, sem prejuízo do uso de plataformas de solução extrajudicial como o consumidor.gov.br.',
    ],
  },
];

// --- POLÍTICA DE PRIVACIDADE ----------------------------------------------
export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: 'introducao',
    title: '1. Quem trata seus dados',
    paragraphs: [
      `O controlador dos dados pessoais tratados na plataforma é ${CONTROLLER.name}, com sede em ${CONTROLLER.address}.`,
      `Dúvidas, solicitações e reclamações sobre privacidade podem ser dirigidas ao ${CONTROLLER.dpo_name} pelo e-mail ${CONTROLLER.dpo_email}. O prazo de resposta é de até 15 dias.`,
      'Esta Política descreve, em linguagem clara, quais dados coletamos, por que coletamos, com quem compartilhamos, por quanto tempo guardamos e como você exerce seus direitos.',
    ],
  },
  {
    id: 'dados-coletados',
    title: '2. Dados que coletamos e por quê',
    paragraphs: ['Coletamos apenas o necessário para operar o marketplace (princípio da necessidade, art. 6º, III, da LGPD):'],
    bullets: [
      'Cadastro (PF): nome completo, CPF, data de nascimento, e-mail, telefone, cidade e estado — para identificar você, prevenir fraude e permitir a negociação.',
      'Cadastro (PJ): CNPJ, razão social, nome fantasia, segmento, nome e cargo do responsável, e-mail, telefone, cidade e estado — para identificar a empresa e habilitar recursos empresariais.',
      'Credenciais: e-mail e senha (armazenada apenas em forma cifrada) ou identificador do provedor social escolhido.',
      'Anúncios: fotos, descrição, categoria, condição, quantidade, preço, cidade e formas de entrega — para exibir a oferta no marketplace.',
      'Negociação: mensagens do chat, propostas, favoritos, pedidos e avaliações — para viabilizar a compra e a reputação.',
      'Pagamento: método escolhido, valor, data, status, código do recibo e os quatro últimos dígitos do cartão. Números completos de cartão e senhas de banco NÃO são coletados nem armazenados pela HandMade.',
      'Uso do aplicativo: páginas visitadas, cliques, dispositivo, sistema operacional e versão do app — para medir desempenho e corrigir problemas.',
      'Localização aproximada (cidade e estado): informada por você no cadastro ou no anúncio, para permitir a busca por proximidade. Não coletamos localização precisa em segundo plano.',
    ],
  },
  {
    id: 'bases-legais',
    title: '3. Bases legais do tratamento',
    paragraphs: ['Cada tratamento se apoia em uma base legal do art. 7º da LGPD:'],
    bullets: [
      'Execução de contrato (art. 7º, V): cadastro, publicação de anúncios, chat, pedidos, pagamento e avaliações.',
      'Cumprimento de obrigação legal ou regulatória (art. 7º, II): guarda de registros de acesso por 6 meses (Marco Civil, art. 15) e de dados fiscais das transações por 5 anos.',
      'Legítimo interesse (art. 7º, IX): prevenção a fraude, segurança da plataforma, moderação de anúncios e melhoria do produto, sempre com avaliação de impacto e possibilidade de oposição.',
      'Consentimento (art. 7º, I): envio de comunicações de marketing, cookies não essenciais e uso de dados para pesquisas de satisfação. Pode ser retirado a qualquer momento.',
      'Exercício regular de direitos (art. 7º, VI): defesa em processos administrativos, judiciais ou arbitrais.',
      'Proteção ao crédito (art. 7º, X): checagens antifraude nas transações de pagamento.',
    ],
  },
  {
    id: 'compartilhamento',
    title: '4. Com quem compartilhamos',
    paragraphs: ['Não vendemos dados pessoais. O compartilhamento ocorre apenas quando necessário:'],
    bullets: [
      'Com o outro lado da negociação: nome, cidade, reputação e o conteúdo do chat. Seu CPF, CNPJ, data de nascimento e endereço completo não são exibidos publicamente.',
      'Com o provedor de pagamento: dados necessários para processar a cobrança e a devolução, na condição de controlador ou operador conforme o caso.',
      'Com operadores de infraestrutura (hospedagem, armazenamento de imagens, envio de notificações e e-mails), que tratam dados exclusivamente sob nossas instruções e com cláusulas contratuais de proteção.',
      'Com autoridades públicas, mediante requisição legal fundamentada, na exata medida do que for solicitado.',
      'Em caso de reorganização societária, mediante comunicação prévia e manutenção do mesmo nível de proteção.',
    ],
  },
  {
    id: 'transferencia',
    title: '5. Transferência internacional',
    paragraphs: [
      'Alguns operadores de infraestrutura podem processar dados em servidores fora do Brasil. Nesses casos, a transferência observa o art. 33 da LGPD e é amparada por cláusulas contratuais padrão que garantem grau de proteção equivalente ao da lei brasileira.',
    ],
  },
  {
    id: 'retencao',
    title: '6. Por quanto tempo guardamos',
    paragraphs: ['Guardamos cada dado apenas pelo prazo necessário à sua finalidade:'],
    bullets: [
      'Dados de cadastro: enquanto a conta estiver ativa e por 6 meses após a exclusão, para prevenir fraude e permitir a recuperação da conta.',
      'Anúncios excluídos: 90 dias, para atender a solicitações de análise e disputas.',
      'Mensagens do chat: 24 meses após a última interação da conversa.',
      'Pedidos, pagamentos e recibos: 5 anos, contados do encerramento do exercício, por obrigação fiscal e prescricional.',
      'Registros de acesso (data, hora e IP): 6 meses, conforme o art. 15 do Marco Civil da Internet.',
      'Registros de consentimento: pelo mesmo prazo do tratamento a que se referem, como prova do aceite.',
      'Dados de análise de uso: 14 meses, em forma agregada e não identificável após esse prazo.',
    ],
  },
  {
    id: 'direitos',
    title: '7. Seus direitos (LGPD, art. 18)',
    paragraphs: [
      `Você pode exercer todos os direitos abaixo diretamente no aplicativo, em "${CONTROLLER.privacy_center}", ou pelo e-mail ${CONTROLLER.dpo_email}. A resposta é enviada em até 15 dias, gratuitamente.`,
    ],
    bullets: [
      'Confirmação da existência de tratamento — saber se tratamos dados sobre você.',
      'Acesso aos dados — obter a relação completa dos dados que mantemos.',
      'Correção de dados incompletos, inexatos ou desatualizados.',
      'Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade.',
      'Portabilidade dos dados a outro fornecedor, em formato estruturado e interoperável (JSON).',
      'Eliminação dos dados tratados com base no consentimento, ressalvadas as hipóteses de guarda obrigatória do art. 16.',
      'Informação sobre as entidades públicas e privadas com as quais compartilhamos dados.',
      'Informação sobre a possibilidade de não fornecer consentimento e sobre as consequências da negativa.',
      'Revogação do consentimento, a qualquer momento, por procedimento gratuito e facilitado.',
      'Revisão de decisões automatizadas que afetem seus interesses, com solicitação de análise humana.',
      'Oposição a tratamento fundado em legítimo interesse, quando houver descumprimento da lei.',
      'Peticionamento à Autoridade Nacional de Proteção de Dados (ANPD) e aos órgãos de defesa do consumidor.',
    ],
  },
  {
    id: 'consentimento-app',
    title: '8. Consentimento no aplicativo',
    paragraphs: [
      'O aceite dos Termos e desta Política é colhido de forma separada e destacada na etapa final do cadastro, com registro de data, hora e versão do documento.',
      'O consentimento para comunicações de marketing e para cookies não essenciais é opcional e independente: recusá-lo não impede o uso da plataforma.',
      'Você pode revisar e alterar cada consentimento quando quiser em "Perfil › Privacidade e dados", inclusive baixar o histórico de aceites.',
    ],
  },
  {
    id: 'cookies',
    title: '9. Cookies, armazenamento local e análise de uso',
    paragraphs: [
      'Utilizamos armazenamento local no dispositivo e tecnologias equivalentes a cookies para três finalidades distintas:',
    ],
    bullets: [
      'Essenciais: manter você conectado, guardar preferências de tema e viabilizar o funcionamento das telas. Não podem ser desativados, pois sem eles o aplicativo não funciona.',
      'Desempenho: medir tempo de carregamento e erros, de forma agregada, para corrigir falhas.',
      'Análise e personalização: entender quais telas são mais usadas e recomendar anúncios relevantes. Dependem do seu consentimento e podem ser desativados sem perda de funcionalidade.',
      'Não utilizamos cookies de publicidade comportamental de terceiros nem compartilhamos identificadores com redes de anúncios.',
    ],
  },
  {
    id: 'criancas',
    title: '10. Crianças e adolescentes',
    paragraphs: [
      'A HandMade não se destina a menores de 18 anos e não coleta intencionalmente dados de crianças e adolescentes.',
      'Identificado cadastro de menor de idade, a conta é suspensa, os anúncios são despublicados e os dados são eliminados, salvo os estritamente necessários ao cumprimento de obrigação legal, conforme o art. 14 da LGPD.',
      `Pais e responsáveis que identifiquem uma conta criada por menor podem solicitar a exclusão imediata pelo e-mail ${CONTROLLER.dpo_email}.`,
    ],
  },
  {
    id: 'seguranca-dados',
    title: '11. Cuidados com seus dados',
    paragraphs: [
      'Adotamos medidas técnicas e administrativas para proteger os dados, entre elas: tráfego cifrado, senhas armazenadas apenas em forma cifrada, controle de acesso por perfil, registro de operações sensíveis em trilha de auditoria e minimização dos dados exibidos publicamente.',
      'Nunca solicitamos senha, código de verificação ou dados completos de cartão por telefone, e-mail, SMS ou WhatsApp. Mensagens com esse pedido devem ser denunciadas.',
      'Na hipótese de incidente de segurança com risco relevante, comunicamos os titulares afetados e a ANPD nos prazos do art. 48 da LGPD.',
    ],
  },
  {
    id: 'alteracoes-privacidade',
    title: '12. Alterações desta Política',
    paragraphs: [
      'Esta Política pode ser atualizada. A versão vigente, sua data e o histórico de versões ficam sempre disponíveis nesta tela, e mudanças relevantes são comunicadas no aplicativo com antecedência mínima de 15 dias.',
    ],
  },
];

// --- LGPD: RESUMO ACIONÁVEL -----------------------------------------------
export interface LgpdRight {
  code: string;
  title: string;
  description: string;
  action: string;
}

export const LGPD_RIGHTS: LgpdRight[] = [
  {
    code: 'art. 18, I',
    title: 'Confirmação de tratamento',
    description: 'Saber se a HandMade trata dados pessoais sobre você.',
    action: 'Ver confirmação',
  },
  {
    code: 'art. 18, II',
    title: 'Acesso aos dados',
    description: 'Consultar todos os dados que mantemos sobre a sua conta.',
    action: 'Ver meus dados',
  },
  {
    code: 'art. 18, III',
    title: 'Correção',
    description: 'Corrigir dados incompletos, inexatos ou desatualizados.',
    action: 'Editar perfil',
  },
  {
    code: 'art. 18, IV',
    title: 'Anonimização ou eliminação',
    description: 'Eliminar dados desnecessários, excessivos ou tratados em desconformidade com a lei.',
    action: 'Solicitar eliminação',
  },
  {
    code: 'art. 18, V',
    title: 'Portabilidade',
    description: 'Receber seus dados em formato estruturado (JSON) para levar a outro fornecedor.',
    action: 'Baixar meus dados',
  },
  {
    code: 'art. 18, VI',
    title: 'Eliminação de dados consentidos',
    description: 'Excluir os dados tratados com base no consentimento, respeitadas as guardas obrigatórias.',
    action: 'Excluir minha conta',
  },
  {
    code: 'art. 18, VII',
    title: 'Informação sobre compartilhamento',
    description: 'Saber com quais entidades públicas e privadas compartilhamos seus dados.',
    action: 'Ver compartilhamentos',
  },
  {
    code: 'art. 18, VIII',
    title: 'Informação sobre a negativa de consentimento',
    description: 'Conhecer as consequências de não consentir com tratamentos opcionais.',
    action: 'Entender as opções',
  },
  {
    code: 'art. 18, IX',
    title: 'Revogação do consentimento',
    description: 'Retirar, a qualquer momento, os consentimentos opcionais que você concedeu.',
    action: 'Gerenciar consentimentos',
  },
  {
    code: 'art. 20',
    title: 'Revisão de decisão automatizada',
    description: 'Pedir revisão humana de decisões automatizadas que afetem seus interesses.',
    action: 'Solicitar revisão',
  },
];

// --- TRIBUTOS E OBRIGAÇÕES DO VENDEDOR (L2) --------------------------------
export interface TaxProfile {
  key: 'pf' | 'mei' | 'simples';
  label: string;
  who: string;
  limits: string;
  taxes: string[];
  invoice: string;
  obligations: string[];
  attention: string;
}

export const TAX_PROFILES: TaxProfile[] = [
  {
    key: 'pf',
    label: 'Pessoa Física (sem CNPJ)',
    who: 'Quem vende de forma eventual — sobras de uma reforma, materiais do próprio uso, itens que não serão mais utilizados.',
    limits: 'Não há limite de faturamento, mas a venda habitual e com finalidade de lucro caracteriza atividade empresarial e exige CNPJ.',
    taxes: [
      'Venda de bem próprio por valor igual ou inferior ao de aquisição: não há imposto a pagar.',
      'Ganho de capital (venda por valor superior ao de aquisição): IR de 15% a 22,5% sobre o ganho, com isenção para alienações de até R$ 35.000 por mês.',
      'Recebimentos habituais de pessoas físicas podem ficar sujeitos ao carnê-leão, com tabela progressiva do IRPF.',
      'Não há incidência de ICMS para quem não é contribuinte do imposto.',
    ],
    invoice: 'A pessoa física não emite nota fiscal. O comprovante da negociação é o recibo de pagamento gerado pela HandMade, que serve como prova da transação. Se o comprador for empresa e precisar de documento fiscal, ele pode emitir nota fiscal de entrada.',
    obligations: [
      'Declarar os valores recebidos na Declaração de Ajuste Anual do IRPF.',
      'Guardar os recibos da HandMade por 5 anos.',
      'Informar o ganho de capital no programa GCAP quando houver lucro na alienação.',
    ],
    attention: 'Se você vende com frequência e com intenção de lucro, o Fisco pode entender que há atividade empresarial. Nesse caso, formalizar-se como MEI costuma sair mais barato do que a tributação como pessoa física.',
  },
  {
    key: 'mei',
    label: 'MEI — Microempreendedor Individual',
    who: 'Vendedor recorrente de pequeno porte: artesão, marceneiro, coletor, pequeno revendedor de materiais reaproveitados.',
    limits: 'Faturamento de até R$ 81.000 por ano (R$ 6.750 por mês em média). Permite no máximo um empregado e veda a participação como sócio de outra empresa.',
    taxes: [
      'DAS-MEI: valor fixo mensal, independente do faturamento.',
      'Comércio (venda de materiais): aproximadamente R$ 76 por mês, sendo INSS (5% do salário mínimo) + R$ 1,00 de ICMS.',
      'Comércio e serviços: aproximadamente R$ 81 por mês (INSS + ICMS + ISS).',
      'Não há IRPJ, CSLL, PIS ou COFINS a recolher sobre o faturamento dentro do limite.',
    ],
    invoice: 'A emissão de nota fiscal é obrigatória nas vendas para pessoa jurídica e dispensada nas vendas para pessoa física, que pode solicitá-la. Para venda de mercadorias, emite-se NFC-e (consumidor final) ou NF-e (para empresa), pelo emissor gratuito da Secretaria da Fazenda do estado.',
    obligations: [
      'Recolher o DAS até o dia 20 de cada mês.',
      'Entregar a DASN-SIMEI (declaração anual de faturamento) até 31 de maio.',
      'Manter o Relatório Mensal de Receitas Brutas, com os comprovantes anexados.',
      'Emitir nota fiscal em toda venda para pessoa jurídica.',
    ],
    attention: 'Ultrapassar R$ 81.000 em até 20% gera cobrança complementar e a migração para Microempresa no ano seguinte. Acima de 20%, o desenquadramento é retroativo ao início do ano, com recolhimento pelo Simples Nacional desde janeiro.',
  },
  {
    key: 'simples',
    label: 'Simples Nacional — ME e EPP',
    who: 'Empresas com volume acima do limite do MEI: depósitos, recicladoras, marmorarias, madeireiras, indústrias que vendem excedentes de produção.',
    limits: 'Microempresa até R$ 360.000 por ano; Empresa de Pequeno Porte até R$ 4.800.000 por ano.',
    taxes: [
      'Comércio (Anexo I): alíquota efetiva de 4% na primeira faixa, chegando a cerca de 19% na última.',
      'Recolhimento unificado no DAS: IRPJ, CSLL, PIS, COFINS, CPP, ICMS e, quando houver serviço, ISS.',
      'A alíquota efetiva é calculada sobre a receita bruta dos 12 meses anteriores, com dedução da parcela a deduzir prevista na tabela.',
      'Nas vendas de sucata e resíduos, o ICMS pode estar sujeito a diferimento ou substituição tributária conforme o estado.',
    ],
    invoice: 'Emissão de nota fiscal obrigatória em todas as vendas: NFC-e para consumidor final e NF-e para pessoa jurídica, com o CFOP correspondente à operação e o CSOSN do Simples Nacional.',
    obligations: [
      'Recolher o DAS até o dia 20 do mês seguinte à apuração.',
      'Entregar a DEFIS anualmente, até 31 de março.',
      'Manter escrituração contábil e fiscal, com apoio de contador.',
      'Cumprir as obrigações estaduais (SPED Fiscal, GIA) conforme o estado.',
      'Verificar a necessidade de licença ambiental e de MTR para movimentação de resíduos.',
    ],
    attention: 'A negociação de resíduos e sucatas tem regras estaduais próprias de ICMS. Antes de operar em volume, consulte um contador sobre diferimento, substituição tributária e credenciamento junto ao órgão ambiental do estado.',
  },
];

export interface PlatformFeeInfo {
  plan: string;
  fee: string;
  monthly: string;
  example: string;
}

export const PLATFORM_FEE_TABLE: PlatformFeeInfo[] = [
  { plan: 'Gratuito', fee: '5% por venda', monthly: 'R$ 0', example: 'Venda de R$ 250 → taxa de R$ 12,50 → você recebe R$ 237,50' },
  { plan: 'Pro', fee: '3% por venda', monthly: 'R$ 29,90/mês', example: 'Venda de R$ 250 → taxa de R$ 7,50 → você recebe R$ 242,50' },
  { plan: 'Empresarial', fee: '2% por venda', monthly: 'R$ 89,90/mês', example: 'Venda de R$ 250 → taxa de R$ 5,00 → você recebe R$ 245,00' },
];

export const TAX_GLOSSARY: { term: string; meaning: string }[] = [
  { term: 'DAS', meaning: 'Documento de Arrecadação do Simples Nacional — guia única que reúne os tributos do MEI e das empresas do Simples.' },
  { term: 'DASN-SIMEI', meaning: 'Declaração Anual do Simples Nacional do MEI, com o faturamento do ano anterior. Prazo: 31 de maio.' },
  { term: 'DEFIS', meaning: 'Declaração de Informações Socioeconômicas e Fiscais, entregue pelas ME e EPP do Simples. Prazo: 31 de março.' },
  { term: 'NFC-e', meaning: 'Nota Fiscal de Consumidor Eletrônica — usada nas vendas para consumidor final.' },
  { term: 'NF-e', meaning: 'Nota Fiscal Eletrônica — usada nas vendas para pessoa jurídica e no transporte de mercadorias.' },
  { term: 'MTR', meaning: 'Manifesto de Transporte de Resíduos — documento que acompanha a movimentação de resíduos sujeitos a controle ambiental.' },
  { term: 'CFOP', meaning: 'Código Fiscal de Operações e Prestações — identifica a natureza da operação na nota fiscal.' },
  { term: 'Ganho de capital', meaning: 'Lucro apurado na venda de um bem por valor superior ao de aquisição, tributado pelo IR na pessoa física.' },
];
