import "hardhat/types/runtime";
import { Ethers } from "@nomicfoundation/hardhat-ethers/dist/src/types";

declare module "hardhat/types/runtime" {
  interface HardhatRuntimeEnvironment {
    ethers: Ethers;
  }
}