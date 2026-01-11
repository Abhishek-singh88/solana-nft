import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Connection, Keypair, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const wallet = Keypair.fromSecretKey(
  Uint8Array.from(require("../wallet.json"))
);

const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(wallet));

(async () => {
  // 1. Create collection NFT
  const { nft: collectionNft } = await metaplex.nfts().create({
    name: "Lesson Collection",
    symbol: "LESSON",
    uri: "https://arweave.net/COLLECTION_METADATA.json",
    isCollection: true,
  });

  // 2. Create Candy Machine
  const { candyMachine } = await metaplex.candyMachines().create({
    itemsAvailable: 5,
    sellerFeeBasisPoints: 0,
    collection: collectionNft.address,
    symbol: "LESSON",
  });

  // 3. Insert items
  await metaplex.candyMachines().insertItems({
    candyMachine,
    items: [
      { name: "Lesson #1", uri: "https://arweave.net/1.json" },
      { name: "Lesson #2", uri: "https://arweave.net/2.json" },
    ],
  });

  console.log("Candy Machine:", candyMachine.address.toBase58());
})();
