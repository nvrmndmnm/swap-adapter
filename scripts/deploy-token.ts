import { ethers } from "hardhat";
import 'dotenv/config';

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const Token = await ethers.getContractFactory("Token");
    const tokenTST = await Token.deploy("TST Token", "TST");
    await tokenTST.deployed();

    console.log("TST contract address:", tokenTST.address);

    const tokenACDM = await Token.deploy("ACDM Token", "ACDM");
    await tokenACDM.deployed();

    console.log("ACDM contract address:", tokenACDM.address);

    const tokenPOP = await Token.deploy("POP Token", "POP");
    await tokenPOP.deployed();

    console.log("POP contract address:", tokenPOP.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });