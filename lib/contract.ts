import { getAddress, Abi } from 'viem';
import { GoalStakeAbi } from '@/lib/abi/GoalStakeAbi';

const rawContractAddress = process.env.NEXT_PUBLIC_GOAL_STAKE_CONTRACT_ADDRESS;

if (!rawContractAddress) {
    throw new Error("Missing NEXT_PUBLIC_GOAL_STAKE_CONTRACT_ADDRESS in .env.local");
}

export const GOAL_STAKE_CONTRACT_ADDRESS = getAddress(rawContractAddress);
export const GOAL_STAKE_ABI = GoalStakeAbi;