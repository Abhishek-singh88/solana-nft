import { 
  Metaplex, 
  keypairIdentity, 
  toBigNumber 
} from "@metaplex-foundation/js";
import { 
  Connection, 
  clusterApiUrl, 
  Keypair 
} from "@solana/web3.js";
import fs from "fs";

// 1. Connection
const connection = new Connection(clusterApiUrl("devnet"));

// 2. Load wallet
const secretKey = JSON.parse(
  fs.readFileSync("/home/abhishek/.config/solana/id.json", "utf8")
);
const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));

// 3. Metaplex instance
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(wallet));

(async () => {
  // 4. Create collection NFT
  const { nft: collectionNft } = await metaplex.nfts().create({
    name: "Lesson Collection",
    symbol: "LESSON",
    uri: "https://arweave.net/COLLECTION_METADATA.json",
    sellerFeeBasisPoints: 0,
    isCollection: true,
  });

  console.log("✅ Collection NFT:", collectionNft.address.toBase58());

  // 5. Create Candy Machine
  const { candyMachine } = await metaplex.candyMachines().create({
    itemsAvailable: toBigNumber(5),
    sellerFeeBasisPoints: 0,
    symbol: "LESSON",
    collection: {
      address: collectionNft.address,
      updateAuthority: wallet,
    },
  });

  console.log("🍬 Candy Machine:", candyMachine.address.toBase58());

  // 6. Insert items
  await metaplex.candyMachines().insertItems({
    candyMachine,
    items: [
      { name: "Lesson #1", uri: "https://arweave.net/1.json" },
      { name: "Lesson #2", uri: "https://arweave.net/2.json" },
      { name: "Lesson #3", uri: "https://arweave.net/3.json" },
      { name: "Lesson #4", uri: "https://arweave.net/4.json" },
      { name: "Lesson #5", uri: "https://arweave.net/5.json" },
    ],
  });

  console.log("✅ Items inserted");
})();
