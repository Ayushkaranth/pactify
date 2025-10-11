// scripts/deploy.ts
// import "dotenv/config";
// import { createWalletClient, createPublicClient, http, parseEther } from "viem";
// import { privateKeyToAccount } from "viem/accounts";
// import { sepolia } from "viem/chains";
// import GoalStake from "../artifacts/contracts/GoalStake.sol/GoalStake.json";

// const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
// const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;

// if (!PRIVATE_KEY || !SEPOLIA_RPC_URL) {
//   throw new Error("❌ Missing PRIVATE_KEY or SEPOLIA_RPC_URL in .env");
// }

// const account = privateKeyToAccount(PRIVATE_KEY);

// // Wallet client to send transactions
// const walletClient = createWalletClient({
//   account,
//   chain: sepolia,
//   transport: http(SEPOLIA_RPC_URL),
// });

// // Public client to estimate gas
// const publicClient = createPublicClient({
//   chain: sepolia,
//   transport: http(SEPOLIA_RPC_URL),
// });

// async function main() {
//   console.log("🚀 Deploying GoalStake contract...");

//   // Estimate gas
//   const estimatedGas = await publicClient.estimateGas({
//     account: account.address,
//     data: GoalStake.bytecode as `0x${string}`,
//     value: 0,
//   });

//   console.log("Estimated gas:", estimatedGas.toString());

//   // Send deployment transaction with reduced gas fees
//   const hash = await walletClient.sendTransaction({
//     account,
//     data: GoalStake.bytecode as `0x${string}`,
//     value: 0,
//     gas: estimatedGas,
//     maxFeePerGas: 5_000_000_000n,        // 5 gwei
//     maxPriorityFeePerGas: 1_000_000_000n, // 1 gwei
//   });

//   console.log("📡 Transaction sent! Hash:", hash);
//   console.log("⏳ Waiting for confirmation... (check Etherscan with hash)");
// }

// main().catch((err) => {
//   console.error("❌ Deployment failed:", err);
//   process.exit(1);
// });





import "dotenv/config";
import { createWalletClient, createPublicClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import GoalStake from "../artifacts/contracts/GoalStake.sol/GoalStake.json";

const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
const TEA_RPC_URL = process.env.TEA_RPC_URL;

if (!PRIVATE_KEY || !TEA_RPC_URL) {
  throw new Error("❌ Missing PRIVATE_KEY or TEA_RPC_URL in .env");
}

const account = privateKeyToAccount(PRIVATE_KEY);

// Define Tea Sepolia chain
const teaSepolia = {
  id: 10218,
  name: "Tea Sepolia",
  network: "tea-sepolia",
  nativeCurrency: {
    name: "Tea Ether",
    symbol: "tETH",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [TEA_RPC_URL] },
  },
};

// Wallet client to send transactions
const walletClient = createWalletClient({
  account,
  chain: teaSepolia,
  transport: http(TEA_RPC_URL),
});

// Public client to estimate gas
const publicClient = createPublicClient({
  chain: teaSepolia,
  transport: http(TEA_RPC_URL),
});

async function main() {
  console.log("🚀 Deploying GoalStake contract on Tea Sepolia...");

  // Estimate gas
  const estimatedGas = await publicClient.estimateGas({
    account: account.address,
    data: GoalStake.bytecode as `0x${string}`,
    value: 0,
  });

  console.log("Estimated gas:", estimatedGas.toString());

  // Send deployment transaction
  const hash = await walletClient.sendTransaction({
    account,
    data: GoalStake.bytecode as `0x${string}`,
    value: 0,
    gas: estimatedGas,
    maxFeePerGas: 20_000_000_000n,        // 20 gwei
maxPriorityFeePerGas: 2_000_000_000n,
  });

  console.log("📡 Transaction sent! Hash:", hash);
  console.log("⏳ Waiting for confirmation... (check Tea Explorer with hash)");
}

main().catch((err) => {
  console.error("❌ Deployment failed:", err);
  process.exit(1);
});
