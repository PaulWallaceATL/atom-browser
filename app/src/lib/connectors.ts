/**
 * Connector authentication service.
 *
 * In production, each connector would implement an OAuth flow:
 * 1. Redirect user to the service's auth URL
 * 2. Receive callback with authorization code
 * 3. Exchange code for access token via Tauri HTTP client (server-side)
 * 4. Store tokens in Tauri secure store
 *
 * For now, this module provides the scaffolding and simulates the flow
 * so the UI can demonstrate the connect/disconnect lifecycle.
 */

import { load as loadStore } from "@tauri-apps/plugin-store";

const TOKENS_STORE = "atom-connector-tokens.json";

export interface ConnectorTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

interface OAuthConfig {
  authUrl: string;
  tokenUrl: string;
  clientId: string;
  scopes: string[];
}

const OAUTH_CONFIGS: Record<string, OAuthConfig> = {
  gmail: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientId: "ATOM_GMAIL_CLIENT_ID",
    scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
  },
  gcal: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientId: "ATOM_GCAL_CLIENT_ID",
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  },
  gdrive: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientId: "ATOM_GDRIVE_CLIENT_ID",
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  },
  github: {
    authUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    clientId: "ATOM_GITHUB_CLIENT_ID",
    scopes: ["repo", "read:user"],
  },
  slack: {
    authUrl: "https://slack.com/oauth/v2/authorize",
    tokenUrl: "https://slack.com/api/oauth.v2.access",
    clientId: "ATOM_SLACK_CLIENT_ID",
    scopes: ["channels:read", "chat:write"],
  },
};

async function saveTokens(connectorId: string, tokens: ConnectorTokens) {
  try {
    const store = await loadStore(TOKENS_STORE);
    await store.set(connectorId, tokens);
    await store.save();
  } catch {
    localStorage.setItem(`atom-token-${connectorId}`, JSON.stringify(tokens));
  }
}

async function loadTokens(connectorId: string): Promise<ConnectorTokens | null> {
  try {
    const store = await loadStore(TOKENS_STORE);
    return await store.get<ConnectorTokens>(connectorId) ?? null;
  } catch {
    try {
      const raw = localStorage.getItem(`atom-token-${connectorId}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}

async function clearTokens(connectorId: string) {
  try {
    const store = await loadStore(TOKENS_STORE);
    await store.delete(connectorId);
    await store.save();
  } catch {
    localStorage.removeItem(`atom-token-${connectorId}`);
  }
}

/**
 * Initiate the OAuth connection flow for a connector.
 *
 * In production this would:
 * 1. Open a browser window to the auth URL
 * 2. Listen for the redirect callback
 * 3. Exchange the code for tokens
 * 4. Store tokens securely
 *
 * Currently simulates success after a short delay.
 */
export async function connectConnector(connectorId: string): Promise<boolean> {
  const config = OAUTH_CONFIGS[connectorId];

  if (config) {
    console.log(`[Connector] Would open OAuth flow for ${connectorId}:`, config.authUrl);
  }

  // Simulate OAuth roundtrip
  await new Promise((r) => setTimeout(r, 800));

  const simulatedTokens: ConnectorTokens = {
    accessToken: `sim_${connectorId}_${Date.now()}`,
    refreshToken: `ref_${connectorId}_${Date.now()}`,
    expiresAt: Date.now() + 3600_000,
  };

  await saveTokens(connectorId, simulatedTokens);
  return true;
}

/**
 * Disconnect a connector by clearing stored tokens.
 */
export async function disconnectConnector(connectorId: string): Promise<void> {
  await clearTokens(connectorId);
}

/**
 * Check if a connector has valid stored tokens.
 */
export async function isConnectorAuthenticated(connectorId: string): Promise<boolean> {
  const tokens = await loadTokens(connectorId);
  if (!tokens) return false;
  return tokens.expiresAt > Date.now();
}
