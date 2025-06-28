// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/DAOVoting.sol";
import "../src/BCIToken.sol";

contract DAOVotingTest is Test {
    DAOVoting public daoVoting;
    BCIToken public bciToken;
    
    address public owner;
    address public user1;
    address public user2;
    address public user3;
    
    uint256 public constant INITIAL_SUPPLY = 10000 * 10**18;
    uint256 public constant MIN_TOKENS_TO_PROPOSE = 100 * 10**18;
    
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title, uint256 endTime);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 tokens);
    event ProposalExecuted(uint256 indexed proposalId, bool approved);
    
    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);
        user3 = address(0x3);
        
        // Deploy token and voting contracts
        bciToken = new BCIToken(owner);
        daoVoting = new DAOVoting(address(bciToken), owner);
        
        // Distribute tokens to users
        bciToken.transfer(user1, 500 * 10**18);
        bciToken.transfer(user2, 300 * 10**18);
        bciToken.transfer(user3, 200 * 10**18);
    }
    
    function testInitialSetup() public {
        assertEq(address(daoVoting.bciToken()), address(bciToken));
        assertEq(daoVoting.owner(), owner);
        assertEq(daoVoting.proposalCounter(), 0);
        assertEq(daoVoting.getTotalProposals(), 0);
    }
    
    function testCreateProposal() public {
        string memory title = "Proposal Test";
        string memory description = "Test proposal description";
        uint256 votingPeriod = 7 days;
        
        vm.expectEmit(true, true, false, false);
        emit ProposalCreated(1, owner, title, 0); // endTime será calculado
        
        uint256 proposalId = daoVoting.createProposal(title, description, votingPeriod);
        
        assertEq(proposalId, 1);
        assertEq(daoVoting.proposalCounter(), 1);
        assertEq(daoVoting.getTotalProposals(), 1);
        
        (
            string memory returnedTitle,
            string memory returnedDescription,
            uint256 endTime,
            uint256 forVotes,
            uint256 againstVotes,
            bool executed,
            address proposer
        ) = daoVoting.getProposal(proposalId);
        
        assertEq(returnedTitle, title);
        assertEq(returnedDescription, description);
        assertEq(endTime, block.timestamp + votingPeriod);
        assertEq(forVotes, 0);
        assertEq(againstVotes, 0);
        assertEq(executed, false);
        assertEq(proposer, owner);
    }
    
    function testCreateProposalInsufficientTokens() public {
        // Criar um usuário com menos de 100 tokens
        address lowTokenUser = address(0x999);
        bciToken.transfer(lowTokenUser, 50 * 10**18); // 50 tokens, menos que MIN_TOKENS_TO_PROPOSE (100)
        
        vm.prank(lowTokenUser);
        vm.expectRevert("Insufficient tokens to create proposal");
        daoVoting.createProposal("Test", "Description", 7 days);
    }
    
    function testCreateProposalEmptyTitle() public {
        vm.expectRevert("Title cannot be empty");
        daoVoting.createProposal("", "Description", 7 days);
    }
    
    function testCreateProposalEmptyDescription() public {
        vm.expectRevert("Description cannot be empty");
        daoVoting.createProposal("Title", "", 7 days);
    }
    
    function testCreateProposalInvalidVotingPeriod() public {
        vm.expectRevert("Invalid voting period");
        daoVoting.createProposal("Title", "Description", 12 hours); // Menor que MIN_VOTING_PERIOD
        
        vm.expectRevert("Invalid voting period");
        daoVoting.createProposal("Title", "Description", 31 days); // Maior que MAX_VOTING_PERIOD
    }
    
    function testCastVoteFor() public {
        uint256 proposalId = daoVoting.createProposal("Test", "Description", 7 days);
        uint256 user1Tokens = bciToken.balanceOf(user1);
        
        vm.prank(user1);
        vm.expectEmit(true, true, false, true);
        emit VoteCast(proposalId, user1, true, user1Tokens);
        
        daoVoting.castVote(proposalId, true);
        
        (, , , uint256 forVotes, uint256 againstVotes, , ) = daoVoting.getProposal(proposalId);
        
        assertEq(forVotes, user1Tokens);
        assertEq(againstVotes, 0);
        assertTrue(daoVoting.hasVoted(proposalId, user1));
    }
    
    function testCastVoteAgainst() public {
        uint256 proposalId = daoVoting.createProposal("Test", "Description", 7 days);
        uint256 user2Tokens = bciToken.balanceOf(user2);
        
        vm.prank(user2);
        vm.expectEmit(true, true, false, true);
        emit VoteCast(proposalId, user2, false, user2Tokens);
        
        daoVoting.castVote(proposalId, false);
        
        (, , , uint256 forVotes, uint256 againstVotes, , ) = daoVoting.getProposal(proposalId);
        
        assertEq(forVotes, 0);
        assertEq(againstVotes, user2Tokens);
        assertTrue(daoVoting.hasVoted(proposalId, user2));
    }
    
    function testCastVoteNonexistentProposal() public {
        vm.prank(user1);
        vm.expectRevert("Proposal does not exist");
        daoVoting.castVote(999, true);
    }
    
    function testCastVoteAlreadyVoted() public {
        uint256 proposalId = daoVoting.createProposal("Test", "Description", 7 days);
        
        vm.prank(user1);
        daoVoting.castVote(proposalId, true);
        
        vm.prank(user1);
        vm.expectRevert("Already voted");
        daoVoting.castVote(proposalId, false);
    }
    
    function testCastVoteNoTokens() public {
        uint256 proposalId = daoVoting.createProposal("Test", "Description", 7 days);
        address noTokensUser = address(0x999);
        
        vm.prank(noTokensUser);
        vm.expectRevert("No tokens to vote");
        daoVoting.castVote(proposalId, true);
    }
    
    function testCastVoteAfterPeriodEnded() public {
        uint256 proposalId = daoVoting.createProposal("Test", "Description", 1 days);
        
        // Avança o tempo para após o período de votação
        vm.warp(block.timestamp + 2 days);
        
        vm.prank(user1);
        vm.expectRevert("Voting period ended");
        daoVoting.castVote(proposalId, true);
    }
    
    function testExecuteProposalApproved() public {
        uint256 proposalId = daoVoting.createProposal("Test", "Description", 1 days);
        
        // Votos a favor
        vm.prank(user1);
        daoVoting.castVote(proposalId, true); // 500 tokens
        
        vm.prank(user2);
        daoVoting.castVote(proposalId, false); // 300 tokens contra
        
        // Avança o tempo para após o período de votação
        vm.warp(block.timestamp + 2 days);
        
        vm.expectEmit(true, false, false, true);
        emit ProposalExecuted(proposalId, true);
        
        daoVoting.executeProposal(proposalId);
        
        (, , , , , bool executed, ) = daoVoting.getProposal(proposalId);
        assertTrue(executed);
    }
    
    function testExecuteProposalRejected() public {
        uint256 proposalId = daoVoting.createProposal("Test", "Description", 1 days);
        
        // Votos contra
        vm.prank(user1);
        daoVoting.castVote(proposalId, false); // 500 tokens contra
        
        vm.prank(user2);
        daoVoting.castVote(proposalId, true); // 300 tokens a favor
        
        // Avança o tempo para após o período de votação
        vm.warp(block.timestamp + 2 days);
        
        vm.expectEmit(true, false, false, true);
        emit ProposalExecuted(proposalId, false);
        
        daoVoting.executeProposal(proposalId);
        
        (, , , , , bool executed, ) = daoVoting.getProposal(proposalId);
        assertTrue(executed);
    }
    
    function testExecuteProposalBeforePeriodEnded() public {
        uint256 proposalId = daoVoting.createProposal("Test", "Description", 7 days);
        
        vm.expectRevert("Voting period not ended");
        daoVoting.executeProposal(proposalId);
    }
    
    function testExecuteProposalAlreadyExecuted() public {
        uint256 proposalId = daoVoting.createProposal("Test", "Description", 1 days);
        
        // Avança o tempo e executa
        vm.warp(block.timestamp + 2 days);
        daoVoting.executeProposal(proposalId);
        
        // Tenta executar novamente
        vm.expectRevert("Proposal already executed");
        daoVoting.executeProposal(proposalId);
    }
    
    function testIsProposalActive() public {
        uint256 proposalId = daoVoting.createProposal("Test", "Description", 7 days);
        
        // Ativa inicialmente
        assertTrue(daoVoting.isProposalActive(proposalId));
        
        // Não ativa após período
        vm.warp(block.timestamp + 8 days);
        assertFalse(daoVoting.isProposalActive(proposalId));
        
        // Cria nova proposta e executa
        uint256 proposalId2 = daoVoting.createProposal("Test2", "Description2", 7 days);
        vm.warp(block.timestamp + 8 days);
        daoVoting.executeProposal(proposalId2);
        
        // Não ativa após execução
        assertFalse(daoVoting.isProposalActive(proposalId2));
    }
    
    function testMultipleVoters() public {
        uint256 proposalId = daoVoting.createProposal("Test", "Description", 7 days);
        
        // Múltiplos usuários votam
        vm.prank(user1);
        daoVoting.castVote(proposalId, true); // 500 a favor
        
        vm.prank(user2);
        daoVoting.castVote(proposalId, false); // 300 contra
        
        vm.prank(user3);
        daoVoting.castVote(proposalId, true); // 200 a favor
        
        (, , , uint256 forVotes, uint256 againstVotes, , ) = daoVoting.getProposal(proposalId);
        
        assertEq(forVotes, 700 * 10**18); // 500 + 200
        assertEq(againstVotes, 300 * 10**18);
    }
} 