import { address, createSolanaClient, getProgramDerivedAddress } from "gill";
import { fetchVault } from "./clients/js/src/generated/accounts/vault";
import bs58 from "bs58"

// Replace this with your actual Vault PDA
// const vaultPubkey = address("8555qe2XDNAg6bYG4noBveWq1Gwap9hHzE2W3s2oSgH5");
const programId = address("6qrkjKfD3zALj1ANfKdmz1wP8688xZvsC5R8R5H2bz56");
const [vaultPubkey] = await getProgramDerivedAddress({
  programAddress: programId,
  seeds: [
    Buffer.from("vault"),
    bs58.decode("8TRQEYYWEyP3yvFQjV93EKd8E6Si5ZcNCFc3PyKigFWc")
  ]

})
const { rpc } = createSolanaClient({ urlOrMoniker: "devnet" });

async function readVault() {
  try {
    const vault = await fetchVault(rpc, vaultPubkey);
    console.log("✅ Vault data:");
    console.log("  Masterhash:", vault.data.masterhash);
    console.log("  veCount:", vault.data.entryCount.toString());
    console.log("  cidCount:", vault.data.cidCount.toString());
  } catch (err) {
    console.error("❌ Failed to read vault:", err);
  }
}

readVault();
