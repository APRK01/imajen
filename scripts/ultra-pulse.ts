import fs from 'fs';
import path from 'path';
import { SignatureStyle } from './config/signatures';
import { GROQ_CLUSTER, GEMINI_KEY, HF_TOKEN, SILICON_FLOW_KEY, GROK_API_KEY, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN } from './utils/keys';
import { execSync } from 'child_process';

const MANIFEST_PATH = path.join(process.cwd(), 'public/data/manifest.json');
const ARCHIVE_DIR = path.join(process.cwd(), 'public/masterpieces');

/** 
 * INDUSTRIAL CONFIGURATION:
 * We are pivoting to 'imajen-vault' as the dedicated store for Flux.1 artworks.
 */
const ASSET_VAULT_CDN = 'https://cdn.jsdelivr.net/gh/APRK01/imajen-vault@main/';
const ASSET_VAULT_REPO = 'APRK01/imajen-vault';

interface ArtEntry {
  id: string;
  image: string;
  title: string;
  author: string;
  prompt: string;
  model: string;
  category: string;
  date: string;
}

/**
 * Stage 0: The Creative Director (Autonomous Style Synthesis)
 */
async function synthesizeAutonomousStyles(count: number): Promise<SignatureStyle[]> {
  const groqKey = GROQ_CLUSTER.getNext();
  if (!groqKey) return [];

  console.log(`🧠 DIRECTOR: Synthesizing ${count} unique aesthetics...`);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{
          role: "system",
          content: `You are the NEONAUT Creative Director. Your goal is to invent highly aesthetic, world-class signature styles for an AI art museum.
          
          STRICT CONSTRAINTS:
          1. NO ANIME or Manga styles.
          2. NO CYBERPUNK, NO generic "neon city" tropes.
          3. NO repetitive "Crystals" or "Snowflakes" (avoid over-use).
          4. CATEGORY ROTATION: Pick exactly 3 styles from each of these 5 categories: 
             [Brutalist Architecture, High-Fashion Abstract, Macro Nature/Organic, Deep-Space Celestial, Minimalist Interior Editorial].
          5. Quality must be "Masterpiece" level. Focus on textures (cloth, concrete, dust, fog, light).
          
          Return a JSON array of ${count} objects following the SignatureStyle interface.`
        }],
        temperature: 0.9,
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    const parsed = JSON.parse(content);
    const styles = Array.isArray(parsed) ? parsed : (parsed.styles || Object.values(parsed)[0]);
    
    return (styles as SignatureStyle[]).map((s, i) => ({
      ...s,
      id: `auto-${Date.now()}-${i}`,
      model: "black-forest-labs/FLUX.1-schnell",
      provider: "siliconflow"
    }));
  } catch (err) {
    console.error("Director Failure:", err);
    return [];
  }
}

/**
 * Stage 1: The Brain (Recipe Refinement)
 */
async function generatePrompt(style: SignatureStyle): Promise<string> {
  const groqKey = GROQ_CLUSTER.getNext();
  if (!groqKey) return style.prompt_prefix;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{
          role: "system",
          content: `You are the NEONAUT Fine-Tuner. Expand the base recipe into a hyper-detailed, technical AI art prompt. Style: ${style.name}.`
        }, {
          role: "user",
          content: `Evolve this recipe: ${style.prompt_prefix}`
        }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || style.prompt_prefix;
  } catch (err) {
    return style.prompt_prefix;
  }
}

/**
 * Stage 2: The Painter (Image Generation)
 */
async function paintArt(style: SignatureStyle, prompt: string): Promise<string | null> {
  if (style.provider === 'siliconflow' && SILICON_FLOW_KEY) {
    try {
      const response = await fetch("https://api.siliconflow.com/v1/images/generations", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SILICON_FLOW_KEY.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: style.model,
          prompt: prompt,
          batch_size: 1
        })
      });

      if (!response.ok) throw new Error(`SiliconFlow Fail: ${response.status}`);
      const data = await response.json();
      return data.images?.[0]?.url || null;
    } catch (err) {
      console.error(`Painter Fail:`, err);
      return null;
    }
  }
  return null;
}

/**
 * Stage 3: The Archive (Cloud Vault Logic)
 */
async function downloadImage(urlOrPath: string, styleId: string, retries = 3): Promise<{ localPath: string, publicUrl: string, fileName: string } | null> {
  const fileName = `art-${styleId}-${Date.now()}.png`;
  if (!fs.existsSync(ARCHIVE_DIR)) fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
  const filePath = path.join(ARCHIVE_DIR, fileName);

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(urlOrPath);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
      return { 
        localPath: filePath, 
        publicUrl: `${ASSET_VAULT_CDN}${fileName}`,
        fileName: fileName
      };
    } catch (err) {
      if (i === retries - 1) return null;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  return null;
}

async function pushToVaultAndClean(fileName: string, localPath: string, styleName: string) {
  console.log(`📡 ANCHORING TO CLOUD VAULT: ${fileName}...`);
  try {
    const content = fs.readFileSync(localPath, 'base64');
    
    // Uploading to the brand new 'imajen-vault' dedicated repository
    execSync(`gh api --method PUT /repos/${ASSET_VAULT_REPO}/contents/${fileName} \
      -f message="✨ FLUX DISCOVERY: [${styleName}]" \
      -f content="${content}"`);
    
    fs.unlinkSync(localPath);
    console.log(`✅ VAULT SECURED: Cloud anchor crystallized in the Industrial Core.`);
  } catch (err) {
    console.error(`❌ VAULT FAILURE: ${err}`);
  }
}

async function updateManifest(entries: ArtEntry[]) {
  let manifest: ArtEntry[] = [];
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    } catch (err) { console.warn("Manifest Corrupt."); }
  }
  manifest = [...entries, ...manifest];
  if (manifest.length > 20000) manifest = manifest.slice(0, 20000); // Expanded capacity for Industrial Era
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

async function updateMainRepo(styleName: string) {
  if (process.env.GITHUB_ACTIONS !== 'true') return;
  try {
    console.log(`📡 SYNCING MANIFEST: ${styleName}...`);
    execSync('git config --global user.name "neonaut-bot"');
    execSync('git config --global user.email "bot@neonaut.studio"');
    execSync('git add public/data/manifest.json');
    execSync(`git commit -m "🧬 MANIFEST SYNC: [${styleName}]"`);
    execSync('git push origin main');
  } catch (err) { console.warn(`Sync Skip: ${err}`); }
}

/**
 * Stage 4: The Infinite Orchestration
 */
export async function triggerPulse() {
  console.log(`⚡ NEONAUT ULTRA-PULSE: INDUSTRIAL KAGGLE PIVOT...`);
  
  let stylesToPulse = await synthesizeAutonomousStyles(1); // Single style for test
  
  if (stylesToPulse.length === 0) {
    stylesToPulse = [{
      id: `emerg-${Date.now()}`,
      name: "Brutalist Editorial",
      model: "black-forest-labs/FLUX.1-schnell",
      provider: "siliconflow",
      character: "Concrete vibe",
      theme: "Genesis survival",
      prompt_prefix: "brutalist architecture editorial"
    }];
  }

  const SPAWN_COUNT = 1; // Single image for test

  for (const style of stylesToPulse) {
    try {
      console.log(`📡 DISCOVERING: ${style.name}...`);
      const newSpawns: ArtEntry[] = [];

      for (let i = 0; i < SPAWN_COUNT; i++) {
        const prompt = await generatePrompt(style);
        const sourceUrl = await paintArt(style, prompt);
        if (!sourceUrl) continue;

        const assetData = await downloadImage(sourceUrl, style.id);
        if (!assetData) continue;

        await pushToVaultAndClean(assetData.fileName, assetData.localPath, style.name);

        newSpawns.push({
          id: `${style.id}-${Date.now()}-${i}`,
          image: assetData.publicUrl,
          title: style.theme,
          author: "NEONAUT-FLUX",
          prompt: prompt,
          model: style.model,
          category: style.name.split(' ')[0],
          date: new Date().toISOString()
        });
        console.log(`  └─ Spawn ${i+1}/${SPAWN_COUNT} Vaulted.`);
      }

      if (newSpawns.length > 0) {
        await updateManifest(newSpawns);
        await updateMainRepo(style.name);
      }
    } catch (err) {
      console.error(`Style Collapse:`, err);
    }
  }

  console.log(`✨ INDUSTRIAL CYCLE COMPLETE: 0 Bytes locally used.`);
}

if (require.main === module) {
  triggerPulse();
}
