import { ethers } from "hardhat";
import 'dotenv/config';

async function main() {
    const FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
    const ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const Adapter = await ethers.getContractFactory("Adapter");
    const adapter = await Adapter.deploy(FACTORY_ADDRESS, ROUTER_ADDRESS);
    await adapter.deployed();

    console.log("Adapter contract address:", adapter.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });