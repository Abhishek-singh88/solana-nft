import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import fs from "fs";

// 1. Connection
const connection = new Connection(clusterApiUrl("devnet"));

// 2. Load wallet keypair
const secretKey = JSON.parse(
  fs.readFileSync("/home/abhishek/.config/solana/id.json", "utf8")
);
const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));

// 3. Metaplex instance
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(wallet));

(async () => {
  // 4. Load Candy Machine
  const candyMachine = await metaplex.candyMachines().findByAddress({
    address: new PublicKey("PASTE_YOUR_CANDY_MACHINE_ADDRESS"),
  });

  // 5. Mint NFT
  const { nft } = await metaplex.candyMachines().mint({
    candyMachine,
  });

  console.log("✅ Minted NFT:", nft.address.toBase58());
})();
