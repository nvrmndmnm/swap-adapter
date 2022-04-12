import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

const { expect } = require("chai");

describe("Adapter contract", () => {
    let Token: ContractFactory;
    let Adapter: ContractFactory;
    let tokenTST: Contract;
    let tokenACDM: Contract;
    let tokenPOP: Contract;
    let adapter: Contract;
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    let addr3: SignerWithAddress;


    beforeEach(async () => {
        Token = await ethers.getContractFactory("ACDMToken");
        Adapter = await ethers.getContractFactory("ACDMPlatform");
        [owner, addr1, addr2, addr3] = await ethers.getSigners();


        tokenTST = await Token.deploy("TST Token", "TST");
        tokenACDM = await Token.deploy("ACDM Token", "ACDM");
        tokenPOP = await Token.deploy("POP Token", "POP");

        adapter = await Adapter.deploy();
        tokenTST.mint(addr1.address, 100000);
        tokenACDM.mint(addr1.address, 100000);
        tokenPOP.mint(addr1.address, 100000);

    });

    describe("Deployment", () => {
        it("Should have correct initial values", async () => {
            
        });
    });

    describe("Uniswap functionality", () => {
        it("Should create a tokens pair", async () => {
            
        });
    });
});