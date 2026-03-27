# 16 - Integração Backend ↔ Frontend 🔗

**Leitura: 12 minutos**

---

## 📋 Arquitetura

```
┌──────────────────────────────────────────────┐
│           Frontend React                      │
│  (WalletConnection, ProposalList, etc)       │
└──────────┬─────────────────────────┬─────────┘
           │                         │
       ethers.js                contract events
           │                         │
           ↓                         ↓
┌────────────────────────────────────────────────┐
│        Smart Contracts (Blockchain)            │
│   BCIToken         DAOVoting                   │
│   (Transfer)       (Vote → Execute)            │
└────────────────────────────────────────────────┘
```

---

## 🔧 Passo 1: Setup ethers.js

### Instalar

```bash
cd frontend
npm install ethers
```

### Inicializar Provider & Signer

```javascript
// src/utils/contracts.js

import { ethers } from 'ethers';

let currentProvider;
let currentSigner;
let currentNetwork = 'sepolia';

// Get Provider (ler dados)
async function getProvider() {
    if (!currentProvider) {
        if (currentNetwork === 'localhost') {
            currentProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
        } else if (currentNetwork === 'sepolia') {
            currentProvider = new ethers.providers.Web3Provider(window.ethereum);
        }
    }
    return currentProvider;
}

// Get Signer (enviar transações)
async function getSigner() {
    const provider = await getProvider();
    if (!currentSigner) {
        currentSigner = provider.getSigner();
    }
    return currentSigner;
}
```

---

## 📄 Passo 2: Carregar Contratos

### ABI (Application Binary Interface)

```javascript
// Já vem do compile do Foundry
const BCIToken_ABI = require('../abis/BCIToken.json');
const DAOVoting_ABI = require('../abis/DAOVoting.json');

// Ou manual:
const BCIToken_ABI = [
    {
        "type": "function",
        "name": "transfer",
        "inputs": [
            { "name": "to", "type": "address" },
            { "name": "amount", "type": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "bool" }],
        "stateMutability": "nonpayable"
    },
    // ... mais funções e eventos
];
```

### Instanciar Contratos

```javascript
// src/utils/contracts.js

async function getBCITokenContract(readOnly = true) {
    const provider = await getProvider();
    const signerOrProvider = readOnly ? provider : await getSigner();
    
    return new ethers.Contract(
        ADDRESS_BCI_TOKEN,   // Endereço do contrato
        BCIToken_ABI,         // Interface
        signerOrProvider      // Provider (read) ou Signer (write)
    );
}

async function getDAOVotingContract(readOnly = true) {
    const provider = await getProvider();
    const signerOrProvider = readOnly ? provider : await getSigner();
    
    return new ethers.Contract(
        ADDRESS_DAO_VOTING,
        DAOVoting_ABI,
        signerOrProvider
    );
}
```

---

## 🎯 Passo 3: Ler Dados

### Exemplo: Ver Saldo de BCI

```javascript
// src/components/ProposalList.js

import React, { useState, useEffect } from 'react';
import { getBCITokenContract } from '../utils/contracts';
import { ethers } from 'ethers';

function ProposalList({ userAddress }) {
    const [balance, setBalance] = useState('0');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBalance();
    }, [userAddress]);

    async function loadBalance() {
        setLoading(true);
        try {
            const contract = await getBCITokenContract(true);  // read-only
            const bal = await contract.balanceOf(userAddress);
            const formatted = ethers.utils.formatUnits(bal, 18);
            setBalance(formatted);
        } catch (error) {
            console.error('Erro ao carregar saldo:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h3>Seu Saldo BCI</h3>
            {loading ? <p>Carregando...</p> : <p>{balance} BCI</p>}
        </div>
    );
}

export default ProposalList;
```

**Padrão**:
```
1. await contract.functionName(params)
2. ethers.utils.formatUnits(result, decimals)
3. Atualiza state React
```

---

## ✏️ Passo 4: Enviar Transações

### Exemplo: Votar em Proposta

```javascript
// src/components/VoteButton.js

import React, { useState } from 'react';
import { getDAOVotingContract } from '../utils/contracts';

function VoteButton({ proposalId, userAddress }) {
    const [loading, setLoading] = useState(false);
    const [tx, setTx] = useState(null);

    async function handleVote(support) {
        setLoading(true);
        try {
            // 1. Pega contrato com Signer (para write)
            const contract = await getDAOVotingContract(false);  // read-write

            // 2. Chama função (assincrono = aguarda)
            const txn = await contract.castVote(proposalId, support);
            console.log('Transação enviada:', txn.hash);
            setTx(txn.hash);

            // 3. Aguarda confirmação
            const receipt = await txn.wait();
            console.log('✅ Transação confirmada!', receipt);

            // 4. Atualiza UI
            alert('Voto registrado com sucesso!');
            
        } catch (error) {
            console.error('Erro ao votar:', error);
            alert('Erro: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <button 
                onClick={() => handleVote(true)}
                disabled={loading}
            >
                {loading ? 'Processando...' : '✅ Votar SIM'}
            </button>
            <button 
                onClick={() => handleVote(false)}
                disabled={loading}
            >
                {loading ? 'Processando...' : '❌ Votar NÃO'}
            </button>
            {tx && (
                <p>
                    <a href={`https://sepolia.etherscan.io/tx/${tx}`} target="_blank">
                        Ver no Etherscan
                    </a>
                </p>
            )}
        </div>
    );
}

export default VoteButton;
```

**Padrão**:
```
1. const contract = await getDAOVotingContract(false)
2. const tx = await contract.functionName(params)
3. const receipt = await tx.wait()
4. // Transação confirmada!
```

---

## 📊 Passo 5: Ouvir Eventos em Tempo Real

### Exemplo: Dashboard de Eventos

```javascript
// src/components/EventDashboard.js

import React, { useState, useEffect } from 'react';
import { getBCITokenContract, getDAOVotingContract } from '../utils/contracts';

function EventDashboard() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        setupEventListeners();
    }, []);

    async function setupEventListeners() {
        try {
            const bciToken = await getBCITokenContract(true);
            const dao = await getDAOVotingContract(true);

            // Ouvir Transfer events
            bciToken.on("Transfer", (from, to, value, event) => {
                console.log('Transfer:', { from, to, value });
                addEvent({
                    type: 'TRANSFER',
                    from,
                    to,
                    value: ethers.utils.formatUnits(value, 18),
                    time: new Date().toLocaleTimeString()
                });
            });

            // Ouvir Vote events
            dao.on("VoteCast", (propId, voter, support, power, event) => {
                console.log('Vote:', { propId, voter, support });
                addEvent({
                    type: 'VOTE',
                    proposalId: propId.toString(),
                    voter,
                    support: support ? 'SIM' : 'NÃO',
                    power: ethers.utils.formatUnits(power, 18),
                    time: new Date().toLocaleTimeString()
                });
            });

            // Ouvir ProposalCreated events
            dao.on("ProposalCreated", (propId, proposer, title, desc, deadline) => {
                console.log('Proposal:', { propId, title });
                addEvent({
                    type: 'PROPOSAL',
                    proposalId: propId.toString(),
                    title,
                    proposer,
                    time: new Date().toLocaleTimeString()
                });
            });

        } catch (error) {
            console.error('Erro ao configurar listeners:', error);
        }
    }

    function addEvent(event) {
        setEvents(prev => [event, ...prev.slice(0, 19)]);  // Keep last 20
    }

    return (
        <div style={{ fontFamily: 'monospace', padding: '20px' }}>
            <h2>📜 Event Stream</h2>
            <div style={{ background: '#1e1e1e', color: '#00ff00', padding: '10px' }}>
                {events.map((e, i) => (
                    <div key={i} style={{ fontSize: '12px', margin: '5px 0' }}>
                        [{e.time}] {e.type}: {JSON.stringify(e).substring(0, 80)}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventDashboard;
```

---

## 🔄 Passo 6: Polling (Atualização Periódica)

### Exemplo: Auto-refresh de Propostas

```javascript
// src/hooks/useProposals.js

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getDAOVotingContract } from '../utils/contracts';

function useProposals(refreshInterval = 5000) {  // 5 segundos
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load inicial
        loadProposals();

        // Polling
        const interval = setInterval(loadProposals, refreshInterval);
        return () => clearInterval(interval);  // Cleanup
    }, [refreshInterval]);

    async function loadProposals() {
        try {
            const dao = await getDAOVotingContract(true);
            const count = await dao.getTotalProposals();
            
            const props = [];
            for (let i = 1; i <= count; i++) {
                const prop = await dao.proposals(i);
                props.push({
                    id: i,
                    title: prop.title,
                    yesVotes: ethers.utils.formatUnits(prop.forVotes, 18),
                    noVotes: ethers.utils.formatUnits(prop.againstVotes, 18),
                    executed: prop.executed,
                    approved: prop.forVotes.gt(prop.againstVotes)
                });
            }
            
            setProposals(props);
        } catch (error) {
            console.error('Erro ao carregar propostas:', error);
        } finally {
            setLoading(false);
        }
    }

    return { proposals, loading };
}

// Usar no componente:
function ProposalList() {
    const { proposals } = useProposals(5000);  // Atualiza a cada 5s

    return (
        <div>
            {proposals.map(prop => (
                <ProposalCard key={prop.id} proposal={prop} />
            ))}
        </div>
    );
}
```

---

## ⚠️ Tratamento de Erros

```javascript
// Erros comuns e como lidar:

async function vote(proposalId, support) {
    try {
        const contract = await getDAOVotingContract(false);
        const tx = await contract.castVote(proposalId, support);
        await tx.wait();
        
    } catch (error) {
        if (error.code === 'ACTION_REJECTED') {
            // Usuário cancelou no MetaMask
            console.log('Usuário cancelou');
            
        } else if (error.code === 'INSUFFICIENT_FUNDS') {
            // Sem ETH para gas
            alert('Sem ETH testnet para gas');
            
        } else if (error.reason === 'Already voted') {
            // Erro do contrato
            alert('Você já votou');
            
        } else if (error.code === 'NETWORK_ERROR') {
            // Conexão com RPC falhou
            alert('Erro de rede');
            
        } else {
            console.error('Erro desconhecido:', error);
            alert('Erro: ' + error.message);
        }
    }
}
```

---

## 📊 Estrutura Recomendada

```
frontend/
├─ src/
│  ├─ components/
│  │  ├─ WalletConnection.js
│  │  ├─ ProposalList.js
│  │  ├─ CreateProposal.js
│  │  ├─ VoteButton.js
│  │  └─ EventDashboard.js
│  ├─ hooks/
│  │  ├─ useProposals.js
│  │  ├─ useBalance.js
│  │  └─ useWeb3.js
│  ├─ utils/
│  │  ├─ contracts.js      ← Setup ethers.js
│  │  ├─ formatters.js     ← Helpers de formatação
│  │  └─ config.js         ← Addresses e RPCs
│  ├─ styles/
│  └─ App.js
├─ public/
├─ package.json
└─ .env.example            ← Contract addresses
```

---

## 🧪 Exemplo Real: Criar + Votar

```javascript
// Fluxo completo

// 1. SETUP
import { ethers } from 'ethers';
const dao = new ethers.Contract(ADDRESS, ABI, signer);
const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);

// 2. VERIFICAR SALDO
const balance = await token.balanceOf(myAddress);
if (balance < ethers.utils.parseUnits('100', 18)) {
    alert('Precisa de 100 BCI para criar proposta');
    return;
}

// 3. CRIAR PROPOSTA
const createTx = await dao.createProposal(
    'Aumentar budget',
    'Aumentar de 2% para 7%',
    3  // 3 dias
);
const createReceipt = await createTx.wait();
console.log('✅ Proposta criada!', createReceipt.transactionHash);

// 4. VOTAR
const voteTx = await dao.castVote(1, true);  // Vote yes na proposta 1
const voteReceipt = await voteTx.wait();
console.log('✅ Voto registrado!', voteReceipt.transactionHash);

// 5. VER RESULTADO
const prop = await dao.proposals(1);
console.log(`SIM: ${prop.forVotes}, NÃO: ${prop.againstVotes}`);
```

---

## 📈 Próximas Leituras

- **FAQ**: [17 - FAQ](./17-faq.md)
- **Glossário**: [18 - Glossário](./18-glossario.md)
- **Links Úteis**: [19 - Links Úteis](./19-links-uteis.md)

---

**Resumo**: Frontend(React) + ethers.js + Smart Contracts(Blockchain) = DAO descentralizado. Ler com `.call()`, escrever com `.send()`, ouvir com `.on()`!
