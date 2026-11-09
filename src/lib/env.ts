// ==============================================================================
// AEGISPAY CENTRALIZED ENVIRONMENT CONFIGURATION
// All environment variables read here with capability detection and fallbacks.
// ==============================================================================

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  // PayPal
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
    webhookId: process.env.PAYPAL_WEBHOOK_ID || '',
    environment: (process.env.PAYPAL_ENVIRONMENT || 'sandbox').toLowerCase() as 'sandbox' | 'live',
    get baseUrl() {
      return this.environment === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';
    },
  },

  // AI Providers
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY || '',
    model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
  },

  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    storageBucket: process.env.STORAGE_BUCKET || 'aegispay-evidence',
  },

  // GitHub & Third-Party
  githubToken: process.env.GITHUB_TOKEN || '',
  bryntumLicenseKey: process.env.NEXT_PUBLIC_BRYNTUM_LICENSE_KEY || '',
};

export interface SystemCapabilities {
  hasPayPal: boolean;
  hasGemini: boolean;
  hasGroq: boolean;
  hasSupabase: boolean;
  hasGitHub: boolean;
  hasBryntumLicense: boolean;
  isDemoMode: boolean;
}

export function getSystemCapabilities(): SystemCapabilities {
  const hasPayPal = Boolean(env.paypal.clientId && env.paypal.clientSecret);
  const hasGemini = Boolean(env.gemini.apiKey);
  const hasGroq = Boolean(env.groq.apiKey);
  const hasSupabase = Boolean(env.supabase.url && (env.supabase.anonKey || env.supabase.serviceRoleKey));
  const hasGitHub = Boolean(env.githubToken);
  const hasBryntumLicense = Boolean(env.bryntumLicenseKey);

  // If any core live key is missing, app runs in high-fidelity demo/sandbox mode
  const isDemoMode = !hasPayPal || !hasGemini || !hasGroq;

  return {
    hasPayPal,
    hasGemini,
    hasGroq,
    hasSupabase,
    hasGitHub,
    hasBryntumLicense,
    isDemoMode,
  };
}
