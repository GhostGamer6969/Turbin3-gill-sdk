import { createTransaction, getMinimumBalanceForRentExemption, KeyPairSigner, generateKeyPairSigner, createSolanaClient, getExplorerLink, getSignatureFromTransaction, address } from "gill";
import { AssociatedTokenInstruction, getAssociatedTokenAccountAddress, getInitializeMintInstruction, getMintSize, getMintToInstruction, TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from "gill/programs/token";
import { loadKeypairSignerFromFile } from "gill/node";
import { getCreateMetadataAccountV3Instruction, getCreateAccountInstruction, getTokenMetadataAddress, getMintTokensInstructions } from "gill/programs";

const { rpc, sendAndConfirmTransaction } = createSolanaClient({
    urlOrMoniker: "devnet", // `mainnet`, `localnet`, etc
});

// This defaults to the file path used by the Solana CLI: `~/.config/solana/id.json`
const signer: KeyPairSigner = await loadKeypairSignerFromFile();
console.log("signer:", signer.address);

const tokenProgram = TOKEN_PROGRAM_ADDRESS;
const space = getMintSize();


const mint = await generateKeyPairSigner();
const metadataAddress = await getTokenMetadataAddress(mint);


const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const transaction = createTransaction({
    feePayer: signer,
    version: "legacy",
    instructions: [
        getCreateAccountInstruction({
            space,
            lamports: getMinimumBalanceForRentExemption(space),
            newAccount: mint,
            payer: signer,
            programAddress: tokenProgram,
        }),
        getInitializeMintInstruction(
            {
                mint: mint.address,
                mintAuthority: signer.address,
                freezeAuthority: signer.address,
                decimals: 0,
            },
            {
                programAddress: tokenProgram,
            },
        ),
        getCreateMetadataAccountV3Instruction({
            collectionDetails: null,
            isMutable: true,
            updateAuthority: signer,
            mint: mint.address,
            metadata: metadataAddress,
            mintAuthority: signer,
            payer: signer,
            data: {
                sellerFeeBasisPoints: 500,
                collection: null,
                creators: null,
                uses: null,
                name: "JohnnyRuggg",
                symbol: "JRUG",
                uri: "https://devnet.irys.xyz/J5kWZBBSfv5sZAMFH2VSUzb8yYsN65enTYSouYxtjF8q",
            },
        }),
        ...getMintTokensInstructions({
            mint: mint,
            feePayer: signer,
            mintAuthority: signer,
            destination: signer.address,
            ata: await getAssociatedTokenAccountAddress(mint, signer.address),
            amount: 1
        }),
    ],
    latestBlockhash,
});

import { signTransactionMessageWithSigners } from "gill";

const signedTransaction = await signTransactionMessageWithSigners(transaction);

console.log(
    "Explorer:",
    getExplorerLink({
        cluster: "devnet",
        transaction: getSignatureFromTransaction(signedTransaction),
    }),
);
await sendAndConfirmTransaction(signedTransaction);
