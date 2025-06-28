import { ethers } from 'ethers';

// Configurações da rede
export const SEPOLIA_CHAIN_ID = 11155111;
export const SEPOLIA_RPC_URL = process.env.REACT_APP_SEPOLIA_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/SEU_API_KEY_AQUI';

// Endereços dos contratos (atualize após deploy)
export const BCI_TOKEN_ADDRESS = process.env.REACT_APP_BCI_TOKEN_ADDRESS ;
export const DAO_VOTING_ADDRESS = process.env.REACT_APP_DAO_VOTING_ADDRESS ;

// Debug: verificar se as variáveis estão sendo carregadas
console.log('Endereços dos contratos:', {
  BCI_TOKEN_ADDRESS,
  DAO_VOTING_ADDRESS,
  env: process.env.REACT_APP_BCI_TOKEN_ADDRESS
});

// ABIs dos contratos (versões simplificadas)
export const BCI_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

export const DAO_VOTING_ABI = [
  "function createProposal(string memory title, string memory description, uint256 votingPeriod) returns (uint256)",
  "function castVote(uint256 proposalId, bool support)",
  "function executeProposal(uint256 proposalId)",
  "function getProposal(uint256 proposalId) view returns (string memory title, string memory description, uint256 endTime, uint256 forVotes, uint256 againstVotes, bool executed, address proposer)",
  "function hasVoted(uint256 proposalId, address voter) view returns (bool)",
  "function getTotalProposals() view returns (uint256)",
  "function isProposalActive(uint256 proposalId) view returns (bool)",
  "function proposalCounter() view returns (uint256)",
  "event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title, uint256 endTime)",
  "event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 tokens)",
  "event ProposalExecuted(uint256 indexed proposalId, bool approved)"
];

// Função para obter o provider
export const getProvider = () => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URL);
};

// Função para obter o signer
export const getSigner = () => {
  const provider = getProvider();
  return provider.getSigner();
};

// Função para obter o contrato do token BCI
export const getBCITokenContract = () => {
  const signer = getSigner();
  return new ethers.Contract(BCI_TOKEN_ADDRESS, BCI_TOKEN_ABI, signer);
};

// Função para obter o contrato de votação
export const getDAOVotingContract = () => {
  const signer = getSigner();
  return new ethers.Contract(DAO_VOTING_ADDRESS, DAO_VOTING_ABI, signer);
};

// Função para conectar a carteira
export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask não encontrado');
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    const provider = getProvider();
    const network = await provider.getNetwork();
    
    if (network.chainId !== SEPOLIA_CHAIN_ID) {
      await switchToSepolia();
    }
    
    const signer = getSigner();
    const address = await signer.getAddress();
    
    return { address, provider, signer };
  } catch (error) {
    console.error('Erro ao conectar carteira:', error);
    throw error;
  }
};

// Função para trocar para a rede Sepolia
export const switchToSepolia = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
    });
  } catch (switchError) {
    // Se a rede não estiver adicionada, adicione ela
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
          chainName: 'Sepolia Test Network',
          rpcUrls: [SEPOLIA_RPC_URL],
          nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
          },
          blockExplorerUrls: ['https://sepolia.etherscan.io/'],
        }],
      });
    } else {
      throw switchError;
    }
  }
};

// Função para formatar tokens (de wei para display)
export const formatTokens = (amount) => {
  if (!amount) return '0';
  return ethers.utils.formatEther(amount);
};

// Função para converter tokens (de display para wei)
export const parseTokens = (amount) => {
  return ethers.utils.parseEther(amount.toString());
};

// Função para formatar endereço
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Função para formatar data
export const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString('pt-BR');
};

// Função para calcular tempo restante
export const getTimeRemaining = (endTime) => {
  const now = Math.floor(Date.now() / 1000);
  const remaining = endTime - now;
  
  if (remaining <= 0) {
    return 'Votação encerrada';
  }
  
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}; 