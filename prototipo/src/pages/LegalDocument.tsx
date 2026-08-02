import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Shield, ArrowUp, CheckCircle2, Mail } from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';
import {
  TERMS_SECTIONS,
  PRIVACY_SECTIONS,
  CURRENT_TERMS_VERSION,
  CURRENT_PRIVACY_VERSION,
  LEGAL_LAST_UPDATE,
  CONTROLLER,
  type LegalSection,
} from '@/lib/legal';
import { useAuth } from '@/lib/AuthContext';

interface LegalDocumentProps {
  document: 'terms' | 'privacy';
}

/**
 * Termos de Uso e Política de Privacidade como telas do produto (L1).
 *
 * Na v4.0 esses documentos eram apenas dois itens do menu que levavam à
 * Central de Ajuda. Aqui são telas completas, versionadas, com índice, âncoras
 * e indicação de qual versão o usuário aceitou.
 */
export default function LegalDocument({ document }: LegalDocumentProps) {
  const { user } = useAuth();
  const [showTop, setShowTop] = useState(false);

  const isTerms = document === 'terms';
  const sections: LegalSection[] = isTerms ? TERMS_SECTIONS : PRIVACY_SECTIONS;
  const version = isTerms ? CURRENT_TERMS_VERSION : CURRENT_PRIVACY_VERSION;
  const acceptedVersion = isTerms ? user?.accepted_terms_version : user?.accepted_privacy_version;
  const title = isTerms ? 'Termos de Uso' : 'Política de Privacidade';
  const Icon = isTerms ? FileText : Shield;

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = window.document.getElementById(`sec-${id}`);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div>
      <AppHeader showBack title={title} />
      <div className="px-4 py-4">
        <Card className="p-4 mb-4 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{title} da HandMade</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Versão {version} · atualizado em {LEGAL_LAST_UPDATE}
              </p>
              {acceptedVersion && (
                <Badge
                  className={`mt-2 border-0 text-[10px] gap-1 ${
                    acceptedVersion === version
                      ? 'bg-success/10 text-success'
                      : 'bg-warning/10 text-warning-strong'
                  }`}
                >
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {acceptedVersion === version
                    ? 'Você aceitou esta versão'
                    : `Você aceitou a versão ${acceptedVersion}`}
                </Badge>
              )}
            </div>
          </div>
        </Card>

        {/* Índice */}
        <Card className="p-3 mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Neste documento
          </p>
          <nav aria-label={`Índice de ${title}`}>
            <ol className="space-y-1">
              {sections.map(section => (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    className="text-xs text-left text-primary active:opacity-70 w-full py-1"
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </Card>

        {/* Conteúdo */}
        <article className="space-y-5">
          {sections.map(section => (
            <section key={section.id} id={`sec-${section.id}`} aria-labelledby={`h-${section.id}`}>
              <h2 id={`h-${section.id}`} className="text-base font-bold mb-2 scroll-mt-16">
                {section.title}
              </h2>
              <div className="space-y-2">
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.bullets && (
                <ul className="mt-2 space-y-1.5">
                  {section.bullets.map((bullet, i) => (
                    <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                      <span className="text-primary shrink-0 mt-0.5" aria-hidden="true">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        {/* Contato */}
        <Card className="p-4 mt-6 bg-muted/50">
          <p className="text-sm font-semibold mb-2">Dúvidas sobre este documento?</p>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 shrink-0" /> {CONTROLLER.email}
            </p>
            {!isTerms && (
              <p className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 shrink-0" />
                {CONTROLLER.dpo_name}: {CONTROLLER.dpo_email}
              </p>
            )}
            <p className="pt-1">
              {CONTROLLER.name} · {CONTROLLER.address}
            </p>
            <p className="text-[10px] pt-1">
              Documento de conteúdo do protótipo acadêmico HandMade 5.0.
            </p>
          </div>
        </Card>

        {showTop && (
          <Button
            variant="outline"
            className="w-full mt-4 gap-2"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ArrowUp className="w-4 h-4" /> Voltar ao início
          </Button>
        )}
      </div>
    </div>
  );
}
