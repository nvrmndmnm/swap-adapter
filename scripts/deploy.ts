import { ethers } from "hardhat";
import 'dotenv/config';

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const Adapter = await ethers.getContractFactory("Adapter");
    const adapter = await Adapter.deploy();
    await adapter.deployed();

    console.log("Adapter contract address:", adapter.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });