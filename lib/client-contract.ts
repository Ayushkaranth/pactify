// lib/client-contract.ts
// 💡 This file is for client-side use only (e.g., in components)
import { getAddress } from 'viem';
import GoalStakeAbi from '../blockchain/artifacts/contracts/GoalStake.sol/GoalStake.json';

// The NEXT_PUBLIC_ prefix makes this variable available on the client
const rawContractAddress = process.env.NEXT_PUBLIC_GOAL_STAKE_CONTRACT_ADDRESS;

if (!rawContractAddress) {
    throw new Error("Missing NEXT_PUBLIC_GOAL_STAKE_CONTRACT_ADDRESS in .env.local");
}

export const GOAL_STAKE_CONTRACT_ADDRESS_CLIENT = getAddress(rawContractAddress);
export const GOAL_STAKE_ABI_CLIENT = GoalStakeAbi.abi;