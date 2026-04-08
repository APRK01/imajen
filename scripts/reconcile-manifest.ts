import fs from 'fs';
import path from 'path';

const MANIFEST_PATH = path.join(process.cwd(), 'public/data/manifest.json');
const MASTERPIECES_DIR = path.join(process.cwd(), 'public/masterpieces');

function reconcile() {
    console.log('🔄 RECONCILING ART CORE...');
    
    if (!fs.existsSync(MASTERPIECES_DIR)) {
        console.error('❌ MASTERPIECES_DIR NOT FOUND');
        return;
    }

    const physicalFiles = fs.readdirSync(MASTERPIECES_DIR).filter(f => f.endsWith('.png') || f.endsWith('.webp') || f.endsWith('.jpg'));
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

    // 1. Filter: Remove entries that don't exist physically
    const filteredManifest = manifest.filter((entry: any) => {
        const filename = path.basename(entry.image);
        const exists = fs.existsSync(path.join(MASTERPIECES_DIR, filename));
        if (!exists) console.log(`🗑️ Removing Ghost: ${filename}`);
        return exists;
    });

    // 2. Add: Check for physical files missing from the manifest
    physicalFiles.forEach(file => {
        const exists = filteredManifest.some((entry: any) => entry.image.endsWith(file));
        if (!exists) {
            console.log(`📦 Adding Physical: ${file}`);
            filteredManifest.push({
                id: `art-re-sync-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                image: `/masterpieces/${file}`,
                title: 'RECOVERED ARTIFACT',
                author: 'NEONAUT',
                prompt: 'Re-indexed Asset',
                model: 'RECOVERY-SYNC',
                category: 'ARCHIVED MASTERPIECE',
                date: new Date().toISOString()
            });
        }
    });

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(filteredManifest, null, 2));
    console.log(`✅ RECONCILIATION COMPLETE: ${filteredManifest.length} artworks now indexed.`);
}

reconcile();
