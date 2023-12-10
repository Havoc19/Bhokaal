// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {IERC20, ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@zetachain/protocol-contracts/contracts/zevm/SystemContract.sol";
import {Plugin} from "./Plugin.sol";
import {IERC20Plugins} from "./interfaces/IERC20Plugins.sol";
import {IDelegationPlugin} from "./interfaces/IDelegationPlugin.sol";
import "@zetachain/protocol-contracts/contracts/zevm/interfaces/zContract.sol";
import "@zetachain/toolkit/contracts/BytesHelperLib.sol";


contract DelegationPlugin is ERC20, Plugin, zContract, IDelegationPlugin {
    SystemContract public systemContract;
    uint256 public chainID;
    uint256 constant BITCOIN = 18332;

    error ApproveDisabled();
    error TransferDisabled();
    error WrongChain();
    error UnknownAction();

    mapping(address => address) public delegated;
    mapping(address => address) public zetaAddress;

    modifier onlySystem() {
        require(
            msg.sender == address(systemContract),
            "Only system contract can call this function"
        );
        _;
    }

    constructor(
        string memory name_,
        string memory symbol_,
        IERC20Plugins token_
    ) ERC20(name_, symbol_) Plugin(token_) {} // solhint-disable-line no-empty-blocks

    function onCrossChainCall(
        zContext calldata context,
        address zrc20,
        uint256 amount,
        bytes calldata message
    ) external virtual override onlySystem {
        if (chainID != context.chainID) {
            revert WrongChain();
        }
        address staker = BytesHelperLib.bytesToAddress(context.origin, 0);

        uint8 action = chainID == BITCOIN
            ? uint8(message[0])
            : abi.decode(message, (uint8));

        if (action == 1) {
            _delegate(staker, message);
        } else if (action == 2) {
            _addZetaAddress(staker, message);
        } else {
            revert UnknownAction();
        }
    }

    function _delegate(
        address staker,
        bytes calldata message
    ) internal virtual {
        address delegatee;
        if (chainID == BITCOIN) {
            delegatee = BytesHelperLib.bytesToAddress(message, 1);
        } else {
            (, delegatee) = abi.decode(message, (uint8, address));
        }

        address user = zetaAddress[staker];
        address prevDelegatee = delegated[user];
        if (prevDelegatee != delegatee) {
            delegated[user] = delegatee;
            uint256 balance = IERC20Plugins(token).pluginBalanceOf(
                address(this),
                user
            );
            if (balance > 0) {
                _updateBalances(user, user, prevDelegatee, delegatee, balance);
            }
        }
    }

    function _addZetaAddress(address staker, bytes calldata message) internal {
        address _address;
        if (chainID == BITCOIN) {
            _address = BytesHelperLib.bytesToAddress(message, 1);
        } else {
            (, _address) = abi.decode(message, (uint8, address));
        }
        zetaAddress[staker] = _address;
    }

    function _updateBalances(
        address from,
        address to,
        uint256 amount
    ) internal override {
        _updateBalances(
            from,
            to,
            from == address(0) ? address(0) : delegated[from],
            to == address(0) ? address(0) : delegated[to],
            amount
        );
    }

    function _updateBalances(
        address /* from */,
        address /* to */,
        address fromDelegatee,
        address toDelegatee,
        uint256 amount
    ) internal virtual {
        if (fromDelegatee != toDelegatee && amount > 0) {
            if (fromDelegatee == address(0)) {
                _mint(toDelegatee, amount);
            } else if (toDelegatee == address(0)) {
                _burn(fromDelegatee, amount);
            } else {
                _transfer(fromDelegatee, toDelegatee, amount);
            }
        }
    }

    // ERC20 overrides

    function transfer(
        address /* to */,
        uint256 /* amount */
    ) public pure override returns (bool) {
        revert TransferDisabled();
    }

    function transferFrom(
        address /* from */,
        address /* to */,
        uint256 /* amount */
    ) public pure override returns (bool) {
        revert TransferDisabled();
    }

    function approve(
        address /* spender */,
        uint256 /* amount */
    ) public pure override returns (bool) {
        revert ApproveDisabled();
    }

    function increaseAllowance(
        address /* spender */,
        uint256 /* addedValue */
    ) public pure override returns (bool) {
        revert ApproveDisabled();
    }

    function decreaseAllowance(
        address /* spender */,
        uint256 /* subtractedValue */
    ) public pure override returns (bool) {
        revert ApproveDisabled();
    }
}
