import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import { ethers } from "ethers";
import { isValidAddress, formatBalance } from "./utils";

type MergedData = { [key: string]: string };

// Load environment variables from a .env file
dotenv.config();

// Initialize the Express application
const app: Application = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;
const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);

// Define a route for retrieving balances
app.get("/balances", async (req: Request, res: Response) => {
    const addresses: string = req.query.addresses as string;
    const addressesArray: string[] = addresses.split(",");

    // Check if addresses were provided in the request
    if (!addresses || addressesArray.length === 0) {
        return res.status(400).json({ error: "No addresses provided" });
    }

    const balances: string[] = [];

    // Fetch balances for the provided addresses
    for (const address of addressesArray) {
        if (isValidAddress(address)) {
            const balance = await provider.getBalance(address);
            balances.push(balance.toString());
        } else {
            balances.push("0");
        }
    }

    // const balances = [
    //     "0.000000123456789",
    //     "0.000000123456789",
    //     "0.123456789000000",
    //     "1.234567890000000",
    //     "12.34567890000000",
    //     "123.4567890000000",
    //     "1234.567890000000",
    // 	"1.200000000000001",
    // 	"1.000000000000001",
    // 	"123456789.0000001"
    // ];

    // Format the retrieved balances
    const formattedBalances: string[] = balances.map((balance) =>
        formatBalance(balance)
    );

    let mergedData: MergedData = {};

    addressesArray.forEach((address, index) => {
        mergedData[address] = balances[index] || "0";
    });

    // Send the formatted balances in the response
    res.send(mergedData);
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is up at http://localhost:${port}`);
});
