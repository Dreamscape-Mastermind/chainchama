// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MiwaMeter
 * @dev A basic ERC20 token called MiwaMeter.
 */
contract MiwaMeter is ERC20 {
    constructor(uint256 initialSupply) ERC20("MiwaMeter", "MM") {
        _mint(msg.sender, initialSupply);
    }
}

/**
 * @title ChainChamaCharge
 * @dev A basic ERC20 token called ChainChamaCharge.
 */
contract ChainChamaCharge is ERC20 {
    constructor(uint256 initialSupply) ERC20("ChainChamaCharge", "CCC") {
        _mint(msg.sender, initialSupply);
    }
}
