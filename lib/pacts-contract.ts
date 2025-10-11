// lib/pacts-contract.ts

// 1. PASTE YOUR DEPLOYED CONTRACT ADDRESS HERE
export const pactsContractAddress = '0x3d389e7a33227f0d532427671552f149691572a6' as const;

// 2. This is the ABI you provided, ready to be used.
export const pactsContractAbi = [
    { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "pactId", "type": "bytes32" }], "name": "PactAccepted", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "pactId", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "creator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "partner", "type": "address" }], "name": "PactProposed", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "pactId", "type": "bytes32" }, { "indexed": false, "internalType": "enum Pacts.Status", "name": "newStatus", "type": "uint8" }], "name": "PactResolved", "type": "event" },
    { "inputs": [{ "internalType": "bytes32", "name": "pactId", "type": "bytes32" }], "name": "acceptPact", "outputs": [], "stateMutability": "payable", "type": "function" },
    { "inputs": [], "name": "judge", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "pacts", "outputs": [{ "internalType": "address", "name": "creator", "type": "address" }, { "internalType": "address", "name": "partner", "type": "address" }, { "internalType": "uint256", "name": "stakeAmount", "type": "uint256" }, { "internalType": "enum Pacts.Status", "name": "status", "type": "uint8" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "bytes32", "name": "pactId", "type": "bytes32" }, { "internalType": "address", "name": "partner", "type": "address" }], "name": "proposePact", "outputs": [], "stateMutability": "payable", "type": "function" },
    { "inputs": [{ "internalType": "bytes32", "name": "pactId", "type": "bytes32" }, { "internalType": "enum Pacts.Status", "name": "outcome", "type": "uint8" }], "name": "resolvePact", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
] as const;