import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import 'dotenv/config';

const ADAPTER_ADDRESS = `${process.env.ADAPTER_ADDRESS}`;

task("create-pair", "Register new address")
    .addParam("address", "Signer address")
    .addParam("tokenA", "First token in pair")
    .addParam("tokenB", "Second token in pair")
    .setAction(async (args, hre) => {
        const adapter = await hre.ethers.getContractAt("Adapter", ADAPTER_ADDRESS);
        const signer = await hre.ethers.getSigner(args.address);
        await adapter.connect(signer).createPair(args.tokenA, args.tokenB);
        console.log(`Created a new pair`);
    });

task("add-liquidity", "Provide liquidity to the pool")
    .addParam("address", "Signer address")
    .addParam("tokenA", "First token in pair")
    .addParam("tokenB", "Second token in pair")
    .addParam("amountADesired", "Desired amount of first token")
    .addParam("amountBDesired", "Desired amount of second token")
    .addParam("amountAMin", "The extent to which the B/A price can go up")
    .addParam("amountBMin", "The extent to which the A/B price can go up")
    .addParam("to", "Recipient address")
    .addParam("deadline", "Deadline timestamp")
    .setAction(async (args, hre) => {
        const adapter = await hre.ethers.getContractAt("Adapter", ADAPTER_ADDRESS);
        const signer = await hre.ethers.getSigner(args.address);
        await adapter.connect(signer).addLiquidity(
            args.tokenA,
            args.tokenB,
            args.amountADesired,
            args.amountBDesired,
            args.amountAMin,
            args.amountBMin,
            args.to,
            args.deadline
        );
        console.log(`Provided liquidity to the pool`);
    });

task("remove-liquidity", "Remove liquidity from the pool")
    .addParam("address", "Signer address")
    .addParam("tokenA", "First token in pair")
    .addParam("tokenB", "Second token in pair")
    .addParam("liquidity", "The amount of liquidity tokens to remove")
    .addParam("amountAMin", "The minimum amount of tokenA that must be received")
    .addParam("amountBMin", "The minimum amount of tokenB that must be received")
    .addParam("to", "Recipient address")
    .addParam("deadline", "Deadline timestamp")
    .setAction(async (args, hre) => {
        const adapter = await hre.ethers.getContractAt("Adapter", ADAPTER_ADDRESS);
        const signer = await hre.ethers.getSigner(args.address);
        await adapter.connect(signer).removeLiquidity(
            args.tokenA,
            args.tokenB,
            args.liquidity,
            args.amountAMin,
            args.amountBMin,
            args.to,
            args.deadline
        );
        console.log(`Removed liquidity from the pool`);
    });

task("swap-exact-tokens",
    "Swaps an exact amount of input tokens for as many output tokens as possible")
    .addParam("address", "Signer address")
    .addParam("amountIn", "The amount of input tokens to send")
    .addParam("amountOutMin", "The minimum amount of output tokens")
    .addParam("path", "Addresses of all tokens in the path")
    .addParam("to", "Recipient address")
    .addParam("deadline", "Deadline timestamp")
    .setAction(async (args, hre) => {
        const adapter = await hre.ethers.getContractAt("Adapter", ADAPTER_ADDRESS);
        const signer = await hre.ethers.getSigner(args.address);
        await adapter.connect(signer).swapExactTokensForTokens(
            args.amountIn,
            args.amountOutMin,
            args.path,
            args.to,
            args.deadline
        );
        console.log(`Tokens swapped`);
    });

task("swap-for-exact-tokens",
    "Receive an exact amount of output tokens for as few input tokens as possible")
    .addParam("address", "Signer address")
    .addParam("amountOut", "The amount of output tokens to receive")
    .addParam("amountInMax", "The maximum amount of input tokens")
    .addParam("path", "Addresses of all tokens in the path")
    .addParam("to", "Recipient address")
    .addParam("deadline", "Deadline timestamp")
    .setAction(async (args, hre) => {
        const adapter = await hre.ethers.getContractAt("Adapter", ADAPTER_ADDRESS);
        const signer = await hre.ethers.getSigner(args.address);
        await adapter.connect(signer).swapTokensForExactTokens(
            args.amountOut,
            args.amountInMax,
            args.path,
            args.to,
            args.deadline
        );
        console.log(`Tokens swapped`);
    });

task("get-amounts-out", "Calculates all subsequent maximum output token amounts")
    .addParam("address", "Signer address")
    .addParam("amountIn", "First token in pair")
    .addParam("path", "Second token in pair")
    .setAction(async (args, hre) => {
        const adapter = await hre.ethers.getContractAt("Adapter", ADAPTER_ADDRESS);
        const signer = await hre.ethers.getSigner(args.address);
        const amounts = await adapter.connect(signer).getAmountsOut(args.amountIn, args.path);
        console.log(`Amounts: ${amounts}`);
    });

task("get-amounts-in", "Calculates all preceding minimum input token amounts")
    .addParam("address", "Signer address")
    .addParam("amountOut", "First token in pair")
    .addParam("path", "Second token in pair")
    .setAction(async (args, hre) => {
        const adapter = await hre.ethers.getContractAt("Adapter", ADAPTER_ADDRESS);
        const signer = await hre.ethers.getSigner(args.address);
        const amounts = await adapter.connect(signer).getAmountsIn(args.amountOut, args.path);
        console.log(`Amounts: ${amounts}`);
    });