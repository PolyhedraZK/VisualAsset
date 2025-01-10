// OAuth Configuration
export const OAUTH_CONFIG = {
  client_id: '406726050318-rgt3g9ld970r3fnesi5c0r4uddd8p2mc.apps.googleusercontent.com',
  auth_endpoint: 'https://accounts.google.com/o/oauth2/auth',
  token_endpoint: 'https://oauth2.googleapis.com/token',
  redirect_uri: 'https://visual-social-app-lkl6uawj.devinapps.com/auth/callback',
  scopes: ['email', 'profile'],
} as const;

// Helper to generate OAuth URL with all required parameters
export function generateOAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: OAUTH_CONFIG.client_id,
    redirect_uri: OAUTH_CONFIG.redirect_uri,
    response_type: 'code',
    scope: OAUTH_CONFIG.scopes.join(' '),
    access_type: 'online',
    prompt: 'select_account',
  });

  return `${OAUTH_CONFIG.auth_endpoint}?${params.toString()}`;
}
