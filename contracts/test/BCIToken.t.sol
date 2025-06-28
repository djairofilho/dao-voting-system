// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/BCIToken.sol";

contract BCITokenTest is Test {
    BCIToken public bciToken;
    address public owner;
    address public user1;
    address public user2;
    
    uint256 public constant INITIAL_SUPPLY = 10000 * 10**18;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);
        
        bciToken = new BCIToken(owner);
    }
    
    function testInitialSetup() public {
        assertEq(bciToken.name(), "Blockchain Insper");
        assertEq(bciToken.symbol(), "BCI");
        assertEq(bciToken.totalSupply(), INITIAL_SUPPLY);
        assertEq(bciToken.balanceOf(owner), INITIAL_SUPPLY);
        assertEq(bciToken.owner(), owner);
    }
    
    function testMint() public {
        uint256 mintAmount = 1000 * 10**18;
        uint256 initialBalance = bciToken.balanceOf(user1);
        uint256 initialTotalSupply = bciToken.totalSupply();
        
        vm.expectEmit(true, true, false, true);
        emit Transfer(address(0), user1, mintAmount);
        
        bciToken.mint(user1, mintAmount);
        
        assertEq(bciToken.balanceOf(user1), initialBalance + mintAmount);
        assertEq(bciToken.totalSupply(), initialTotalSupply + mintAmount);
    }
    
    function testMintOnlyOwner() public {
        uint256 mintAmount = 1000 * 10**18;
        
        vm.prank(user1);
        vm.expectRevert();
        bciToken.mint(user1, mintAmount);
    }
    
    function testBurn() public {
        uint256 burnAmount = 1000 * 10**18;
        uint256 initialBalance = bciToken.balanceOf(owner);
        uint256 initialTotalSupply = bciToken.totalSupply();
        
        vm.expectEmit(true, true, false, true);
        emit Transfer(owner, address(0), burnAmount);
        
        bciToken.burn(burnAmount);
        
        assertEq(bciToken.balanceOf(owner), initialBalance - burnAmount);
        assertEq(bciToken.totalSupply(), initialTotalSupply - burnAmount);
    }
    
    function testBurnOnlyOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        bciToken.burn(1000 * 10**18);
    }
    
    function testDistributeTokens() public {
        address[] memory recipients = new address[](2);
        recipients[0] = user1;
        recipients[1] = user2;
        
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 500 * 10**18;
        amounts[1] = 300 * 10**18;
        
        uint256 ownerInitialBalance = bciToken.balanceOf(owner);
        
        bciToken.distributeTokens(recipients, amounts);
        
        assertEq(bciToken.balanceOf(user1), amounts[0]);
        assertEq(bciToken.balanceOf(user2), amounts[1]);
        assertEq(bciToken.balanceOf(owner), ownerInitialBalance - amounts[0] - amounts[1]);
    }
    
    function testDistributeTokensArrayLengthMismatch() public {
        address[] memory recipients = new address[](2);
        recipients[0] = user1;
        recipients[1] = user2;
        
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 500 * 10**18;
        
        vm.expectRevert("Arrays length mismatch");
        bciToken.distributeTokens(recipients, amounts);
    }
    
    function testDistributeTokensInvalidRecipient() public {
        address[] memory recipients = new address[](1);
        recipients[0] = address(0);
        
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 500 * 10**18;
        
        vm.expectRevert("Invalid recipient address");
        bciToken.distributeTokens(recipients, amounts);
    }
    
    function testDistributeTokensZeroAmount() public {
        address[] memory recipients = new address[](1);
        recipients[0] = user1;
        
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 0;
        
        vm.expectRevert("Amount must be greater than 0");
        bciToken.distributeTokens(recipients, amounts);
    }
    
    function testDistributeTokensOnlyOwner() public {
        address[] memory recipients = new address[](1);
        recipients[0] = user1;
        
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 500 * 10**18;
        
        vm.prank(user1);
        vm.expectRevert();
        bciToken.distributeTokens(recipients, amounts);
    }
    
    function testTransfer() public {
        uint256 transferAmount = 1000 * 10**18;
        
        bciToken.transfer(user1, transferAmount);
        
        assertEq(bciToken.balanceOf(user1), transferAmount);
        assertEq(bciToken.balanceOf(owner), INITIAL_SUPPLY - transferAmount);
    }
} 