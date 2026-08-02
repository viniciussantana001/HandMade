import { getPasswordStrength } from '@/lib/validators';
import { Check, X } from 'lucide-react';

export default function PasswordStrength({ password }: { password: string }) {
  const strength = getPasswordStrength(password);
  const checks = [
    { label: 'Mínimo 8 caracteres', met: password.length >= 8 },
    { label: 'Letra maiúscula', met: /[A-Z]/.test(password) },
    { label: 'Número', met: /[0-9]/.test(password) },
    { label: 'Caractere especial (!@#$%)', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${
            i < strength.level ? strength.color : 'bg-muted'
          }`} />
        ))}
      </div>
      <p className="text-xs font-medium">{strength.label}</p>
      <div className="space-y-1">
        {checks.map((check, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            {check.met ? (
              <Check className="w-3.5 h-3.5 text-success" />
            ) : (
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            <span className={check.met ? 'text-foreground' : 'text-muted-foreground'}>{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
