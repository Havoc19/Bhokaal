import { getAddress } from "@zetachain/protocol-contracts";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import ZRC20 from "@zetachain/protocol-contracts/abi/zevm/ZRC20.sol/ZRC20.json";

const main = async (args: any, hre: HardhatRuntimeEnvironment) => {
  if (hre.network.name !== "zeta_testnet") {
    throw new Error(
      '🚨 Please use the "zeta_testnet" network to deploy to ZetaChain.'
    );
  }

  const [signer] = await hre.ethers.getSigners();
  if (signer === undefined) {
    throw new Error(
      `Wallet not found. Please, run "npx hardhat account --save" or set PRIVATE_KEY env variable (for example, in a .env file)`
    );
  }

  const PLUGIN_GAS_LIMIT = 200_000;

  const systemContract = getAddress("systemContract", "zeta_testnet");

  const factory = await hre.ethers.getContractFactory("StratergyShare");
  let symbol = "STS";

  if (args.chain !== "btc_testnet"){
    console.log("ONLY BTC CHAIN IS ACCEPTED");
  }

  const contract = await factory.deploy(
    `Staking rewards for ${symbol}`,
    `R${symbol.toUpperCase()}`,
    10,
    PLUGIN_GAS_LIMIT,
    18332,
    systemContract
  );
  await contract.deployed();

  if (args.json) {
    console.log(JSON.stringify(contract));
  } else {
    console.log(`🔑 Using account: ${signer.address}

🚀 Successfully deployed contract on ZetaChain.
📜 Contract address: ${contract.address}
🌍 Explorer: https://athens3.explorer.zetachain.com/address/${contract.address}
`);
  }
};

task("deploy", "Deploy the contract", main)
  .addParam("chain", "Chain ID (use btc_testnet for Bitcoin Testnet)", "maxUserPlugins (max no.of plugin user can add)")
  .addFlag("json", "Output in JSON");