# 12 - Referência de Funções: DAOVoting 🗳️

**Leitura: 12 minutos**

---

## 📋 Visão Geral

```
DAOVoting = Contrato de Votação
├─ Cria propostas (100 BCI mínimo)
├─ Vota em propostas (1+ BCI)
├─ Executa resultado após votação
└─ Tokens = poder de voto (1 token = 1 voto)
```

---

## 🔧 Funções Principais

### 1️⃣ `createProposal(string title, string description, uint256 votingDays) → uint256`

**O que faz**: Cria uma nova proposta

**Parâmetros**:
| Param | Tipo | Descrição |
|-------|------|-----------|
| `title` | string | Título da proposta (ex: "Aumentar budget") |
| `description` | string | Detalhes (ex: "Aumentar de 2% para 7%") |
| `votingDays` | uint256 | Dias que votação fica aberta |

**Retorno**:
| Tipo | Descrição |
|------|-----------|
| uint256 | ID da proposta criada |

**Validações**:
```
✅ Se tem >= 100 BCI: sucesso
❌ Se tem < 100 BCI: revert ("Insufficient BCI tokens")
❌ Se titulo vazio: revert (pode variar)
❌ Se votingDays < 1: revert
❌ Se votingDays > 30: revert (limite máximo)
```

**Exemplo**:
```solidity
// Alice cria proposta
vm.prank(alice);  // alice é o sender
uint256 proposalId = dao.createProposal(
    "Aumentar orçamento",
    "Aumentar budget anual de 2% para 7% para R&D. Benefícios: mais pessoal, melhores ferramentas, publicações",
    3  // 3 dias votação
);
// Retorno: 1 (primeira proposta)

// Frontend:
const tx = await dao.createProposal(
    "Aumentar orçamento",
    "Aumentar budget...",
    3
);
const receipt = await tx.wait();
const events = receipt.logs;  // eventos
console.log('✅ Proposta #' + proposalId + ' criada!');
```

**Gas**: ~100.000

**Emite evento**: `ProposalCreated(proposalId, proposer, title, description, votingDeadline)`

**Requer**: Antes deve fazer `bciToken.transfer(myAddress, 100e18)` se não tiver

---

### 2️⃣ `vote(uint256 proposalId, bool support) → void`

**O que faz**: Registra seu voto em uma proposta

**Parâmetros**:
| Param | Tipo | Descrição |
|-------|------|-----------|
| `proposalId` | uint256 | ID da proposta |
| `support` | bool | true = vote SIM, false = vote NÃO |

**Retorno**: Nada (void)

**Validações**:
```
✅ Se tem >= 1 BCI: voto contabilizado
❌ Se já votou em proposta: revert ("Already voted")
❌ Se votação expirou: revert ("Voting period ended")
❌ Se tem 0 BCI: revert ("No voting power")
```

**Exemplo**:
```solidity
// Bob vota SIM na proposta 1
vm.prank(bob);
dao.vote(1, true);
// Seu voto = 50 BCI (quantos bob tem)

// Charlie vota NÃO
vm.prank(charlie);
dao.vote(1, false);
// Seu voto = 250 BCI

// Frontend:
const tx = await dao.vote(
    1,      // proposalId
    true    // support = SIM
);
await tx.wait();
console.log('✅ Seu voto foi registrado!');

// Ver resultado:
const proposal = await dao.proposals(1);
console.log('SIM:', ethers.utils.formatUnits(proposal.yesVotes, 18), 'votos');
console.log('NÃO:', ethers.utils.formatUnits(proposal.noVotes, 18), 'votos');
```

**Gas**: ~80.000

**Emite evento**: `VoteCasted(proposalId, voter, support, votePower)`

**Nota Importante**: 
```
Seu poder de voto = saldo de BCI no MOMENTO DA VOTAÇÃO
Se transferir tokens depois, voto não muda!
```

---

### 3️⃣ `executeProposal(uint256 proposalId) → void`

**O que faz**: Executa proposta após votação expirar. Emite um evento com resultado final.

**Parâmetros**:
| Param | Tipo | Descrição |
|-------|------|-----------|
| `proposalId` | uint256 | ID da proposta |

**Retorno**: Nada (void)

**Validações**:
```
✅ Se votação expirou (deadLine passou): sucesso
❌ Se ainda está votando: revert ("Voting period not ended")
❌ Se já foi executada: revert ("Proposal already executed")
```

**O que acontece**:
```
1. Compara yesVotes vs noVotes
2. Determina resultado (APPROVED ou REJECTED)
3. Marca como executada
4. Emite evento ProposalExecuted
```

**Exemplo**:
```solidity
// Cria proposta (votação 2 dias)
vm.prank(alice);
dao.createProposal("Test", "Test", 2);

// Vota
vm.prank(bob);
dao.vote(1, true);   // 500 votos SIM

vm.prank(charlie);
dao.vote(1, false);  // 250 votos NÃO

// Aguarda 2 dias + 1 segundo
vm.warp(block.timestamp + 2 days + 1 seconds);

// Executa
dao.executeProposal(1);

// Verificar resultado
(,, title, desc, yesVotes, noVotes, executed, approved) = dao.proposals(1);
assertEq(executed, true);
assertEq(approved, true);  // SIM > NÃO = aprovada

// Frontend:
const tx = await dao.executeProposal(proposalId);
await tx.wait();

const proposal = await dao.proposals(proposalId);
console.log(
    proposal.approved ? '✅ Proposta APROVADA' : '❌ Proposta REJEITADA'
);
```

**Gas**: ~50.000

**Emite evento**: `ProposalExecuted(proposalId, approved)`

**Qualquer pessoa**: Qualquer endereço pode executar (não precisa ser criador)

---

### 4️⃣ `proposals(uint256 proposalId) → (tuple)`

**O que faz**: Retorna detalhes de uma proposta

**Parâmetros**:
| Param | Tipo | Descrição |
|-------|------|-----------|
| `proposalId` | uint256 | ID da proposta |

**Retorno** (struct Proposal):
```solidity
struct Proposal {
    address proposer;              // quem criou
    string title;                  // título
    string description;            // descrição
    uint256 yesVotes;              // votos SIM
    uint256 noVotes;               // votos NÃO
    uint256 deadline;              // quando vota expira
    bool executed;                 // foi executada?
    bool approved;                 // resultado (só após execute)
}
```

**Exemplo**:
```solidity
(address proposer, string memory title, string memory desc,
 uint256 yes, uint256 no, uint256 deadline, 
 bool executed, bool approved) = dao.proposals(1);

console.log("Criador:", proposer);
console.log("Título:", title);
console.log("Descrição:", desc);
console.log("Votos SIM:", yes / 1e18);      // converte para decimal
console.log("Votos NÃO:", no / 1e18);
console.log("Votação expira em:", deadline); // timestamp
console.log("Executada?", executed);
console.log("Aprovada?", approved);

// Frontend:
const proposal = await dao.proposals(propId);
const daysRemaining = (proposal.deadline - Math.floor(Date.now()/1000)) / 86400;
console.log(`${daysRemaining} dias restantes para votação`);
```

**Gas**: ~1.000 (leitura, grátis)

---

### 5️⃣ `proposalCount() → uint256`

**O que faz**: Retorna quantas propostas foram criadas no total

**Parâmetros**: Nenhum

**Retorno**:
| Tipo | Descrição |
|------|-----------|
| uint256 | ID da próxima proposta |

**Exemplo**:
```solidity
uint256 count = dao.proposalCount();
// Se 5 propostas foram criadas, retorna 6
// Próxima proposta terá ID 6

// Frontend:
const total = await dao.proposalCount();
console.log(`Existem ${total - 1} propostas (próxima será #${total})`);

// Listar todas:
for (let i = 1; i < total; i++) {
    const prop = await dao.proposals(i);
    console.log(`#${i}: ${prop.title}`);
}
```

**Gas**: ~1.000 (leitura, grátis)

---

### 6️⃣ `hasVoted(uint256 proposalId, address voter) → bool`

**O que faz**: Verifica se alguém já votou

**Parâmetros**:
| Param | Tipo | Descrição |
|-------|------|-----------|
| `proposalId` | uint256 | ID da proposta |
| `voter` | address | Endereço da pessoa |

**Retorno**:
| Tipo | Descrição |
|------|-----------|
| bool | true se votou, false se não |

**Exemplo**:
```solidity
// Bob votou em proposta 1?
bool votou = dao.hasVoted(1, bob);
// Retorno: true

// Frontend:
const hasVoted = await dao.hasVoted(proposalId, userAddress);
if (hasVoted) {
    console.log('Você já votou nesta proposta');
    setButtonDisabled(true);
} else {
    console.log('Você pode votar');
    setButtonDisabled(false);
}
```

**Gas**: ~1.000 (leitura, grátis)

---

## 📊 Tabela Rápida DAO

| Função | O Quê | Requer | Custo |
|--------|-------|--------|-------|
| `createProposal` | Nova proposta | 100 BCI | ~100k |
| `vote` | Registra voto | 1+ BCI | ~80k |
| `executeProposal` | Executa resultado | votação expirada | ~50k |
| `proposals` | Ver detalhes | - | grátis |
| `proposalCount` | Total created | - | grátis |
| `hasVoted` | Já votou? | - | grátis |

---

## 🔄 Fluxo Completo: Proposal → Vote → Execute

```
┌─────────────────────────────────────────────────────────────┐
│ Timeline de Uma Proposta                                    │
└─────────────────────────────────────────────────────────────┘

T0: Alice cria proposta
├─ createProposal("...", "...", 3)
├─ Estado: CRIADA
├─ deadline = T0 + 3 dias
├─ yesVotes = 0, noVotes = 0
└─ ✅ Proposta #1 criada

T0 até deadline: Período de votação aberto
├─ Bob: vote(1, true)    → yesVotes += 500
├─ Charlie: vote(1, false) → noVotes += 250
├─ Alice: vote(1, true)    → yesVotes += 100
└─ Estado: VOTANDO

T0 + 3 dias: Votação expirada
├─ Ninguém mais pode votar
└─ Estado: ENCERRADA

T0 + 3 dias + 1s: Execute
├─ executeProposal(1)
├─ Compara: yesVotes (600) vs noVotes (250)
├─ 600 > 250 → APROVADA
├─ Estado: EXECUTADA
└─ approved = true

Exemplo de código:
```solidity
// T0
vm.prank(alice);
dao.createProposal("Aumentar budget", "De 2% para 7%", 3);

// T0+1h
vm.prank(bob);
dao.vote(1, true);

// T0+12h
vm.prank(charlie);
dao.vote(1, false);

// T0+2d
vm.prank(alice);
dao.vote(1, true);

// T0+3d+1s
vm.warp(block.timestamp + 3 days + 1 seconds);
dao.executeProposal(1);

// Verificar
(,, title,, yesVotes, noVotes, executed, approved) = dao.proposals(1);
assertTrue(executed);
assertTrue(approved);
```

---

## 💡 Padrões de Uso

### Padrão 1: Verificar Tudo Antes de Votar (Frontend)

```javascript
async function checkBeforeVoting(proposalId) {
    // 1. Você tem tokens?
    const balance = await bciToken.balanceOf(userAddress);
    if (balance < 1e18) {
        alert('Precisa de 1+ BCI para votar');
        return;
    }

    // 2. Votação ainda aberta?
    const prop = await dao.proposals(proposalId);
    const now = Math.floor(Date.now() / 1000);
    if (now > prop.deadline) {
        alert('Votação expirou');
        return;
    }

    // 3. Já votou?
    const hasVoted = await dao.hasVoted(proposalId, userAddress);
    if (hasVoted) {
        alert('Você já votou');
        return;
    }

    // Tudo ok, pode votar!
    return true;
}
```

### Padrão 2: Listar Todas as Propostas

```javascript
async function getAllProposals() {
    const count = await dao.proposalCount();
    const proposals = [];
    
    for (let i = 1; i < count; i++) {
        const prop = await dao.proposals(i);
        proposals.push({
            id: i,
            title: prop.title,
            yesVotes: prop.yesVotes,
            noVotes: prop.noVotes,
            status: prop.executed ? 'EXECUTADA' : 'VOTANDO'
        });
    }
    
    return proposals;
}
```

### Padrão 3: Auto-Execute Após Deadline

```solidity
// Cron job (Automation)
// Checkea periodicamente se proposta pode ser executada

for (uint256 i = 1; i < dao.proposalCount(); i++) {
    (,,,,,, uint256 deadline, bool executed,) = dao.proposals(i);
    
    if (block.timestamp >= deadline && !executed) {
        dao.executeProposal(i);  // Auto-executa
    }
}
```

---

## ⚠️ Casos Extremos

### Edge Case 1: Votação com 0 votos
```solidity
// Criar proposta mas ninguém vota
vm.prank(alice);
dao.createProposal("Test", "Test", 1);

// Esperar deadline
vm.warp(block.timestamp + 2 days);

// Executar
dao.executeProposal(1);

// 0 > 0? false, então: REJEITADA
(,,,,,,, bool approved) = dao.proposals(1);
assertTrue(!approved);  // false
```

### Edge Case 2: Empate SIM = NÃO
```solidity
// Alice vota SIM (100 tokens)
vm.prank(alice);
dao.vote(1, true);

// Bob vota NÃO (100 tokens)
vm.prank(bob);
dao.vote(1, false);

// 100 == 100, então: SIM vence (regra padrão)
vm.warp(block.timestamp + 2 days);
dao.executeProposal(1);

(,,,,,,, bool approved) = dao.proposals(1);
// approved depende da implementação
// Geralmente: yesVotes > noVotes (SIM tem que ter MAIS)
```

### Edge Case 3: Transferência de tokens após voto
```solidity
// Bob vota com 500 tokens
vm.prank(bob);
dao.vote(1, true);  // voto = 500

// Bob transfere todos os tokens
vm.prank(bob);
token.transfer(alice, 500e18);

// Seu voto NÃO muda! Permanece 500
(,,,, uint256 yesVotes,,,) = dao.proposals(1);
assertEq(yesVotes, 500e18);  // Ainda 500!
```

---

## 🎓 Teste Unitário Completo

```solidity
function testDAOVotingFunctions() public {
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    // Setup: distribuir tokens
    token.transfer(alice, 1000e18);
    token.transfer(bob, 500e18);

    // 1. Create Proposal
    vm.prank(alice);
    dao.createProposal("Budget", "Aumentar", 1);
    assertEq(dao.proposalCount(), 2);  // 2a proposta

    // 2. Vote
    vm.prank(bob);
    dao.vote(1, true);

    bool voted = dao.hasVoted(1, bob);
    assertTrue(voted);

    // 3. Check proposal
    (address proposer, string memory t, string memory d,
     uint256 yes, uint256 no,, bool exec, bool approved) = dao.proposals(1);
    
    assertEq(proposer, alice);
    assertEq(t, "Budget");
    assertEq(yes, 500e18);
    assertEq(no, 0);
    assertFalse(exec);

    // 4. Execute
    vm.warp(block.timestamp + 2 days);
    dao.executeProposal(1);

    (,,,,,, bool executed, bool approved2) = dao.proposals(1);
    assertTrue(executed);
    assertTrue(approved2);
}
```

---

## 📈 Próximas Leituras

- **Eventos**: [13 - Events e Logs](./13-events-logs.md)
- **Segurança**: [14 - Segurança](./14-seguranca.md)
- **Integrações**: [16 - Integração Frontend](./16-integracao-frontend.md)

---

**Resumo**: DAOVoting = 6 funções para democracia onchain. Create → Vote → Execute. A maioria decide!
