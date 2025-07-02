
// import { createTransaction, createSolanaClient } from "gill";
import { loadKeypairSignerFromFile } from "gill/node";
import { getAddMemoInstruction, getAssociatedTokenAccountAddress, getCreateNativeMintInstruction, getCreateTokenInstructions, getMintTokensInstructions, getTokenMetadataAddress } from "gill/programs";
import {
    createTransaction,
    createSolanaClient,
    signTransactionMessageWithSigners,
    getSignatureFromTransaction,
    generateKeyPairSigner,
    address,
} from "gill";

/**
 * load the Solana CLI's default keypair file (`~/.config/solana/id.json`)
 * as a signer into your script
 */
const signer = await loadKeypairSignerFromFile();

const { rpc, sendAndConfirmTransaction } = createSolanaClient({
    urlOrMoniker: "devnet",
});
const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
// const mint = await generateKeyPairSigner()
const mint = address("6QRY8Stw4VzgGSLeTavBNAcpVNHV2ArFnpg7GKQx5vrL");
const destination = address("DWyWmTCLqfLAzfeiaDZmxVa2Y8qWaehYyHsiFtpPNfND");
// const instructions = getCreateTokenInstructions(
//     {
//         decimals: 6,
//         mintAuthority: signer,
//         updateAuthority: signer,
//         metadata: {
//             name: "ZORO",
//             symbol: "ZORO",
//             uri: "https://static.vecteezy.com/system/resources/previews/033/530/421/non_2x/roronoa-zoro-onepiece-icon-free-png.png",
//             isMutable: false
//         },
//         feePayer: signer,
//         mint: mint,
//         metadataAddress: await getTokenMetadataAddress(mint.address)
//     }
// );

const mintInstrction = getMintTokensInstructions({
    mint,
    feePayer: signer,
    mintAuthority: signer,
    destination: destination,
    ata: await getAssociatedTokenAccountAddress(mint, destination),
    amount: 100_000_000_000_000
})

const transaction = createTransaction({
    version: "legacy", // or `0` if using address lookup tables
    feePayer: signer,
    instructions: [
        ...mintInstrction, // the array from getMintTokensInstructions
        getAddMemoInstruction({ memo: "100M token minted" }),
    ],
    latestBlockhash,
    // computeUnitLimit, // optional, but highly5 recommend to set
    // computeUnitPrice, // optional, but highly recommend to set
});


const signedTransaction = await signTransactionMessageWithSigners(transaction);

const signature = getSignatureFromTransaction(signedTransaction);

try {
    console.log("Sending transaction:", signature);

    await sendAndConfirmTransaction(signedTransaction);

    console.log("Transaction confirmed!");
} catch (err) {
    console.error("Unable to send and confirm the transaction");
    console.error(err);
}
