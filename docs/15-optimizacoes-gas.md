# 15 - Otimizações de Gas ⛽

**Leitura: 10 minutos**

---

## 📋 O que é Gas?

```
Blockchain = Computação compartilhada
├─ Cada operação custa ETH
├─ Gas = "combustível" que paga a computação
└─ Menos gas = Mais barato!

Exemplo:
transfer(100 BCI) = 50.000 gas @ 30 gwei
                  = 0.0015 ETH 
                  = ~$2 USD

Optimizar gas = Economizar $ real!
```

---

## 💰 Custos Comuns

```solidity
// Custos típicos:
2 gas:   ADD, SUB, MUL, DIV, MOD, LT, GT, EQ...
3 gas:   SHA3
20 gas:  SLOAD (ler storage)
21000 gas: Transaction base

❌ CARO:
5000 gas: SSTORE (escrever storage)
20000 gas: CREATE (novo contrato)
32000 gas: SELFDESTRUCT

Regra: Evitar SSTORE ao máximo!
```

---

## ✂️ Técnica 1: Packing Variables

### ❌ Ruim: ordem que desperdiça slots

```solidity
contract BadPacking {
    uint128 b;      // 16 bytes (slot 0: metade usada)
    uint256 a;      // 32 bytes (slot 1)
    uint128 c;      // 16 bytes (slot 2: metade usada)
    uint256 d;      // 32 bytes (slot 3)
    
    // Total: 4 slots = 4 * 20000 gas por write
}
```

### ✅ Bom: agrupar tipos pequenos

```solidity
contract GoodPacking {
    uint128 b;          // 16 bytes \
    uint128 c;          // 16 bytes / (slot 0 completo)
    uint256 a;          // 32 bytes (slot 1)
    uint256 d;          // 32 bytes (slot 2)
    
    // Total: 3 slots = 3 * 20000 gas
    // Economiza ~20k gas!
}

// Mesma ideia, também eficiente:
contract BetterPacking {
    uint128 b;          // 16 bytes \
    uint128 c;          // 16 bytes / (slot 0)
    uint256 a;          // 32 bytes (slot 1)
    uint256 d;          // 32 bytes (slot 2)
    
    // Total: 3 slots
}
```

**Nossa codebase**:
```solidity
// BCIToken (ERC20) usa packing automático
// DAOVoting poderia usar melhor:

struct Proposal {
    address proposer;     // 20 bytes
    string title;         // referência (32 bytes)
    string description;   // referência (32 bytes)
    uint256 yesVotes;     // 32 bytes
    uint256 noVotes;      // 32 bytes
    uint256 deadline;     // 32 bytes
    bool executed;        // 1 byte  <- PODE PACKAR!
    bool approved;        // 1 byte  <- PODE PACKAR!
}

// Hoje = 8 slots, poderia ser 7 com packing correto
```

---

## 📉 Técnica 2: Usar memory ao invés de storage

### ❌ Ruim: Lê storage 10 vezes

```solidity
function badForLoop(uint256 count) public {
    for (uint i = 0; i < count; i++) {
        totalSupply += 1;  // SLOAD(20) + ADD(3) + SSTORE(5000) = 5023 gas/iter
    }
}

// 10 iterações = 50.230 gas!
```

### ✅ Bom: Usa memory, escreve uma vez

```solidity
function goodForLoop(uint256 count) public {
    uint256 temp = totalSupply;  // SLOAD (20 gas) - 1 vez!
    
    for (uint i = 0; i < count; i++) {
        temp += 1;  // Operação em memory (3 gas)
    }
    
    totalSupply = temp;  // SSTORE (5000 gas) - 1 vez!
}

// 10 iterações = 20 + (10*3) + 5000 = 5050 gas
// Economiza 50.000 - 5050 = 44.950 gas!!!
```

---

## 🔄 Técnica 3: Minimizar Writes em Loops

```solidity
// ❌ BUG no DAOVoting?
function countVotes() public view returns (uint yes, uint no) {
    for (uint i = 1; i < proposalCount; i++) {
        if (proposals[i].approved) {
            yes++;  // Escreve memory cada vez? Não, é memory.
        }
    }
}

// Isso é OK, mas...
```

---

## 📦 Técnica 4: Cache function results

```solidity
// ❌ Ruim: Chama balanceOf 3 vezes (+ caros)
function badVote(uint propId, bool support) public {
    require(token.balanceOf(msg.sender) >= 1e18);
    require(token.balanceOf(msg.sender) <= 1000e18);
    votePower = token.balanceOf(msg.sender);
}

// ✅ Bom: Cache o resultado
function goodVote(uint propId, bool support) public {
    uint power = token.balanceOf(msg.sender);
    require(power >= 1e18);
    require(power <= 1000e18);
    votePower = power;
}
```

---

## 🗑️ Técnica 5: Remover Dead Code

```solidity
// ❌ Nunca usado
function unusedFunction() public pure returns (uint) {
    return 42;
}

// Delete para economizar deployment gas!
```

---

## 💾 Técnica 6: Usar Mappings em vez de Arrays

```solidity
// ❌ Array = mais caro (precisa iterar)
address[] public holders;
function isHolder(address user) public view returns (bool) {
    for (uint i; i < holders.length; i++) {
        if (holders[i] == user) return true;
    }
    return false;
}

// ✅ Mapping = O(1) lookup
mapping(address => bool) public isHolder;
function isHolder(address user) public view returns (bool) {
    return isHolder[user];  // Instant!
}
```

<!-- Nossa codebase usa mappings bem! -->

---

## 📊 Técnica 7: Usar Smaller Integer Types

```solidity
// ❌ Usa uint256 mesmo precisando uint8
uint256 proposalCount;  // Pode ter 2^256 propostas? Improvável!

// ✅ Usa uint32 (pode ter até 4 bilhões)
uint32 proposalCount;

// Economiza 24 bytes de storage (comparado a uint256)
// Mas cuidado com conversões:
proposalCount++;  // Precisa cast se retornar uint256
```

---

## 🎯 Exemplo: Otimizar createProposal

```solidity
// ANTES: ~100.000 gas
function createProposal(
    string memory title,        // memory (ok)
    string memory description,  // memory (ok)
    uint256 votingDays          // Larger than needed!
) public {
    require(token.balanceOf(msg.sender) >= 100e18);
    
    proposalCounter++;
    proposals[proposalCounter] = Proposal({
        proposer: msg.sender,
        title: title,
        description: description,
        forVotes: 0,
        againstVotes: 0,
        endTime: block.timestamp + (votingDays * 1 days),
        executed: false
    });
}

// DEPOIS: ~89.000 gas
function createProposal(
    string calldata title,      // calldata (+ barato que memory)
    string calldata description,
    uint8 votingDays            // uint8 é suficiente (max 255 dias)
) public {
    require(token.balanceOf(msg.sender) >= 100e18);
    
    unchecked { proposalCounter++; }  // Sem overflow check (sabemos que OK)
    
    Proposal storage prop = proposals[proposalCounter];
    prop.proposer = msg.sender;
    prop.title = title;
    prop.description = description;
    prop.forVotes = 0;
    prop.againstVotes = 0;
    prop.endTime = block.timestamp + uint256(votingDays) * 1 days;
    prop.executed = false;
}

// Economiza: 100k - 89k = 11k gas = ~$0.33
```

---

## 📈 Diminuição de Deployment Gas

```bash
# Deploy tamanho contrato:
forge build --sizes

# Output:
# BCIToken:
#   Bytecode: 3.456 bytes (max 24KB OK)
# DAOVoting:
#   Bytecode: 4.123 bytes

# Se > 24KB precisa otimizar!

# Deploy actual costs:
# BCIToken deploy: ~200k gas
# DAOVoting deploy: ~250k gas
# Total: ~450k gas = ~$10-50 USD (depende de gwei)
```

---

## 🧪 Medir Gas em Testes

```solidity
function testGasCreateProposal() public {
    // Marca início
    uint gasStart = gasleft();
    
    vm.prank(alice);
    dao.createProposal("Title", "Desc", 3);
    
    // Calcula gas usado
    uint gasUsed = gasStart - gasleft();
    
    console.log("Gas used:", gasUsed);
    // Output: Gas used: 94567
}

// No terminal:
// forge test testGasCreateProposal -vv
```

---

## 📊 Relatório de Gas da Sua App

```bash
forge test --gas-report

# Output:
# ┌─────────────────────┬─────────┬──────────┬─────────┐
# │ Function            │ Min     │ Max      │ Avg Avg │
# ├─────────────────────┼─────────┼──────────┼─────────┤
# │ createProposal      │ 89,234  │ 102,567  │ 95,900  │
# │ vote                │ 73,456  │ 80,123   │ 76,789  │
# │ executeProposal     │ 45,678  │ 52,345   │ 48,901  │
# │ transfer            │ 45,000  │ 65,000   │ 52,500  │
# └─────────────────────┴─────────┴──────────┴─────────┘
```

---

## 🚫 Armadilhas Comuns

```solidity
// ❌ Armadilha 1: Strings grandes são caras
string memory veryLongDescription = "...1000 caracteres...";
// Cada char armazena, é caro!

// ✅ Solução: Limite tamanho ou use hash
bytes32 descHash = keccak256(abi.encodePacked(description));

// ❌ Armadilha 2: Nested loops
for (uint i; i < 100; i++) {
    for (uint j; j < 100; j++) {
        totalSupply += 1;  // 10.000 SLOADs!
    }
}

// ✅ Solução: Cache
uint supply = totalSupply;
for (uint i; i < 100; i++) {
    for (uint j; j < 100; j++) {
        supply += 1;
    }
}
totalSupply = supply;

// ❌ Armadilha 3: Usar memory para grandes strings
function process(string memory data) {
    // data é copiado para memory (caro!)
}

// ✅ Solução: Use calldata (se puder)
function process(string calldata data) {
    // data fica na calldata (mais barato)
}
```

---

## 📈 Próximas Leituras

- **Integração Frontend**: [16 - Integração Frontend](./16-integracao-frontend.md)
- **FAQ**: [17 - FAQ](./17-faq.md)
- **Recursos**: [19 - Links Úteis](./19-links-uteis.md)

---

**Resumo**: Gas = $$$. Packing de variáveis, memory vs storage, cache de funções. Pequenas mudanças = grande economia!
