// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";

/**
 * @title TestConfig
 * @dev Script para testar configuração de rede e ambiente
 */
contract TestConfig is Script {
    function run() external view {
        console.log("=== TESTE DE CONFIGURACAO ===");
        console.log("Chain ID:", block.chainid);
        console.log("Block Number:", block.number);
        console.log("Timestamp:", block.timestamp);
        
        // Verificar variáveis de ambiente
        string memory rpcUrl = vm.envOr("SEPOLIA_RPC_URL", string(""));
        string memory etherscanKey = vm.envOr("ETHERSCAN_API_KEY", string(""));
        
        console.log("RPC URL configurado:", bytes(rpcUrl).length > 0 ? "SIM" : "NAO");
        console.log("Etherscan API configurado:", bytes(etherscanKey).length > 0 ? "SIM" : "NAO");
        
        console.log("=== CONFIGURACAO COMPLETA ===");
    }
} 