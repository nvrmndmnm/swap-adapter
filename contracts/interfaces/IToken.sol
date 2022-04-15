// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

interface IToken {
    function transfer(address to, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function approve(address to, uint256 amount) external;

    function mint(address to, uint256 amount) external;

    function burn(address owner, uint256 amount) external;

    function balanceOf(address owner) external returns (uint256);
}
