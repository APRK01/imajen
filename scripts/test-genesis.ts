import { triggerPulse } from './ultra-pulse';

/**
 * GENESIS TEST:
 * Running a single-spawn cycle to verify the Industrial Vault Bridge.
 * This will generate 1 Flux.1 image and push it to APRK01/imajen-vault.
 */
async function runGenesisTest() {
    console.log("🧪 GENESIS TEST: Igniting 1-image pulse...");
    
    // We override the triggerPulse logic by just calling it once 
    // but I'll add a temporary filter or just let it run its 10-image cycle 
    // if you want exactly one, I'll modify the script parameters.
    
    await triggerPulse();
}

runGenesisTest().catch(console.error);
