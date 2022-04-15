// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "./interfaces/IToken.sol";

/**
@title An adapter contract for Uniswap protocol
@author Said Avkhadeyev
@dev For implementation info refer to Uniswap docs
*/
contract Adapter is ReentrancyGuard {
    address public factory;
    address public router;

    /**
    Emitted when a new liquidity pair is created
    @param tokenA First token of the created pair
    @param tokenB Second token of the created pair
    @param pair The pair contract address
    */
    event PairCreated(address tokenA, address tokenB, address indexed pair);

    /**
    Emitted when liquidity is provided to the pool
    @param to LP tokens recipient address
    @param amountA First token amount
    @param amountB Second token amount
    @param amountLiquidity Provided liquidity amount
    */
    event LiquidityProvided(
        address indexed to,
        uint256 amountA,
        uint256 amountB,
        uint256 indexed amountLiquidity
    );

    /**
    Emitted when liquidity is removed from the pool
    @param to Asset tokens recipient address
    @param amountA First token amount
    @param amountB Second token amount
    @param amountLiquidity Removed liquidity amount
    */
    event LiquidityRemoved(
        address indexed to,
        uint256 amountA,
        uint256 amountB,
        uint256 indexed amountLiquidity
    );

    /**
    Emitted when tokens swapped
    @param to Swapped tokens recipient address
    @param addressArray Array of tokens used in swap
    @param amountsArray Amounts of tokens used in swap
    */
    event Swapped(
        address indexed to,
        address[] addressArray,
        uint256[] amountsArray
    );

    /**
    Constructor
    @param _factory Uniswap factory address
    @param _router Uniswap router address
    */
    constructor(address _factory, address _router) {
        factory = _factory;
        router = _router;
    }

    /**
    Creates a new pair of tokens if it doesn't exist
    @param tokenA First token address
    @param tokenB Second token address
    @return pair Created pair address
    */
    function createPair(address tokenA, address tokenB)
        public
        returns (address pair)
    {
        pair = IUniswapV2Factory(factory).createPair(tokenA, tokenB);
        emit PairCreated(tokenA, tokenB, pair);
    }

    /**
    Provides liquidity to the pool
    @param tokenA First token address
    @param tokenB Second token address
    @param amountADesired Desired amount of first token
    @param amountBDesired Desired amount of second token
    @param amountAMin The extent to which the B/A price can go up
    @param amountBMin The extent to which the A/B price can go up
    @param to Recipient of the liquidity tokens
    @param deadline Unix timestamp after which the transaction will revert
    @return amountA Amount of first token
    @return amountB Amount of second token
    @return liquidity Amount of liquidity tokens minted
    */
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    )
        public
        returns (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        )
    {
        IToken(tokenA).transferFrom(msg.sender, address(this), amountADesired);
        IToken(tokenB).transferFrom(msg.sender, address(this), amountBDesired);

        IToken(tokenA).approve(router, amountADesired);
        IToken(tokenB).approve(router, amountBDesired);

        (amountA, amountB, liquidity) = IUniswapV2Router02(router).addLiquidity(
            tokenA,
            tokenB,
            amountADesired,
            amountBDesired,
            amountAMin,
            amountBMin,
            to,
            deadline
        );

        emit LiquidityProvided(to, amountA, amountB, liquidity);
    }

    /**
    Removes liquidity from the pool
    @param tokenA First token address
    @param tokenB Second token address
    @param liquidity The amount of liquidity tokens to remove
    @param amountAMin The minimum amount of tokenA that must be received
    @param amountBMin The minimum amount of tokenB that must be received
    @param to Recipient of the tokens
    @param deadline Unix timestamp after which the transaction will revert
    @return amountA Amount of first token
    @return amountB Amount of second token
    */
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) public returns (uint256 amountA, uint256 amountB) {
        address pair = IUniswapV2Factory(factory).getPair(tokenA, tokenB);
        IToken(pair).transferFrom(msg.sender, address(this), liquidity);
        IToken(pair).approve(address(router), liquidity);

        IUniswapV2Router02(router).removeLiquidity(
            tokenA,
            tokenB,
            liquidity,
            amountAMin,
            amountBMin,
            to,
            deadline
        );

        emit LiquidityRemoved(to, amountA, amountB, liquidity);
    }

    /**
    Swaps an exact amount of input tokens for as many output tokens as possible
    @param amountIn The amount of input tokens to send
    @param amountOutMin The minimum amount of output tokens that must be received
    @param path An array of token addresses
    @param to Recipient of the output tokens
    @param deadline Unix timestamp after which the transaction will revert
    @return amounts The amounts of swapped tokens
    */
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) public returns (uint256[] memory amounts) {
        IToken(path[0]).transferFrom(msg.sender, address(this), amountIn);
        IToken(path[0]).approve(router, amountIn);

        IUniswapV2Router02(router).swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            to,
            deadline
        );

        emit Swapped(to, path, amounts);
    }

    /**
    Receive an exact amount of output tokens for as few input tokens as possible
    @param amountOut The amount of output tokens to receive
    @param amountInMax The maximum amount of input tokens that can be required
    @param path An array of token addresses
    @param to Recipient of the output tokens
    @param deadline Unix timestamp after which the transaction will revert
    @return amounts The amounts of swapped tokens
    */
    function swapTokensForExactTokens(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline
    ) public returns (uint256[] memory amounts) {
        IToken(path[0]).transferFrom(msg.sender, address(this), amountInMax);
        IToken(path[0]).approve(router, amountInMax);

        amounts = IUniswapV2Router02(router).swapTokensForExactTokens(
            amountOut,
            amountInMax,
            path,
            to,
            deadline
        );
        IToken(path[0]).transfer(msg.sender, amountInMax - amounts[0]);

        emit Swapped(to, path, amounts);
    }

    /**
    Calculates all subsequent maximum output token amounts
    @param amountIn The amount of input tokens to send
    @param path An array of token addresses
    @return amounts The output amounts of the other assets
    */
    function getAmountsOut(uint256 amountIn, address[] memory path)
        public
        view
        returns (uint256[] memory amounts)
    {
        amounts = IUniswapV2Router02(router).getAmountsOut(amountIn, path);
    }

    /**
    Calculates all preceding minimum input token amounts
    @param amountOut The amount of output tokens to receive
    @param path An array of token addresses
    @return amounts The minimum input asset amounts required
    */
    function getAmountsIn(uint256 amountOut, address[] memory path)
        public
        view
        returns (uint256[] memory amounts)
    {
        amounts = IUniswapV2Router02(router).getAmountsIn(amountOut, path);
    }
}
