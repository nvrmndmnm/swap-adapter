import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

const { expect } = require("chai");
const FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

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
        Token = await ethers.getContractFactory("Token");
        Adapter = await ethers.getContractFactory("Adapter");
        [owner, addr1, addr2, addr3] = await ethers.getSigners();


        tokenTST = await Token.deploy("TST Token", "TST");
        tokenACDM = await Token.deploy("ACDM Token", "ACDM");
        tokenPOP = await Token.deploy("POP Token", "POP");

        adapter = await Adapter.deploy(FACTORY_ADDRESS, ROUTER_ADDRESS);
        tokenTST.mint(addr1.address, ethers.utils.parseUnits('100000'));
        tokenACDM.mint(addr1.address, ethers.utils.parseUnits('100000'));
        tokenPOP.mint(addr1.address, ethers.utils.parseUnits('100000'));
        tokenTST.mint(addr2.address, ethers.utils.parseUnits('100000'));
        tokenACDM.mint(addr2.address, ethers.utils.parseUnits('100000'));
        tokenPOP.mint(addr2.address, ethers.utils.parseUnits('100000'));

    });

    describe("Deployment", () => {
        it("Should have correct initial values", async () => {
            expect(await adapter.factory()).to.equal(FACTORY_ADDRESS);
            expect(await adapter.router()).to.equal(ROUTER_ADDRESS);
        });
    });

    describe("Uniswap functionality", () => {
        it("Should create a pair, add and remove liquidity", async () => {
            const block = await ethers.provider.getBlock("latest");
            const deadline = block.timestamp + 100;

            //Create a new pair of tokens
            const txCreatePair = await adapter.createPair(tokenTST.address, tokenACDM.address);
            const receiptCreatePair = await txCreatePair.wait();
            const pair = receiptCreatePair.events.find((event: { event: string; }) =>
                event.event === 'PairCreated').args.pair;
            const pairContract = await ethers.getContractAt('Token', pair);

            //Add liquidity
            await tokenTST.connect(addr1).approve(adapter.address, 10000);
            await tokenACDM.connect(addr1).approve(adapter.address, 1000);

            const txAddLiquidity = await adapter.connect(addr1).addLiquidity(
                tokenTST.address,
                tokenACDM.address,
                10000,
                1000,
                9500,
                950,
                addr1.address,
                deadline
            );
            const receiptAddLiquidity = await txAddLiquidity.wait();
            const amountLiquidity = receiptAddLiquidity.events.find((event: { event: string; }) =>
                event.event === 'LiquidityProvided').args.amountLiquidity;

            //Get amounts
            await adapter.getAmountsOut(10000, [tokenTST.address, tokenACDM.address]);
            await adapter.connect(addr1).getAmountsIn(1000, [tokenACDM.address, tokenTST.address]);

            //Remove liquidity
            await pairContract.connect(addr1).approve(adapter.address, amountLiquidity);

            await adapter.connect(addr1).removeLiquidity(
                tokenTST.address,
                tokenACDM.address,
                amountLiquidity,
                5000,
                500,
                addr1.address,
                deadline
            );
        });

        it("Should swap tokens", async () => {
            const block = await ethers.provider.getBlock("latest");
            const deadline = block.timestamp + 100;

            //Create a new pair of tokens
            const txCreatePair = await adapter.createPair(tokenTST.address, tokenACDM.address);
            const receiptCreatePair = await txCreatePair.wait();
            const pair = receiptCreatePair.events.find((event: { event: string; }) =>
                event.event === 'PairCreated').args.pair;
            const pairContract = await ethers.getContractAt('Token', pair);

            //Add liquidity
            const am1 = ethers.utils.parseUnits('10000');
            const am2 = ethers.utils.parseUnits('1000');
            await tokenTST.connect(addr1).approve(adapter.address, am1);
            await tokenACDM.connect(addr1).approve(adapter.address, am2);

            const txAddLiquidity = await adapter.connect(addr1).addLiquidity(
                tokenTST.address,
                tokenACDM.address,
                am1,
                am2,
                9500,
                950,
                addr1.address,
                deadline
            );
            const receiptAddLiquidity = await txAddLiquidity.wait();

            //Swap exact tokens for tokens
            await tokenACDM.connect(addr2).approve(adapter.address, ethers.utils.parseUnits('1000'));
            await adapter.connect(addr2).swapExactTokensForTokens(
                ethers.utils.parseUnits('1000'),
                ethers.utils.parseUnits('950'),
                [tokenACDM.address, tokenTST.address],
                addr2.address,
                deadline
            );

            //Swap tokens for exact tokens
            await tokenACDM.connect(addr2).approve(adapter.address, ethers.utils.parseUnits('1000'));
            await adapter.connect(addr2).swapTokensForExactTokens(
                ethers.utils.parseUnits('1000'),
                ethers.utils.parseUnits('950'),
                [tokenACDM.address, tokenTST.address],
                addr2.address,
                deadline
            );
        });
    });
});