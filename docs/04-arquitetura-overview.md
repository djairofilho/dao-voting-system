# 04 - Arquitetura Overview 🏗️

**Leitura: 12 minutos**

## 📐 Diagrama do Sistema Completo

```
┌────────────────────────────────────────────────────┐
│                   USUÁRIO FINAL                    │
│               (Você no navegador)                  │
└─────────────────────┬──────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
    ┌───▼────────┐            ┌────▼────────┐
    │  MetaMask  │            │  carteira   │
    │ Extensão  │            │  Testnet ETH│
    └───┬────────┘            └────┬────────┘
        │ (chave privada)          │ (saldo)
        │                          │
    ┌───▼──────────────────────────▼──────────┐
    │                                          │
    │      FRONTEND (React + ethers.js)        │
    │  ┌──────────────────────────────────┐   │
    │  │ 1. WalletConnection              │   │
    │  │    (conecta MetaMask)            │   │
    │  ├──────────────────────────────────┤   │
    │  │ 2. ProposalList                  │   │
    │  │    (exibe propostas)             │   │
    │  ├──────────────────────────────────┤   │
    │  │ 3. CreateProposal                │   │
    │  │    (criar proposta nova)         │   │
    │  ├──────────────────────────────────┤   │
    │  │ 4. TokenDistribution             │   │
    │  │    (admin distribui BCI)         │   │
    │  ├──────────────────────────────────┤   │
    │  │ 5. SepoliaFaucet                 │   │
    │  │    (obter testnet ETH)           │   │
    │  └──────────────────────────────────┘   │
    │                                          │
    └─────────┬────────────────────────────────┘
              │
              │ (via HTTP API calls)
              │ (JSON-RPC)
              │
    ┌─────────▼────────────────────────────────┐
    │                                          │
    │    SEPOLIA TESTNET BLOCKCHAIN            │
    │    ┌──────────────────────────────────┐  │
    │    │  BCIToken(ERC20)                │  │
    │    │  ├─ totalSupply: 10.000 BCI    │  │
    │    │  ├─ balances[address]          │  │
    │    │  ├─ mint()                      │  │
    │    │  ├─ burn()                      │  │
    │    │  ├─ transfer()                  │  │
    │    │  ├─ distributeTokens()          │  │
    │    │  └─ Eventos: Transfer, Mint... │  │
    │    └──────────────────────────────────┘  │
    │                                          │
    │    ┌──────────────────────────────────┐  │
    │    │  DAOVoting                       │  │
    │    │  ├─ proposalCounter             │  │
    │    │  ├─ proposals[id].title         │  │
    │    │  ├─ proposals[id].votos         │  │
    │    │  ├─ createProposal()            │  │
    │    │  ├─ castVote()                  │  │
    │    │  ├─ executeProposal()           │  │
    │    │  └─ Eventos: ProposalCreated.. │  │
    │    └──────────────────────────────────┘  │
    │                                          │
    │    Chain ID: 11155111 (Sepolia)         │
    │    RPC: Alchemy / Infura                │
    └──────────────────────────────────────────┘
```

---

## 🔗 Como os Contratos Se Conectam

### 1. BCIToken (ERC20 Token)

```solidity
// Arquivo: contracts/src/BCIToken.sol
contract BCIToken is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 10000 * 10**18;
    
    constructor(address initialOwner) {
        _mint(initialOwner, INITIAL_SUPPLY);
    }
    
    // Owner pode distribuir tokens
    function distributeTokens(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        for (uint i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amounts[i]);
        }
    }
}
```

**Responsabilidades**:
- ✅ Criar tokens
- ✅ Rastrear saldo
- ✅ Controlar transferências
- ✅ Ser padrão ERC20

**Usuários**: Todos que votam precisam desses tokens

### 2. DAOVoting (Governança)

```solidity
// Arquivo: contracts/src/DAOVoting.sol
contract DAOVoting is Ownable {
    IERC20 public immutable bciToken;
    uint256 public constant MIN_TOKENS_TO_PROPOSE = 100 * 10**18;
    
    constructor(address _bciToken, address initialOwner) {
        bciToken = IERC20(_bciToken);  // Link com BCIToken!
    }
    
    function createProposal(...) external {
        require(bciToken.balanceOf(msg.sender) >= MIN_TOKENS_TO_PROPOSE);
        // Verifica se tem 100+ BCI
    }
}
```

**Responsabilidades**:
- ✅ Gerenciar propostas
- ✅ Verificar direitos (via BCIToken)
- ✅ Contar votos
- ✅ Executar propostas aprovadas

**Usuários**: Qualquer um com BCI pode participar

### 🔀 Fluxo de Interação

```
┌─ User ─┐
│        │
├─► 1. Conecta wallet (MetaMask)
│
├─► 2. Frontend checa: bciToken.balanceOf(user)
│   ↓
│   BCIToken retorna saldo
│
├─► 3. User clica "Criar Proposta"
│   ↓
│   Frontend chama: daoVoting.createProposal(...)
│   ↓
│   DAOVoting checa: bciToken.balanceOf(msg.sender) >= 100
│   ↓
│   ✅ OK! Cria proposta
│   ↓
│   Emite evento: ProposalCreated(...)
│
├─► 4. Frontend escuta evento
│   ↓
│   Mostra proposta nova na tela
│
└─► 5. Outros users votam
    ↓
    daoVoting.castVote(proposalId, true/false)
    ↓
    ✅ Registrado!
```

---

## 📊 Mapa de Dados

### BCIToken: Quem Tem Quanto?

```
balances (mapping):
├─ 0x123...abc → 1000 BCI  (Alice)
├─ 0x456...def → 500 BCI   (Bob)
├─ 0x789...xyz → 750 BCI   (Carol)
└─ 0xABC...ghi → 100 BCI   (Dave - mínimo para propor)

totalSupply: 10.000 BCI inicial
allowances: Para aprovações
```

### DAOVoting: Propostas

```
proposals (mapping):
├─ ID: 1
│  ├─ title: "Aumentar orçamento"
│  ├─ description: "Alocar 5% mais..."
│  ├─ endTime: 1700000000
│  ├─ forVotes: 350 (Alice 100 + Bob 250)
│  ├─ againstVotes: 75 (Carol 75)
│  ├─ proposer: 0x123...abc (Alice)
│  ├─ executed: false
│  └─ hasVoted[0x456...def]: true
│
├─ ID: 2
│  ├─ title: "Nova proposta"
│  └─ ...
└─ ...

proposalCounter: 2 (próxima proposta será #3)
```

---

## 🎯 Fluxo de Votação Completo

```
FASE 1: PROPOSTA CRIADA
┌────────────────────────────────┐
│ Alice (com 100 BCI) clica em:  │
│ "Registrar Nova Proposta"      │
│                                │
│ Preenche:                      │
│ - Título: "Votação importante" │
│ - Descrição: "Descrição..."    │
│ - Período: 2 dias              │
└───────────────────┬────────────┘
                    │
                    ▼
        ┌─────────────────────┐
        │ Contrato DAOVoting  │
        │                     │
        │ Valida:             │
        │ ✅ Alice tem 100 BCI│
        │ ✅ Período válido   │
        └─────────────────────┘
                    │
                    ▼
        ┌─────────────────────────────┐
        │ Proposta #1 CRIADA          │
        │ Status: Votação Aberta      │
        │ Prazo: 2 dias               │
        └─────────────────────────────┘

FASE 2: VOTAÇÃO
┌────────────────────────────────┐
│ Bob, Carol, Dave votam durante │
│ 2 dias:                        │
│                                │
│ Bob (500 BCI) vota: ✅ SIM     │
│ Carol (750 BCI) vota: ❌ NÃO   │
│ Dave (100 BCI) vota: ✅ SIM    │
└────────────────────────────────┘
        Total: 600 SIM, 750 NÃO

FASE 3: RESULTADO
┌────────────────────────────────┐
│ Votação encerra (2 dias passam)│
│                                │
│ SIM: 600 votos (44%)           │
│ NÃO: 750 votos (56%)           │
│                                │
│ ❌ REJEITADA  (precisava >50%) │
└────────────────────────────────┘
```

---

## 🧬 Stack Tecnológico

### Backend (Smart Contracts)

```
Solidity 0.8.19
├─ OpenZeppelin Contracts
│  ├─ ERC20.sol (padrão token)
│  ├─ Ownable.sol (controle de acesso)
│  └─ ReentrancyGuard.sol (segurança)
├─ BCIToken.sol (nosso token)
└─ DAOVoting.sol (votação)

Deploy: Foundry
└─ forge script ./script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast
```

### Frontend (Interface)

```
React 18
├─ ethers.js (conectar blockchain)
├─ MetaMask (wallet)
└─ Custom CSS (estilos)

Componentes:
├─ WalletConnection (MetaMask)
├─ ProposalList (listar propostas)
├─ CreateProposal (nova proposta)
├─ TokenDistribution (admin)
├─ SepoliaFaucet (testnet ETH)
└─ NetworkSelector (escolher rede)
```

### Rede

```
Sepolia Testnet
├─ Chain ID: 11155111
├─ RPC: https://eth-sepolia.g.alchemy.com/v2/...
├─ Currency: ETH (testnet, gratuito)
└─ Explorer: https://sepolia.etherscan.io/
```

---

## 📋 Checklist de Componentes

| Componente | Arquivo | Status |
|-----------|---------|--------|
| BCIToken | `contracts/src/BCIToken.sol` | ✅ Deployado |
| DAOVoting | `contracts/src/DAOVoting.sol` | ✅ Deployado |
| Deploy Script | `contracts/script/Deploy.s.sol` | ✅ Pronto |
| Frontend React | `frontend/src/App.js` | ✅ Rodando |
| MetaMask Integration | `frontend/src/utils/contracts.js` | ✅ Ativo |
| Documentação | `docs/` | ✅ Este arquivo |

---

## 🔍 Como Tudo Conversa

```
1. USUÁRIO AÇÃO:
   Click "Criar Proposta" → React component

2. REACT:
   Captura dados → Cria transação → Pede assinatura MetaMask

3. METAMASK:
   Pede permissão → Assina com chave privada → Envia transação

4. BLOCKCHAIN:
   Recebe transação → Valida → Executa DAOVoting.createProposal()

5. SMART CONTRACT:
   Verifica BCIToken.balanceOf() → Cria proposta → Emite evento

6. FRONTEND:
   Escuta evento ProposalCreated → Atualiza tela com nova proposta

7. EXPLORER:
   https://sepolia.etherscan.io/tx/0x... mostra toda transação
```

---

## 🎓 Próximos Passos

- **Deve saber sobre**: [05 - BCIToken](./05-bci-token.md)
- **Depois estude**: [06 - DAOVoting](./06-dao-voting.md)
- **Entenda fluxos**: [07 - Fluxos do Sistema](./07-fluxos-sistema.md)

---

**Resumo**: O sistema é:
1. **BCIToken**: rastreia quem tem o direito de votar
2. **DAOVoting**: gerencia propostas e votações
3. **Frontend**: interface amigável para usuários
4. **Blockchain**: executa tudo de forma segura e transparente
