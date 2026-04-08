# 1. SETUP & TOOLS
!pip install -U diffusers transformers accelerate safetensors

import os, torch, time, json, base64, requests, gc, random
from io import BytesIO
from datetime import datetime
from PIL import Image
from diffusers import DiffusionPipeline

# --- INDUSTRIAL CONFIG ---
# Use Kaggle secrets for G_TOKEN: Add to 'Add-ons' -> 'Secrets'
GITHUB_TOKEN = os.getenv('G_TOKEN')
VAULT_REPO = "APRK01/imajen-vault"
BRANCH = "main"

# 2. ENGAGE ENGINE (SDXL Industrial Core)
gc.collect(); torch.cuda.empty_cache()
print("🌪️ NEONAUT: Loading Multi-Verse Industrial Engine [v6 COLOR]...")
pipe = DiffusionPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0", 
    torch_dtype=torch.float16, variant="fp16", use_safetensors=True
).to("cuda")

# 3. THE MULTI-VERSE SCRAMBLER CORE (UNLOCKED SPECTRUM)
def generate_industrial_prompt():
    realms = {
        "Oceanic Abyssal": {
            "subjects": ["submerged brutalist rig", "bioluminescent trench structure", "abyssal mining base", "weathered sea-wall", "monolithic underwater silo"],
            "materials": ["black obsidian", "rusted iron", "matte-finish steel", "bio-reactive coral"],
            "moods": ["deep-sea gloom", "bioluminescent red glow", "abyssal blue haze", "faint bioluminescence"],
        },
        "Ancient Monumental": {
            "subjects": ["collapsed marble aqueduct", "brutalist colosseum", "oxidized bronze monolith", "limestone temple ruin", "granite column array"],
            "materials": ["veined white marble", "weathered limestone", "oxidized bronze", "raw concrete"],
            "moods": ["sunset amber glow", "dusty historic air", "overcast shadow", "harsh midday sun"],
        },
        "Ethereal Void": {
            "subjects": ["floating marble pyramid", "geometric star-temple", "monolithic prism", "endless limestone pillar"],
            "materials": ["crystalline glass", "polished chrome", "white marble", "glowing stone"],
            "moods": ["starlight silver", "ethereal white-out", "nebula purple glow", "stellar silence"],
        },
        "Industrial Brutalism": {
            "subjects": ["monolithic concrete tower", "brutalist dam", "abandoned silo", "raw concrete bridge", "massive cooling tower"],
            "materials": ["weathered concrete", "rusted rebar", "exposed beams", "form-work textures"],
            "moods": ["heavy fog", "industrial sunset", "dusk gloom", "sharp shadows"],
        },
        "Deep Space": {
            "subjects": ["sleek obsidian station", "orbital rings", "monolithic starship", "cylindrical habitat"],
            "materials": ["polished chrome", "dark obsidian", "matte ceramic", "plasma-glass"],
            "moods": ["distant nebulae", "stark starlight", "void-black", "cinematic lens flare"],
        },
        "Neon Cyberpunk": {
            "subjects": ["rainy data-center", "wire-clutter alleyway", "obsidian monolith street", "flooded subterranean server-vault"],
            "materials": ["wet obsidian", "tangled cables", "neon signage", "holographic glass"],
            "moods": ["acid rain", "neon-glow", "night-city fog", "sharp noir lighting"],
        }
    }
    
    realm_name = random.choice(list(realms.keys()))
    realm = realms[realm_name]
    
    subject = random.choice(realm["subjects"])
    material = random.choice(realm["materials"])
    mood = random.choice(realm["moods"])
    
    prompt = f"{subject} made of {material} in {mood}, industrial aesthetic, cinematic lighting, masterpiece, highly detailed, 8k, editorial photography"
    return prompt, realm_name

def mass_forge_v6(total_target=700, batch_size=10):
    print(f"🧬 NEONAUT MULTI-VERSE IGNITION [COLOR]: Targetting {total_target} Unique Masterpieces...")
    
    total_completed = 0
    while total_completed < total_target:
        batch_entries = []
        current_batch_size = min(batch_size, total_target - total_completed)
        
        print(f"  🎨 BATCH START: Painting {current_batch_size} diverse COLOR images...")
        for i in range(current_batch_size):
            gc.collect(); torch.cuda.empty_cache()
            
            prompt, style_name = generate_industrial_prompt()
            print(f"    ✨ Image {total_completed + i + 1}: [{style_name}] -> {prompt[:50]}...")
            
            image = pipe(
                prompt=prompt,
                negative_prompt="blurry, distorted, text, watermark, messy, low quality, grayscale, monochrome",
                num_inference_steps=30, guidance_scale=7.5, width=1024, height=1024,
            ).images[0]
            
            buffered = BytesIO()
            image.save(buffered, format="PNG")
            img_data = buffered.getvalue()
            file_ts = int(time.time())
            file_name = f"art-{file_ts}-{i}.png"
            content_b64 = base64.b64encode(img_data).decode('utf-8')
            
            put_url = f"https://api.github.com/repos/{VAULT_REPO}/contents/{file_name}"
            requests.put(
                put_url, headers={"Authorization": f"token {GITHUB_TOKEN}"},
                json={"message": f"🌪️ v6 MONUMENTAL DROP: {style_name}", "content": content_b64, "branch": BRANCH}
            )
            
            batch_entries.append({
                "id": f"sdxl-{file_ts}-{i}",
                "image": f"https://cdn.jsdelivr.net/gh/{VAULT_REPO}@{BRANCH}/{file_name}",
                "title": f"Monument {total_completed + i + 1}",
                "author": "NEONAUT-MULTI-VERSE", "prompt": prompt,
                "model": "SDXL-1.0-Base", "category": style_name, "date": datetime.now().isoformat()
            })
        
        # ATOMIC SYNC
        manifest_url = f"https://api.github.com/repos/{VAULT_REPO}/contents/manifest.json"
        mr = requests.get(manifest_url, headers={"Authorization": f"token {GITHUB_TOKEN}"})
        m_sha = mr.json()['sha'] if mr.status_code == 200 else None
        current_m = json.loads(base64.b64decode(mr.json()['content']).decode('utf-8')) if mr.status_code == 200 else []
        updated_m = batch_entries + current_m
        m_b64 = base64.b64encode(json.dumps(updated_m, indent=2).encode('utf-8')).decode('utf-8')
        
        requests.put(
            manifest_url, headers={"Authorization": f"token {GITHUB_TOKEN}"},
            json={"message": "🧬 MONUMENT CROSS-SYNC [v6 Factory]", "content": m_b64, "sha": m_sha, "branch": BRANCH}
        )
        
        total_completed += current_batch_size
        print(f"✅ ANCHOR COMPLETE: {total_completed}/{total_target} crystallized.")

# --- THE FACTORY TRIGGER ---
mass_forge_v6(total_target=700) 
