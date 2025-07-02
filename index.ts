// import { createTransaction, createSolanaClient } from "gill";
import { loadKeypairSignerFromFile } from "gill/node";
import { getAddMemoInstruction } from "gill/programs";
import {
    createTransaction,
    createSolanaClient,
    signTransactionMessageWithSigners,
    getSignatureFromTransaction,
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

const transaction = createTransaction({
    version: "legacy", // or `0` if using address lookup tables
    feePayer: signer,
    instructions: [
        getAddMemoInstruction({
            memo: "gm world!",
        }),
    ],
    latestBlockhash,
    // computeUnitLimit, // optional, but highly recommend to set
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
