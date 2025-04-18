import express from "express";
import { Aptos, AptosConfig, Network, AccountAddress } from "@aptos-labs/ts-sdk";

const app = express();
const port = 3000;

const APTOS_NETWORK = Network.TESTNET;
const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

const bobAddress = "0xaae1b37ed0779136bff41432195b43199877965ad6d591e3521fc0fe2f76ec83";

app.get("/nfts", async (req, res) => {
    try {
        const bobNFTs = await aptos.getOwnedDigitalAssets({
            ownerAddress: AccountAddress.fromString(bobAddress),
        });

        console.log("Fetched NFTs:", bobNFTs);  // Log the fetched NFTs to see if there's more than one

        if (bobNFTs.length === 0) {
            res.status(200).json({ message: "No NFTs found for Bob." });
        } else {
            const nfts = bobNFTs.map((nft, index) => {
                const data = nft.current_token_data;
                return {
                    name: data?.token_name,
                    description: data?.description,
                    metadataURI: data?.token_uri || data?.metadata_uri || "N/A",
                    imageUrl: "", // You can set an image URL here after fetching metadata if needed
                };
            });

            res.status(200).json({ nfts });
        }
    } catch (error) {
        console.error("Error fetching NFTs:", error);
        res.status(500).json({ error: "Failed to fetch NFTs" });
    }
});


app.use(express.static("public"));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
