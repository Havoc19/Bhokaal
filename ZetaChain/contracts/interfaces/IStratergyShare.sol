// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { IERC20Plugins } from "@1inch/token-plugins/contracts/interfaces/IERC20Plugins.sol";

interface IStratergyShare is IERC20Plugins {
    // function addStratergy(address account, address stratergy) external; // onlyOwner
    // function mint(address account, uint256 amount) external; // onlyOwner
    // function burn(address account, uint256 amount) external; // onlyOwner
}