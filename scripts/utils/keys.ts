import fs from 'fs';
import path from 'path';

/**
 * NEONAUT KEY CLUSTER UTILITY
 * Manages rotation and health of multiple API keys to maintain 100% uptime.
 */

// Manual .env loader for Zero-Dependency Stability
const envMap: Record<string, string> = {};
const envPath = path.join(process.cwd(), 'abc.env');

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      if (key && value) envMap[key] = value;
    }
  });
}

const getEnv = (key: string) => envMap[key] || process.env[key] || "";

export class KeyRotator {
  private keys: string[];
  private currentIndex: number = 0;

  constructor(keys: string[]) {
    this.keys = keys.filter(k => k && k.length > 0);
    if (this.keys.length === 0) {
      console.warn("⚠️ KEY_CLUSTER: No keys provided for rotation.");
    }
  }

  public getNext(): string {
    if (this.keys.length === 0) return "";
    const key = this.keys[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    return key;
  }
}

// Initialization of Key Clusters from Environment Cluster
export const GROQ_CLUSTER = new KeyRotator([
  getEnv('GROQ_API_KEY_1'),
  getEnv('GROQ_API_KEY_2'),
  getEnv('GROQ_API_KEY_3'),
  getEnv('GROQ_API_KEY_4'),
  getEnv('GROQ_API_KEY_5'),
]);

export const GEMINI_KEY = getEnv('GEMINI_API_KEY');
export const HF_TOKEN = getEnv('HF_TOKEN');
export const SILICON_FLOW_KEY = getEnv('SILICON_FLOW_KEY');
export const GROK_API_KEY = getEnv('GROK_API_KEY');
export const CLOUDFLARE_ACCOUNT_ID = getEnv('CLOUDFLARE_ACCOUNT_ID');
export const CLOUDFLARE_API_TOKEN = getEnv('CLOUDFLARE_API_TOKEN');
