# 06 - DAOVoting Explicado 🗳️

**Leitura: 18 minutos**

## O que é DAOVoting?

DAOVoting é o contrato que gerencia:
- 📋 Criação de propostas
- 🗳️ Votações (sim/não)
- ⚡ Execução de resultados

---

## 📋 Visão Geral do Contrato

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DAOVoting is Ownable, ReentrancyGuard {
    IERC20 public immutable bciToken;
    
    uint256 public constant MIN_VOTING_PERIOD = 1 days;
    uint256 public constant MAX_VOTING_PERIOD = 30 days;
    uint256 public constant MIN_TOKENS_TO_PROPOSE = 100 * 10**18;  // 100 BCI
    
    struct Proposal {
        string title;
        string description;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        address proposer;
        mapping(address => bool) hasVoted;
        mapping(address => uint256) voterTokens;
    }
    
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCounter;
    
    event ProposalCreated(uint indexed proposalId, address indexed proposer, 
                         string title, uint256 endTime);
    event VoteCast(uint indexed proposalId, address indexed voter, 
                   bool support, uint256 tokens);
    event ProposalExecuted(uint indexed proposalId, bool approved);
}
```

---

## 🔧 Funções Principais

### 1. `createProposal()` - Criar Nova Proposta

```solidity
function createProposal(
    string memory title,
    string memory description,
    uint256 votingPeriod
) external returns (uint256)
```

**Requisitos**:
- ✅ Ter 100+ BCI
- ✅ Título não vazio
- ✅ Descrição não vazia
- ✅ Período entre 1-30 dias

**Custa**: ~100.000 gas

**Uso Prático**:
```javascript
// Alice (com 100 BCI) cria proposta
const tx = await daoVoting.createProposal(
    "Aumentar orçamento blockchain",
    "Aumentar investimento em pesquisa blockchain de 2% para 7%",
    2 * 24 * 60 * 60  // 2 dias em segundos
);

const receipt = await tx.wait();
// Proposta criada com ID = 1
```

**O que acontece**:
```
1. Checa: bciToken.balanceOf(Alice) >= 100
2. Valida: título e descrição não vazios
3. Valida: votingPeriod entre 1-30 dias
4. Cria proposta:
   {
       title: "Aumentar orçamento blockchain",
       description: "...",
       endTime: now + 2 dias,
       forVotes: 0,
       againstVotes: 0,
       executed: false,
       proposer: Alice
   }
5. proposalCounter++
6. Emite DiariEvent: ProposalCreated(1, Alice, "...", endTime)
```

**Resultado**:
- ✅ Proposta ID = 1 criada
- ✅ Status = Votação aberta
- ✅ Qualquer um pode votar

### 2. `castVote()` - Votar

```solidity
function castVote(uint256 proposalId, bool support) 
    external 
    nonReentrant
```

**Requisitos**:
- ✅ Votação ainda aberta (block.timestamp < endTime)
- ✅ Não votou antes
- ✅ Tem 1+ BCI

**Custa**: ~80.000 gas

**Uso Prático**:
```javascript
// Bob (com 500 BCI) vota SIM na proposta 1
const tx = await daoVoting.castVote(1, true);  // true = SIM
await tx.wait();

// Carol (com 750 BCI) vota NÃO na proposta 1
const tx2 = await daoVoting.castVote(1, false);  // false = NÃO
await tx2.wait();
```

**O que acontece**:
```
PARA BOB (support = true):
1. Checa: block.timestamp < endTime? ✅
2. Checa: !hasVoted[Bob]? ✅
3. Checa: bciToken.balanceOf(Bob) > 0? ✅
4. Pega token balance: 500 BCI
5. forVotes += 500
6. hasVoted[Bob] = true
7. voterTokens[Bob] = 500
8. Emite: VoteCast(1, Bob, true, 500)

RESULTADO:
forVotes = 500
againstVotes = 0
```

**Propriedade Importante**: 1 pessoa = 1 voto, INDEPENDENTE de quantos tokens tem!

Espera... não! Sistema ATUAL:
```
Bob com 500 BCI = 500 votos SIM
Carol com 750 BCI = 750 votos NÃO

Não é "1 pessoa 1 voto"
É "1 BCI = 1 voto" (token weighted voting)
```

### 3. `getProposal()` - Obter Informações

```solidity
function getProposal(uint256 proposalId) 
    external 
    view 
    returns (
        string memory title,
        string memory description,
        uint256 endTime,
        uint256 forVotes,
        uint256 againstVotes,
        bool executed,
        address proposer
    )
```

**Não custa gas** (é view)

**Uso Prático**:
```javascript
// Frontend pega info da proposta 1
const proposal = await daoVoting.getProposal(1);

console.log(proposal.title);         // "Aumentar orçamento..."
console.log(proposal.forVotes);      // 600 (Bob 500 + Dave 100)
console.log(proposal.againstVotes);  // 750 (Carol 750)
console.log(proposal.endTime);       // 1234567890 (timestamp)
```

### 4. `executeProposal()` - Executar Resultado

```solidity
function executeProposal(uint256 proposalId) external nonReentrant
```

**Requisitos**:
- ✅ Votação terminou
- ✅ Ainda não foi executada

**Custa**: ~50.000 gas

**Uso Prático**:
```javascript
// Qualquer um pode executar após votação terminar
const tx = await daoVoting.executeProposal(1);
await tx.wait();
```

**O que acontece**:
```
1. Checa: block.timestamp > endTime? 
   (ou seja, votação terminou)
2. Calcula resultado:
   forVotes = 600
   againstVotes = 750
   
   600 > 750? NÃO ✗
   Maioria votou CONTRA
   
3. Marca: executed = true
4. Emite: ProposalExecuted(1, false)
   (false = rejeitada)
```

---

## 📊 Estruturas de Dados

### Struct Proposal

```solidity
struct Proposal {
    string title;                      // "Aumentar orçamento"
    string description;                // "Alocar mais..."
    uint256 endTime;                   // 1234567890 (timestamp)
    uint256 forVotes;                  // 600 (soma de tokens SIM)
    uint256 againstVotes;              // 750 (soma de tokens NÃO)
    bool executed;                     // false (ainda não executado)
    address proposer;                  // 0x123...abc (Alice)
    
    mapping(address => bool) hasVoted;         // Quem já votou
    mapping(address => uint256) voterTokens;   // Quantos BCI tinha ao votar
}
```

### Mapa de Propostas

```solidity
mapping(uint256 => Proposal) public proposals;
```

```
Interno:
proposals[1] = Proposal { title: "Orçamento", ... }
proposals[2] = Proposal { title: "Nova sede", ... }

Frontend acessa:
propostas = [
  {
    id: 1,
    title: "Aumentar orçamento",
    status: "votação_aberta",
    dias_restantes: 1.5
  },
  {
    id: 2,
    title: "Abrir nova sede",
    status: "votação_encerrada",
    aprovada: true
  }
]
```

---

## 🎯 Ciclo de Vida Completo

### Timeline: Proposta #1

```
HORA 0:00
┌─────────────────────────────────┐
│ Alice cria proposta #1          │
│ Período votação: 2 dias         │
│ endTime = now + 172.800 segundos│
│                                 │
│ Status: ABERTA                  │
└─────────────────────────────────┘
         ↓ (1 dia passa)

HORA 24:00
┌─────────────────────────────────┐
│ Bob votou: +500 SIM             │
│ Carol votou: +750 NÃO           │
│ Dave votou: +100 SIM            │
│                                 │
│ Placar: 600 vs 750              │
│ Status: AINDA ABERTA            │
└─────────────────────────────────┘
         ↓ (1 dia passa - total 2)

HORA 48:00  ← endTime chega!
┌─────────────────────────────────┐
│ Votação ENCERRADA               │
│ Result: 600 SIM vs 750 NÃO      │
│                                 │
│ Aprovada? 600 > 750?            │
│ NÃO! ✗ REJEITADA!              │
└─────────────────────────────────┘
         ↓ (alguém clica execute)

QUALQUER HORA DEPOIS
┌─────────────────────────────────┐
│ Proposta executada              │
│ Status: ENCERRADA (REJEITADA)   │
│ Resultado permanente na chain   │
└─────────────────────────────────┘
```

---

## 🔐 Lógica de Aprovação

### Critério de Aprovação

```javascript
// Regra: SIM precisa ser MAIORIA ESTRITA

forVotes:    600
againstVotes: 750
total:       1350

aprovada = forVotes > againstVotes
         = 600 > 750
         = FALSE ✗ REJEITADA

// Precisaria de:
// 676 SIM para aprovar (> 50% de 1350)
```

### Diferentes Cenários

```
Cenário 1: APROVADA
┌──────────────────────┐
│ SIM: 800             │
│ NÃO: 700             │
│ 800 > 700? SIM ✅    │
│ Status: APROVADA!    │
└──────────────────────┘

Cenário 2: REJEITADA
┌──────────────────────┐
│ SIM: 700             │
│ NÃO: 800             │
│ 700 > 800? NÃO ✗     │
│ Status: REJEITADA!   │
└──────────────────────┘

Cenário 3: EMPATE
┌──────────────────────┐
│ SIM: 750             │
│ NÃO: 750             │
│ 750 > 750? NÃO ✗     │
│ Status: REJEITADA!   │
│ (empate = rejeita)   │
└──────────────────────┘
```

---

## 🎬 Fluxo Completo de Uso

### Passo a Passo

```
PASSO 1: Alguém com 100+ BCI clica "Nova Proposta"
  Título: "Votação importante"
  Desc: "Este é um teste de votação"
  Dias: 2 dias
        ↓
        daoVoting.createProposal(...)
        ↓
        ✅ Proposta #42 criada!

PASSO 2: Membros com BCI veem proposta no frontend
  Proposta #42
  Status: Votação Aberta (1d 23h restantes)
  SIM (0) vs NÃO (0)
  [VOTAR SIM] [VOTAR NÃO]

PASSO 3: Membros votam
  Alice (100 BCI) → SIM
  Bob (250 BCI) → NÃO
  Carol (150 BCI) → SIM
  Dave (500 BCI) → SIM
        ↓
        Placar: 600 SIM vs 250 NÃO

PASSO 4: Após 2 dias, votação encerra automaticamente
  (endTime passa)
  Proposta #42
  Status: Votação Encerrada
  Resultado: 600 SIM vs 250 NÃO
  Aprovada? 600 > 250? SIM ✅

PASSO 5: Alguém clica "Executar Proposta"
  daoVoting.executeProposal(42)
        ↓
        ✅ Proposta executada!
        Resultado final registrado na chain
```

---

## 🔍 Modifiers (Segurança)

### `validProposal(proposalId)`

```solidity
modifier validProposal(uint256 proposalId) {
    require(proposalId <= proposalCounter, "Proposal does not exist");
    _;
}
```

Previne:
- ❌ Votar em proposta que não existe (#999 quando só tem 5)
- ❌ Buscar dados de ID inválido

### `canVote(proposalId)`

```solidity
modifier canVote(uint256 proposalId) {
    require(block.timestamp < proposals[proposalId].endTime, 
            "Voting period ended");
    require(!proposals[proposalId].hasVoted[msg.sender], 
            "Already voted");
    require(bciToken.balanceOf(msg.sender) > 0, 
            "No tokens to vote");
    _;
}
```

Previne:
- ❌ Votar após prazo
- ❌ Votar duas vezes
- ❌ Votar sem tokens

### `nonReentrant`

```solidity
modifier nonReentrant() {
    require(!locked, "No reentrant calls");
    locked = true;
    _;
    locked = false;
}
```

Previne:
- ❌ Ataques de reentrância (advanced)

---

## 📊 Exemplo de Execução

### Caso Real

```javascript
// 1. Deploy (já feito)
const dao = new ethers.Contract(
    "0xb3d9dD3213b7B6c8D1F46Dc24c869c99647b53e9",
    DAO_ABI,
    signer
);

// 2. Alice cria proposta
const createTx = await dao.createProposal(
    "Aumentar R&D budget",
    "Alocar 5% adicional para pesquisa blockchain",
    86400 * 2  // 2 dias
);
const createReceipt = await createTx.wait();
console.log("Proposta criada! ID: 1");

// 3. Bob vota
const voteTx = await dao.connect(bobSigner).castVote(1, true);
await voteTx.wait();
console.log("Bob votou SIM");

// 4. Pega estado atual
const proposal = await dao.getProposal(1);
console.log(`Votos: ${proposal.forVotes} SIM, ${proposal.againstVotes} NÃO`);

// 5. Espera 2 dias... (ou em teste, avança tempo)
// time.increase(86400 * 2);

// 6. Executa
const executeTx = await dao.executeProposal(1);
await executeTx.wait();
console.log("Proposta executada! Resultado: APROVADA" );
```

---

## 🚨 Casos de Erro

| Erro | Causa | Solução |
|------|-------|---------|
| `Insufficient tokens` | < 100 BCI para proposal | Peça mais tokens no admin |
| `Voting period ended` | Tentou votar após prazo | Votação já encerrou |
| `Already voted` | Já votou nesta proposta | Não pode mudar voto |
| `No tokens to vote` | 0 BCI para votar | Distribua tokens |
| `Invalid voting period` | Período < 1 dia ou > 30 | Use entre 1-30 dias |

---

## 🎓 Próximas Leituras

- **Fluxos detalhados**: [07 - Fluxos do Sistema](./07-fluxos-sistema.md)
- **Funções completas**: [12 - Funções DAOVoting](./12-funcoes-dao-voting.md)
- **Eventos**: [13 - Events & Logs](./13-events-logs.md)

---

**Resumo**:
- DAOVoting = Motor de votação democrática
- Qualquer um com BCI pode votar
- 1 BCI = 1 voto (token weighted)
- Maioria estrita aprova propostas
- Tudo imutável e verificável na blockchain
