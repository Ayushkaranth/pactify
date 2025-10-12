// lib/pacts-contract.ts

// 1. PASTE YOUR DEPLOYED CONTRACT ADDRESS HERE
export const pactsContractAddress = '0x731fe7f3549f2a648c3f30eef71a736f93714322' as const;

// 2. This is the ABI you provided, ready to be used.
export const pactsContractAbi = [
			{
				"inputs": [],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "bytes32",
						"name": "pactId",
						"type": "bytes32"
					}
				],
				"name": "PactAccepted",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "bytes32",
						"name": "pactId",
						"type": "bytes32"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "partner",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "stake",
						"type": "uint256"
					}
				],
				"name": "PactProposed",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "bytes32",
						"name": "pactId",
						"type": "bytes32"
					},
					{
						"indexed": false,
						"internalType": "enum Pacts.Status",
						"name": "newStatus",
						"type": "uint8"
					}
				],
				"name": "PactResolved",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "bytes32",
						"name": "pactId",
						"type": "bytes32"
					},
					{
						"indexed": false,
						"internalType": "uint8",
						"name": "newRejectionCount",
						"type": "uint8"
					}
				],
				"name": "PactRevisionRequested",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "bytes32",
						"name": "pactId",
						"type": "bytes32"
					}
				],
				"name": "PactWorkSubmitted",
				"type": "event"
			},
			{
				"inputs": [
					{
						"internalType": "bytes32",
						"name": "pactId",
						"type": "bytes32"
					}
				],
				"name": "acceptPact",
				"outputs": [],
				"stateMutability": "payable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "bytes32",
						"name": "pactId",
						"type": "bytes32"
					}
				],
				"name": "confirmCompletion",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "bytes32",
						"name": "",
						"type": "bytes32"
					}
				],
				"name": "pacts",
				"outputs": [
					{
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "partner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "stakeAmount",
						"type": "uint256"
					},
					{
						"internalType": "enum Pacts.Status",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "uint8",
						"name": "rejectionCount",
						"type": "uint8"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "bytes32",
						"name": "pactId",
						"type": "bytes32"
					},
					{
						"internalType": "address",
						"name": "partner",
						"type": "address"
					}
				],
				"name": "proposePact",
				"outputs": [],
				"stateMutability": "payable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "bytes32",
						"name": "pactId",
						"type": "bytes32"
					}
				],
				"name": "requestRevision",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "bytes32",
						"name": "pactId",
						"type": "bytes32"
					}
				],
				"name": "signalCompletion",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		] as const;