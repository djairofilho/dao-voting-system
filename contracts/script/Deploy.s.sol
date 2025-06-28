// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/BCIToken.sol";
import "../src/DAOVoting.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying contracts with account:", deployer);
        console.log("Account balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy BCI Token
        console.log("Deploying BCI Token...");
        BCIToken bciToken = new BCIToken(deployer);
        console.log("BCI Token deployed to:", address(bciToken));
        
        // Deploy DAO Voting Contract
        console.log("Deploying DAO Voting Contract...");
        DAOVoting daoVoting = new DAOVoting(address(bciToken), deployer);
        console.log("DAO Voting Contract deployed to:", address(daoVoting));
        
        // Distribute some tokens to test addresses (opcional)
        address[] memory testAddresses = new address[](3);
        testAddresses[0] = 0x1234567890123456789012345678901234567890; // Substitua por endereços reais
        testAddresses[1] = 0x2345678901234567890123456789012345678901;
        testAddresses[2] = 0x3456789012345678901234567890123456789012;
        
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 1000 * 10**18; // 1000 BCI
        amounts[1] = 800 * 10**18;  // 800 BCI
        amounts[2] = 600 * 10**18;  // 600 BCI
        
        console.log("Distributing tokens to test addresses...");
        // Descomente as linhas abaixo se quiser distribuir tokens automaticamente
        // bciToken.distributeTokens(testAddresses, amounts);
        
        vm.stopBroadcast();
        
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("BCI Token Address:", address(bciToken));
        console.log("DAO Voting Address:", address(daoVoting));
        console.log("Deployer Address:", deployer);
        console.log("Initial Token Supply:", bciToken.totalSupply() / 10**18, "BCI");
        console.log("\n=== NEXT STEPS ===");
        console.log("1. Add contract addresses to your .env file");
        console.log("2. Update frontend configuration");
        console.log("3. Verify contracts on Etherscan (optional)");
        console.log("4. Distribute tokens to DAO members");
    }
} 