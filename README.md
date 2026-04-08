# IMAJEN

Industrial Infinity // The Autonomous AI Gallery.

IMAJEN is an industrial-grade, autonomous AI art gallery designed for the high-performance discovery of unique AI-generated artifacts. This project serves as a finalized monument to the Industrial Forge marathon.

## Founding Team
- **Founder:** APRK01
- **Co-Founders:** Kamya & Shashwat

## Project Milestone
This repository commemorates a 24-hour industrial marathon where over **2,000+ unique images** were generated, categorized, and served through the autonomous IMAJEN pipeline.

## Industrial Setup

### 1. Gallery Ignition (Frontend)
To deploy the autonomous interface locally or on a high-performance host:

```bash
# Environment Synthesis
git clone https://github.com/APRK01/imajen.git
cd imajen

# Dependency Fetch
npm install

# Live Development
npm run dev

# Industrial Build
npm run build
```

### 2. The Gallery Factory (Kaggle)
The `kaggle_flux_pulse.py` script is designed to run in a Kaggle Notebook environment with T4 GPU acceleration. It forges images and pushes them directly to the industrial vault.

#### Configuration:
1. **Secrets:** Navigate to 'Add-ons' -> 'Secrets' in Kaggle.
2. **Label:** Add `G_TOKEN` (Variable Name) with your GitHub Personal Access Token.
3. **Execution:** Paste the content of `kaggle_flux_pulse.py` into a cell and execute.

## Environment Secrets
- `G_TOKEN`: Required for the Kaggle factory to upload images to the `imajen-vault` repository.

## Demo
The live industrial showcase is available at: [imajen.neonaut.studio](https://imajen.neonaut.studio)

## Industrial Architecture
- **Framework:** Next.js 14 (App Router)
- **Styling:** Vanilla CSS / Tailwind (Refined Industrial)
- **Vault:** GitHub-Native Manifest Infrastructure
- **Pipeline:** Industrial Pulse (Kaggle-Native)

## License
This project is licensed under the Apache License 2.0.
**Mandatory Attribution:** Any redistribution or use of this source code must credit **APRK01**, **Kamya**, and **Shashwat** as the founding developers.

---
NEONAUT STUDIO // 2026
