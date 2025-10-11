import { getAddress, Abi } from 'viem';
// 🆕 This import gives you the ABI array directly
import { GoalStakeAbi } from '@/lib/abi/GoalStakeAbi';

const rawContractAddress = process.env.NEXT_PUBLIC_GOAL_STAKE_CONTRACT_ADDRESS;
if (!rawContractAddress) {
  throw new Error("Missing NEXT_PUBLIC_GOAL_STAKE_CONTRACT_ADDRESS in .env.local");
}

export const GOAL_STAKE_CONTRACT_ADDRESS_CLIENT = getAddress(rawContractAddress);

// 🆕 Assign the imported array directly, without the '.abi' property
export const GOAL_STAKE_ABI_CLIENT = GoalStakeAbi;