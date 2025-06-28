// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DAOVoting
 * @dev Contrato de votação para a DAO usando tokens BCI
 * @author Blockchain Insper
 */
contract DAOVoting is Ownable, ReentrancyGuard {
    IERC20 public immutable bciToken;
    
    uint256 public proposalCounter;
    uint256 public constant MIN_VOTING_PERIOD = 1 days;
    uint256 public constant MAX_VOTING_PERIOD = 30 days;
    uint256 public constant MIN_TOKENS_TO_PROPOSE = 100 * 10**18; // 100 tokens
    
    struct Proposal {
        string title;
        string description;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        address proposer;
        mapping(address => bool) hasVoted;
        mapping(address => uint256) voterTokens; // Tokens do usuário no momento do voto
    }
    
    mapping(uint256 => Proposal) public proposals;
    
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        uint256 endTime
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 tokens
    );
    
    event ProposalExecuted(uint256 indexed proposalId, bool approved);
    
    modifier validProposal(uint256 proposalId) {
        require(proposalId <= proposalCounter, "Proposal does not exist");
        _;
    }
    
    modifier canVote(uint256 proposalId) {
        require(block.timestamp < proposals[proposalId].endTime, "Voting period ended");
        require(!proposals[proposalId].hasVoted[msg.sender], "Already voted");
        require(bciToken.balanceOf(msg.sender) > 0, "No tokens to vote");
        _;
    }
    
    constructor(address _bciToken, address initialOwner) Ownable(initialOwner) {
        require(_bciToken != address(0), "Invalid token address");
        bciToken = IERC20(_bciToken);
    }
    
    /**
     * @dev Cria uma nova proposta
     * @param title Título da proposta
     * @param description Descrição da proposta
     * @param votingPeriod Período de votação em segundos
     */
    function createProposal(
        string memory title,
        string memory description,
        uint256 votingPeriod
    ) external returns (uint256) {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(
            votingPeriod >= MIN_VOTING_PERIOD && votingPeriod <= MAX_VOTING_PERIOD,
            "Invalid voting period"
        );
        require(
            bciToken.balanceOf(msg.sender) >= MIN_TOKENS_TO_PROPOSE,
            "Insufficient tokens to create proposal"
        );
        
        proposalCounter++;
        uint256 proposalId = proposalCounter;
        
        Proposal storage newProposal = proposals[proposalId];
        newProposal.title = title;
        newProposal.description = description;
        newProposal.endTime = block.timestamp + votingPeriod;
        newProposal.proposer = msg.sender;
        
        emit ProposalCreated(proposalId, msg.sender, title, newProposal.endTime);
        
        return proposalId;
    }
    
    /**
     * @dev Vota em uma proposta
     * @param proposalId ID da proposta
     * @param support true para votar a favor, false contra
     */
    function castVote(uint256 proposalId, bool support) 
        external 
        validProposal(proposalId) 
        canVote(proposalId) 
        nonReentrant 
    {
        Proposal storage proposal = proposals[proposalId];
        uint256 voterTokens = bciToken.balanceOf(msg.sender);
        
        proposal.hasVoted[msg.sender] = true;
        proposal.voterTokens[msg.sender] = voterTokens;
        
        if (support) {
            proposal.forVotes += voterTokens;
        } else {
            proposal.againstVotes += voterTokens;
        }
        
        emit VoteCast(proposalId, msg.sender, support, voterTokens);
    }
    
    /**
     * @dev Executa uma proposta após o período de votação
     * @param proposalId ID da proposta
     */
    function executeProposal(uint256 proposalId) 
        external 
        validProposal(proposalId) 
        nonReentrant 
    {
        Proposal storage proposal = proposals[proposalId];
        
        require(block.timestamp >= proposal.endTime, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");
        
        proposal.executed = true;
        bool approved = proposal.forVotes > proposal.againstVotes;
        
        emit ProposalExecuted(proposalId, approved);
        
        // Aqui você pode adicionar lógica para executar a proposta
        // Por exemplo, transferir fundos, alterar parâmetros, etc.
    }
    
    /**
     * @dev Retorna informações de uma proposta
     * @param proposalId ID da proposta
     */
    function getProposal(uint256 proposalId) 
        external 
        view 
        validProposal(proposalId) 
        returns (
            string memory title,
            string memory description,
            uint256 endTime,
            uint256 forVotes,
            uint256 againstVotes,
            bool executed,
            address proposer
        ) 
    {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.title,
            proposal.description,
            proposal.endTime,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.executed,
            proposal.proposer
        );
    }
    
    /**
     * @dev Verifica se um endereço já votou em uma proposta
     * @param proposalId ID da proposta
     * @param voter Endereço do votante
     */
    function hasVoted(uint256 proposalId, address voter) 
        external 
        view 
        validProposal(proposalId) 
        returns (bool) 
    {
        return proposals[proposalId].hasVoted[voter];
    }
    
    /**
     * @dev Retorna o número total de propostas
     */
    function getTotalProposals() external view returns (uint256) {
        return proposalCounter;
    }
    
    /**
     * @dev Verifica se uma proposta está ativa (pode receber votos)
     * @param proposalId ID da proposta
     */
    function isProposalActive(uint256 proposalId) 
        external 
        view 
        validProposal(proposalId) 
        returns (bool) 
    {
        return block.timestamp < proposals[proposalId].endTime && !proposals[proposalId].executed;
    }
} 