import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, SavedPaymentMethod } from './types';
import { STORAGE_PREFIX, auditStore, consentStore, notifyStoreChange } from './store';
import { CURRENT_TERMS_VERSION, CURRENT_PRIVACY_VERSION } from './legal';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  loginWithGoogle: () => Promise<User>;
  register: (userData: Partial<User>, password: string) => User;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  resendEmailVerification: () => void;
  savePaymentMethod: (method: Omit<SavedPaymentMethod, 'id' | 'created_at'>) => SavedPaymentMethod | null;
  removePaymentMethod: (id: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const CURRENT_USER_KEY = `${STORAGE_PREFIX}current_user`;
const USERS_KEY = `${STORAGE_PREFIX}users`;
const CREDENTIALS_KEY = `${STORAGE_PREFIX}auth_credentials`;
const SESSION_KEY = `${STORAGE_PREFIX}firebase_session`;

type StoredCredential = {
  email: string;
  password: string;
  provider: 'password' | 'google';
};

const googleDemoProfile = {
  email: 'maria.silva.google@gmail.com',
  full_name: 'Maria Silva',
  avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
};

function readUsers(): User[] {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function writeUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readCredentials(): StoredCredential[] {
  return JSON.parse(localStorage.getItem(CREDENTIALS_KEY) || '[]');
}

function writeCredentials(credentials: StoredCredential[]) {
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
}

function mockFirebaseUid(provider: 'password' | 'google', email: string) {
  return `${provider}_${email.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;
}

function createMockToken(user: User, provider: 'password' | 'google') {
  const payload = {
    aud: 'handmade-tcc-prototype',
    iss: 'https://securetoken.google.com/handmade-tcc-prototype',
    sub: user.firebase_uid || mockFirebaseUid(provider, user.email),
    email: user.email,
    email_verified: user.email_verified,
    firebase: { sign_in_provider: provider === 'google' ? 'google.com' : 'password' },
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  };
  return `mock.${btoa(JSON.stringify(payload))}.signature`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const saveUser = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(u));
    else {
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem(SESSION_KEY);
    }
  };

  const persistUser = (updated: User) => {
    const users = readUsers();
    const idx = users.findIndex(u => u.id === updated.id || u.email === updated.email);
    if (idx >= 0) users[idx] = updated;
    else users.push(updated);
    writeUsers(users);
    saveUser(updated);
  };

  const startSession = (found: User, provider: 'password' | 'google') => {
    const now = new Date();
    const expires = new Date(now.getTime() + 3600000);
    const updated: User = {
      ...found,
      auth_provider: provider,
      firebase_uid: found.firebase_uid || mockFirebaseUid(provider, found.email),
      last_login_at: now.toISOString(),
      session_expires_at: expires.toISOString(),
    };
    persistUser(updated);
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      uid: updated.firebase_uid,
      provider: provider === 'google' ? 'google.com' : 'password',
      idToken: createMockToken(updated, provider),
      refreshToken: `mock_refresh_${updated.firebase_uid}`,
      issuedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
    }));
    auditStore.create({
      actor_email: updated.email,
      action: provider === 'google' ? 'auth.google_sign_in' : 'auth.password_sign_in',
      entity: 'user',
      metadata: { provider: updated.auth_provider, email_verified: updated.email_verified },
      created_at: now.toISOString(),
    } as any);
    return updated;
  };

  const login = (email: string, _password: string): boolean => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = readUsers();
    const found = users.find(u => u.email.toLowerCase() === normalizedEmail && u.status !== 'deleted');
    const credential = readCredentials().find(c => c.email.toLowerCase() === normalizedEmail && c.provider === 'password');
    if (found && credential && credential.password === _password) {
      startSession(found, 'password');
      return true;
    }
    return false;
  };

  const loginWithGoogle = () => new Promise<User>((resolve) => {
    window.setTimeout(() => {
      const users = readUsers();
      const existing = users.find(u => u.email.toLowerCase() === googleDemoProfile.email.toLowerCase());
      const now = new Date().toISOString();
      const googleUser: User = existing ? {
        ...existing,
        full_name: existing.full_name || googleDemoProfile.full_name,
        avatar_url: existing.avatar_url || googleDemoProfile.avatar_url,
        email_verified: true,
        verified: true,
        auth_provider: 'google',
        firebase_uid: existing.firebase_uid || mockFirebaseUid('google', googleDemoProfile.email),
      } : {
        id: 'google_demo_user',
        email: googleDemoProfile.email,
        full_name: googleDemoProfile.full_name,
        account_type: 'individual',
        phone: '(11) 98888-1234',
        city: 'Guarulhos',
        state: 'SP',
        verified: true,
        email_verified: true,
        role: 'user',
        subscription_plan: 'free',
        status: 'active',
        onboarding_completed_screens: ['google_oauth'],
        avatar_url: googleDemoProfile.avatar_url,
        auth_provider: 'google',
        firebase_uid: mockFirebaseUid('google', googleDemoProfile.email),
        created_at: now,
      };
      persistUser(googleUser);
      const credentials = readCredentials();
      if (!credentials.some(c => c.email === googleUser.email && c.provider === 'google')) {
        credentials.push({ email: googleUser.email, password: '', provider: 'google' });
        writeCredentials(credentials);
      }
      resolve(startSession(googleUser, 'google'));
    }, 700);
  });

  const register = (userData: Partial<User>, _password: string): User => {
    const users = readUsers();
    const now = new Date().toISOString();
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 10),
      email: userData.email || '',
      full_name: userData.full_name || '',
      account_type: userData.account_type || 'individual',
      company_name: userData.company_name,
      trade_name: userData.trade_name,
      segment: userData.segment,
      cpf_last4: userData.cpf_last4,
      cnpj_last4: userData.cnpj_last4,
      phone: userData.phone,
      city: userData.city,
      state: userData.state,
      verified: false,
      email_verified: false,
      auth_provider: 'password',
      firebase_uid: mockFirebaseUid('password', userData.email || ''),
      role: 'user',
      subscription_plan: 'free',
      status: 'active',
      onboarding_completed_screens: [],
      // Consentimento colhido na etapa 3 do cadastro (LGPD art. 8º).
      accepted_terms_version: CURRENT_TERMS_VERSION,
      accepted_privacy_version: CURRENT_PRIVACY_VERSION,
      marketing_opt_in: Boolean(userData.marketing_opt_in),
      saved_payment_methods: [],
      created_at: now,
    };
    users.push(newUser);
    writeUsers(users);
    // Registra os consentimentos de forma auditável e versionada.
    (['terms', 'privacy'] as const).forEach(document => {
      consentStore.create({
        user_email: newUser.email,
        document,
        document_version: document === 'terms' ? CURRENT_TERMS_VERSION : CURRENT_PRIVACY_VERSION,
        granted: true,
        created_at: now,
      } as any);
    });
    consentStore.create({
      user_email: newUser.email,
      document: 'marketing',
      document_version: CURRENT_PRIVACY_VERSION,
      granted: Boolean(userData.marketing_opt_in),
      created_at: now,
    } as any);
    const credentials = readCredentials().filter(c => c.email.toLowerCase() !== newUser.email.toLowerCase());
    credentials.push({ email: newUser.email, password: _password, provider: 'password' });
    writeCredentials(credentials);
    startSession(newUser, 'password');
    return newUser;
  };

  /**
   * Encerra a sessão (B1 — corrigido na 5.0).
   *
   * Na v4.0 o logout apenas limpava o usuário e várias telas protegidas
   * respondiam com `return null` no meio da árvore de componentes, o que
   * produzia a tela branca até o recarregamento manual. Agora o encerramento
   * é síncrono e completo: trilha de auditoria, limpeza de sessão e estado,
   * e a navegação para /login fica a cargo de quem chamou (useLogout), sempre
   * com `replace: true` para que o botão "voltar" não retorne a uma tela
   * autenticada.
   */
  const logout = () => {
    if (user) {
      auditStore.create({
        actor_email: user.email,
        action: 'auth.sign_out',
        entity: 'user',
        created_at: new Date().toISOString(),
      } as any);
    }
    // Limpa a sessão simulada do Firebase e o usuário corrente.
    saveUser(null);
    localStorage.removeItem(SESSION_KEY);
    // Notifica as telas assinantes para que recalculem imediatamente.
    notifyStoreChange();
  };

  const savePaymentMethod = (method: Omit<SavedPaymentMethod, 'id' | 'created_at'>) => {
    if (!user) return null;
    const saved: SavedPaymentMethod = {
      ...method,
      id: Math.random().toString(36).substring(2, 10),
      created_at: new Date().toISOString(),
    };
    const existing = (user.saved_payment_methods || []).map(m =>
      saved.is_default ? { ...m, is_default: false } : m
    );
    persistUser({ ...user, saved_payment_methods: [...existing, saved] });
    return saved;
  };

  const removePaymentMethod = (id: string) => {
    if (!user) return;
    const remaining = (user.saved_payment_methods || []).filter(m => m.id !== id);
    // Se o método padrão foi removido, promove o primeiro restante.
    if (remaining.length > 0 && !remaining.some(m => m.is_default)) {
      remaining[0] = { ...remaining[0], is_default: true };
    }
    persistUser({ ...user, saved_payment_methods: remaining });
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    persistUser(updated);
  };

  const resendEmailVerification = () => {
    if (!user) return;
    auditStore.create({
      actor_email: user.email,
      action: 'auth.email_verification_sent',
      entity: 'user',
      created_at: new Date().toISOString(),
    } as any);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, register, logout, updateUser, resendEmailVerification, savePaymentMethod, removePaymentMethod, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
