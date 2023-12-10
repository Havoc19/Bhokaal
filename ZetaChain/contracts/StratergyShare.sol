// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@zetachain/protocol-contracts/contracts/zevm/SystemContract.sol";
import "@zetachain/protocol-contracts/contracts/zevm/interfaces/zContract.sol";
import {ERC20Plugins} from "./ERC20Plugin.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@zetachain/toolkit/contracts/BytesHelperLib.sol";

contract StratergyShare is ERC20Plugins, zContract {
    SystemContract public immutable systemContract;
    uint256 public immutable chainID;
    uint256 constant BITCOIN = 18332;

    error WrongChain();
    error UnknownAction();
    error Overflow();
    error WrongAmount();
    error InvalidAmount();
    error InvalidAddress();

    mapping(address => uint256) public mintShares;
    mapping(address => uint256) public zAddressShare;
    mapping(address => uint256) public noOfShareInContract;
    mapping(address => address) public zetaAddress;
    mapping(address => bytes) public withdraw;
    mapping(address => address) public beneficiary;
    mapping(address => uint256) public lastStakeTime;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 maxUserPlugins_,
        uint256 pluginCallGasLimit_,
        uint256 chainID_,
        address systemContractAddress
    ) ERC20(name_, symbol_) ERC20Plugins(maxUserPlugins_, pluginCallGasLimit_) {
        systemContract = SystemContract(systemContractAddress);
        chainID = chainID_;
    }

    modifier onlySystem() {
        require(
            msg.sender == address(systemContract),
            "Only system contract can call this function"
        );
        _;
    }

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
            _mintZRC(staker, amount);
        } else if (action == 2) {
            _transferZRC(staker, amount);
        } else if (action == 3) {
            _addZetaAddress(staker, message);
        } else if (action == 4) {
            _burnZrc(staker, amount , message);
        } else {
            revert UnknownAction();
        }
    }

    function _mintZRC(
        address staker,
        uint256 amount
    ) internal {
        mintShares[staker] += amount;
        if (mintShares[staker] < amount) revert Overflow();
        address receiverAddress = zetaAddress[staker];
        zAddressShare[receiverAddress] += amount;
        _mint(receiverAddress, amount);
    }

    function _transferZRC(address staker, uint256 amount) internal {
        if(zetaAddress[staker] != msg.sender) revert InvalidAddress();
        if (zAddressShare[zetaAddress[staker]] < amount)
            revert InvalidAmount();

        zAddressShare[zetaAddress[staker]] -= amount;
        noOfShareInContract[zetaAddress[staker]] += amount;
    }

    function _addZetaAddress(address staker, bytes calldata message) internal{
        if(chainID != BITCOIN) revert WrongChain();
        address beneficiaryAddress = BytesHelperLib.bytesToAddress(message, 1);
        zetaAddress[staker] = beneficiaryAddress;
    }

    function _burnZrc(address staker, uint256 amount ,bytes calldata message) internal {
        if(chainID != BITCOIN) revert WrongChain();

        if (mintShares[staker] < amount) revert Overflow();

        address zrc20 = systemContract.gasCoinZRC20ByChainId(chainID);
        (, uint256 gasFee) = IZRC20(zrc20).withdrawGasFee();

        if (amount < gasFee) revert WrongAmount();

        bytes memory withdrawAddress;
        if (chainID == BITCOIN) {
            withdrawAddress = bytesToBech32Bytes(message, 1);
        }
        noOfShareInContract[staker] -= amount;
        mintShares[staker] -= amount;

        IZRC20(zrc20).approve(zrc20, gasFee);
        IZRC20(zrc20).withdraw(withdrawAddress, amount - gasFee);

        _burn(address(this), amount);
    }

    function bytesToBech32Bytes(
        bytes calldata data,
        uint256 offset
    ) internal pure returns (bytes memory) {
        bytes memory bech32Bytes = new bytes(42);
        for (uint i = 0; i < 42; i++) {
            bech32Bytes[i] = data[i + offset];
        }
        return bech32Bytes;
    }
}
