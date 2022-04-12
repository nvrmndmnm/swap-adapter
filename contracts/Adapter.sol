// SPDX-Licence-Identifier: GPL-3.0
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Adapter is ReentrancyGuard {
    constructor() {}

    function createPair() public {}

    function addLiquidity() public {}

    function removeLiquidity() public {}

    function getPrice() public {}

    function swap() public {}
}
