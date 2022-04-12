import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import 'dotenv/config';

const ADAPTER_ADDRESS = `${process.env.ADAPTER_ADDRESS}`;

task("create-pair", "Register new address")
    .addParam("address", "Signer address")
    .addParam("token0", "First token in pair")
    .addParam("token1", "Second token in pair")
    .setAction(async (args, hre) => {
        const adapter = await hre.ethers.getContractAt("Adapter", ADAPTER_ADDRESS);
        const signer = await hre.ethers.getSigner(args.address);
        await adapter.connect(signer).createPair(args.token0, args.token1);
        console.log(`Created a new pair`);
    });
//add-liquidity
//remove-liquidity
//get-price
//trade
