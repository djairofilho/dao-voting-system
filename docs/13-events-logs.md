# 13 - Events e Logs Blockchain 📜

**Leitura: 9 minutos**

---

## 📋 O que são Events?

```
Smart Contracts = Silenciosos
├─ Executam ações
├─ Guardam estado
└─ MAS como você sabe que aconteceu?

Events = "Gritos" do contrato
├─ Anunciam que algo aconteceu
├─ São gravados permanente na blockchain
├─ Você pode "ouvir" em tempo real
└─ Custo bem menor que state changes
```

---

## 🎤 Events em BCIToken

### Evento 1: Transfer

```solidity
// Definição (no contrato)
event Transfer(address indexed from, address indexed to, uint256 value);

// Emitido quando:
// - token.transfer(bob, 100)
// - token.transferFrom(alice, bob, 50)
// - novo token criado
```

**Como interprete**r:
```
from = endereço que enviou
to = endereço que recebeu
value = quantidade transferida (em wei)

Exemplo real:
├─ from: 0x123...abc (Alice)
├─ to: 0x789...def (Bob)
└─ value: 50000000000000000000 (50 tokens com 18 decimais)
```

**Ouvir eventos (Frontend)**:

```javascript
import { ethers } from 'ethers';

// Setup
const provider = new ethers.providers.Web3Provider(window.ethereum);
const token = new ethers.Contract(ADDRESS, ABI, provider);

// Ouvir ALL Transfer events
token.on("Transfer", (from, to, value, event) => {
    console.log(`${from} enviou ${ethers.utils.formatUnits(value, 18)} para ${to}`);
});

// Ou: Once (só uma vez)
await token.once("Transfer");

// Ou: Query histórico
const transfers = await token.queryFilter(
    token.filters.Transfer(userAddress, null),
    0,  // fromBlock
    "latest"
);

transfers.forEach(transfer => {
    console.log(transfer.args);
});
```

### Evento 2: Approval

```solidity
event Approval(address indexed owner, address indexed spender, uint256 value);

// Emitido quando:
// - token.approve(bob, 100)

Exemplo:
├─ owner: 0x123...abc (Alice)
├─ spender: 0x789...def (Bob)
└─ value: 100000000000000000000 (100 tokens)

// Significa: "Alice autorizou Bob a gastar 100 tokens dela"

// Ouvir:
token.on("Approval", (owner, spender, value) => {
    console.log(`${owner} autorizou ${spender} gastar ${ethers.utils.formatUnits(value, 18)}`);
});
```

---

## 🗳️ Events em DAOVoting

### Evento 1: ProposalCreated

```solidity
event ProposalCreated(
    uint256 indexed proposalId,
    address indexed proposer,
    string title,
    string description,
    uint256 deadline
);

// Emitido quando: dao.createProposal()

Exemplo:
├─ proposalId: 1
├─ proposer: 0x123...abc (Alice)
├─ title: "Aumentar budget"
├─ description: "De 2% para 7%"
└─ deadline: 1700000000 (timestamp)

// Ouvir:
dao.on("ProposalCreated", (propId, proposer, title, desc, deadline) => {
    console.log(`🆕 Proposta #${propId} criada por ${proposer}: "${title}"`);
});
```

### Evento 2: VoteCasted

```solidity
event VoteCasted(
    uint256 indexed proposalId,
    address indexed voter,
    bool support,
    uint256 votePower
);

// Emitido quando: dao.vote()

Exemplo:
├─ proposalId: 1
├─ voter: 0x789...def (Bob)
├─ support: true (SIM)
└─ votePower: 500000000000000000000 (500 tokens)

// Ouvir:
dao.on("VoteCasted", (propId, voter, support, power) => {
    const voto = support ? "SIM" : "NÃO";
    console.log(`🗳️  ${voter} votou ${voto} com ${ethers.utils.formatUnits(power, 18)} poder`);
});
```

### Evento 3: ProposalExecuted

```solidity
event ProposalExecuted(
    uint256 indexed proposalId,
    bool approved
);

// Emitido quando: dao.executeProposal()

Exemplo:
├─ proposalId: 1
└─ approved: true (APROVADA)

// Ouvir:
dao.on("ProposalExecuted", (propId, approved) => {
    const resultado = approved ? "✅ APROVADA" : "❌ REJEITADA";
    console.log(`📊 Proposta #${propId} ${resultado}`);
});
```

---

## 🔍 Buscar Eventos no Etherscan

### No Browser

1. Vá em: https://sepolia.etherscan.io
2. Cole seu address
3. Tab: "Logs"
4. Vê TODOS os events que sua carteira participou

### Exemplo de Log

```
Address: 0x123...abc
Transaction Hash: 0xdef...ghi
Block: 4123456

Decoded Logs:
├─ Contract: BCIToken (0x111...)
├─ Event: Transfer
├─ from: 0x... (Alice)
├─ to: 0x... (Bob)
└─ value: 100 BCI
```

---

## 💻 Exemplo Frontend: Dashboard de Eventos

```javascript
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function EventDashboard() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        watchEvents();
    }, []);

    async function watchEvents() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const bciToken = new ethers.Contract(ADDRESS_BCI, ABI_BCI, provider);
        const dao = new ethers.Contract(ADDRESS_DAO, ABI_DAO, provider);

        // Listen to ALL token transfers
        bciToken.on("Transfer", (from, to, value) => {
            console.log(`📤 Transfer: ${from} → ${to}: ${ethers.utils.formatUnits(value, 18)} BCI`);
            
            addEvent({
                type: 'TRANSFER',
                from,
                to,
                value: ethers.utils.formatUnits(value, 18),
                timestamp: new Date().toLocaleTimeString()
            });
        });

        // Listen to votes
        dao.on("VoteCasted", (propId, voter, support, power) => {
            console.log(`🗳️  Vote on #${propId}: ${voter} voted ${support ? 'YES' : 'NO'}`);
            
            addEvent({
                type: 'VOTE',
                proposalId: propId.toString(),
                voter,
                support: support ? 'SIM' : 'NÃO',
                power: ethers.utils.formatUnits(power, 18),
                timestamp: new Date().toLocaleTimeString()
            });
        });

        // Listen to proposals
        dao.on("ProposalCreated", (propId, proposer, title) => {
            console.log(`🆕 Proposal #${propId}: "${title}" by ${proposer}`);
            
            addEvent({
                type: 'PROPOSAL',
                proposalId: propId.toString(),
                proposer,
                title,
                timestamp: new Date().toLocaleTimeString()
            });
        });
    }

    function addEvent(event) {
        setEvents(prev => [event, ...prev.slice(0, 9)]);  // Keep last 10
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h2>📜 Event Stream</h2>
            <div style={{ 
                background: '#1e1e1e', 
                color: '#00ff00',
                padding: '10px',
                borderRadius: '5px',
                maxHeight: '400px',
                overflowY: 'auto'
            }}>
                {events.length === 0 ? (
                    <div>⏳ Aguardando eventos...</div>
                ) : (
                    events.map((e, i) => (
                        <div key={i} style={{ margin: '5px 0', fontSize: '12px' }}>
                            {e.timestamp} - {e.type}: {JSON.stringify(e).substring(0, 60)}...
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default EventDashboard;
```

---

## 🔎 Buscar Eventos Históricos

### Query Eventos Passados

```javascript
async function getTransferHistory(userAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const token = new ethers.Contract(ADDRESS_BCI, ABI_BCI, provider);

    // Pega todos os Transfers para este address
    // nos últimos 10.000 blocos
    const filter = token.filters.Transfer(userAddress);
    
    const events = await token.queryFilter(
        filter,
        'latest' - 10000,
        'latest'
    );

    console.log(`📊 Encontrou ${events.length} transferências`);
    
    events.forEach(event => {
        const { from, to, value } = event.args;
        console.log(`
            De: ${from}
            Para: ${to}
            Valor: ${ethers.utils.formatUnits(value, 18)} BCI
            Bloco: ${event.blockNumber}
            Hash: ${event.transactionHash}
        `);
    });
}

// Usar:
await getTransferHistory("0x123...abc");
```

### Query com Filtro Avançado

```javascript
async function getProposalActivity(proposalId) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const dao = new ethers.Contract(ADDRESS_DAO, ABI_DAO, provider);

    // Todos os votos para esta proposta
    const voteFilter = dao.filters.VoteCasted(proposalId);
    const votes = await dao.queryFilter(voteFilter, 'latest' - 50000, 'latest');

    console.log(`📊 Proposta #${proposalId} recebeu ${votes.length} votos:`);
    
    votes.forEach(vote => {
        const { voter, support, votePower } = vote.args;
        console.log(`
            Votante: ${voter}
            Voto: ${support ? 'SIM' : 'NÃO'}
            Poder: ${ethers.utils.formatUnits(votePower, 18)} BCI
        `);
    });
}
```

---

## 📊 Decoding Events da Blockchain

### Obter Event do Bloco

```javascript
// Evento raw (antes de decode)
async function getRawEvent() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    // Pega receipt de uma transação
    const receipt = await provider.getTransactionReceipt(TX_HASH);
    
    // Logs são eventos em forma raw
    receipt.logs.forEach(log => {
        console.log('Raw log:', log);
        // Precisa decoder manualmente ou usar contract.interface
    });
}

// Com contract interface (auto-decode)
async function getDecodedEvent() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const token = new ethers.Contract(ADDRESS_BCI, ABI_BCI, provider);

    const receipt = await provider.getTransactionReceipt(TX_HASH);
    
    receipt.logs.forEach(log => {
        try {
            const decoded = token.interface.parseLog(log);
            console.log('Event:', decoded.name);
            console.log('Args:', decoded.args);
        } catch (e) {
            // Log não é deste contrato
        }
    });
}
```

---

## ⚠️ Indexed vs Non-Indexed

```solidity
// BCIToken
event Transfer(
    address indexed from,              // INDEXED = filtrable
    address indexed to,                // INDEXED = filtrable
    uint256 value                      // NÃO indexed = tipo dados grandes
);

// DAOVoting
event ProposalCreated(
    uint256 indexed proposalId,        // INDEXED
    address indexed proposer,          // INDEXED
    string title,                      // NÃO indexed (string é grande)
    string description,                // NÃO indexed
    uint256 deadline                   // Talvez devesse ser indexed
);
```

**Diferença**:
```javascript
// Indexed = rápido filtrar
const transfers = await token.queryFilter(
    token.filters.Transfer("0x123", null),  // filtro rápido
    0,
    'latest'
);

// Não-indexed = lento
const byTitle = await dao.queryFilter(
    token.filters.Transfer(null, null, "Aumentar budget")  // Lento! Precisa ler TUDO
);
```

**Regra**: Máximo 3 índices por evento!

---

## 🎓 Teste: Verificar Eventos

```solidity
function testEventsEmitted() public {
    // Arrange
    address alice = makeAddr("alice");
    
    // Act & Assert
    vm.expectEmit(true, false, false, true);  // Check indexed params
    emit Transfer(address(this), alice, 100e18);
    token.transfer(alice, 100e18);
    
    // Verify
    assertEq(token.balanceOf(alice), 100e18);
}
```

---

## 📊 Monitorar em Tempo Real

```javascript
// Subgraph (The Graph Protocol)
// Exemplo: Consultar eventos via GraphQL

const query = `
  query {
    votes(where: { proposalId: 1 }) {
      voter
      support
      votePower
      blockNumber
    }
  }
`;

const response = await fetch('https://api.thegraph.com/...', {
    method: 'POST',
    body: JSON.stringify({ query })
});

const data = await response.json();
console.log(data.data.votes);
```

---

## 📈 Próximas Leituras

- **Segurança**: [14 - Segurança](./14-seguranca.md)
- **Gas**: [15 - Otimizações de Gas](./15-optimizacoes-gas.md)
- **Frontend**: [16 - Integração Frontend](./16-integracao-frontend.md)

---

**Resumo**: Events = logs permanentes. Transferências, votos, propostas deixam rastro. Frontend ouve eventos com `.on()`. Histórico consultável no Etherscan!
