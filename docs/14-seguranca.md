# 14 - Segurança em Smart Contracts 🔐

**Leitura: 11 minutos**

---

## 📋 Ameaças Comuns

```
Blockchain = Transparente + Imutável
├─ Bugs = Desastre permanente
├─ Roubo = Real
└─ Precisa cuidado extremo
```

---

## 🚨 Vulnerabilidade 1: Reentrancy

### O Problema

```solidity
// ❌ VULNERÁVEL

function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount);
    
    // 1. Envia ETH
    (bool sent, ) = msg.sender.call{value: amount}("");
    require(sent);
    
    // 2. DEPOIS atualiza balanço
    // BUG: Se receptor for contrato, pode chamar withdraw NOVAMENTE!
    balances[msg.sender] -= amount;
}

// Ataque:
// 1. Alice faz withdraw(100)
// 2. Contrato envia 100 para Alice
// 3. Se Alice = contrato malicioso, executa receive()
// 4. receive() chama withdraw(100) NOVAMENTE
// 5. Saldo ainda não foi decrementado!
// 6. Recebe 100 de novo, ad nauseam
// 7. Svala todo o contrato!
```

### A Solução

```solidity
// ✅ SEGURO: Usar Checks-Effects-Interactions

function withdraw(uint amount) public {
    // 1. VERIFICAR (Checks)
    require(balances[msg.sender] >= amount);
    
    // 2. ATUALIZAR (Effects)
    balances[msg.sender] -= amount;
    
    // 3. DEPOIS Interagir (Interactions)
    (bool sent, ) = msg.sender.call{value: amount}("");
    require(sent);
}

// Ou: usar ReentrancyGuard
import "openzeppelin/security/ReentrancyGuard.sol";

contract Safe is ReentrancyGuard {
    function withdraw(uint amount) public nonReentrant {
        // Mesmo com callbacks, não re-entra
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent);
        balances[msg.sender] -= amount;
    }
}
```

---

## 🚨 Vulnerabilidade 2: Integer Overflow/Underflow

### O Problema (Solidity < 0.8)

```solidity
// ❌ SEM PROTEÇÃO (Solidity 0.7)

uint8 balance = 255;  // Máximo de uint8

balance++;  // Result: 0!!! (wraps around)

// Ataque:
// balance - 1 = 254
// balance - 2 = 253
// balance - 255 = 0
// balance - 256 = 255 (wrap!)
```

### A Solução

```solidity
// ✅ Solidity 0.8+ tem proteção automática

uint8 balance = 255;
balance++;  // REVERT! "SafeMath overflow"

// Ou use OpenZeppelin SafeMath (para 0.7):
import "openzeppelin/utils/math/SafeMath.sol";
using SafeMath for uint;

uint balance = 255;
balance = balance.add(1);  // Seguro
```

**Nossa codebase** já usa `pragma solidity ^0.8.19` então está protegida!

---

## 🚨 Vulnerabilidade 3: Access Control (Sem Permissões)

### O Problema

```solidity
// ❌ ABERTO DEMAIS

contract Bank {
    function withdrawAllFunds() public {
        // Qualquer um pode sacar TUDO!
        payable(msg.sender).transfer(address(this).balance);
    }
}
```

### A Solução

```solidity
// ✅ Verificar permissões

import "openzeppelin/access/Ownable.sol";

contract Bank is Ownable {
    function withdrawAllFunds() public onlyOwner {
        // Só o dono pode
        payable(msg.sender).transfer(address(this).balance);
    }
}

// Ou role-based:
mapping(address => bool) isAdmin;

function setAdmin(address user) public onlyOwner {
    isAdmin[user] = true;
}

function withdrawAllFunds() public {
    require(isAdmin[msg.sender], "Not admin");
    payable(msg.sender).transfer(address(this).balance);
}
```

**Nossa codebase**: BCIToken e DAOVoting têm dono (owner). Bom!

---

## 🚨 Vulnerabilidade 4: Logic Bugs (Erros de Lógica)

### Exemplo 1: Votação Incorreta

```solidity
// ❌ BUG: Votação antes de fim

function executeProposal(uint256 propId) public {
    Proposal storage prop = proposals[propId];
    
    // BUG: Não checa se votação expirou!
    require(prop.yesVotes > prop.noVotes);
    
    prop.executed = true;
}

// Ataque: Execute no meio da votação!

// ✅ CORRETO:
function executeProposal(uint256 propId) public {
    Proposal storage prop = proposals[propId];
    
    require(block.timestamp >= prop.deadline, "Voting not ended");
    require(!prop.executed, "Already executed");
    require(prop.yesVotes > prop.noVotes, "Rejected");
    
    prop.executed = true;
}
```

### Exemplo 2: Supply vs Balances

```solidity
// ❌ BUG: Destruir sem atualizar supply

function burnTokens(uint amount) public {
    balances[msg.sender] -= amount;
    // Esqueceu de atualizar totalSupply!
}

// Problema: totalSupply fica inconsistente

// ✅ CORRETO:
function burnTokens(uint amount) public {
    require(balances[msg.sender] >= amount);
    balances[msg.sender] -= amount;
    totalSupply -= amount;
}
```

---

## 🚨 Vulnerabilidade 5: Delegatecall (Muito Perigoso!)

```solidity
// ❌ EXTREMAMENTE PERIGOSO

fallback() external {
    (bool success, ) = address(otherContract).delegatecall(msg.data);
    require(success);
}

// delegatecall = executa código DE OUTRO CONTRATO
// MAS modifica o estado DESTE contrato
// Pode sobreescrever qualquer storage!

// ✅ Use com extremo cuidado
// Ou evite se possível
```

---

## 🛡️ Boas Práticas

### 1️⃣ Checks-Effects-Interactions

```solidity
// Padrão correto sempre:

function doSomething() public {
    // 1. CHECKS: Validar tudo primeiro
    require(condition);
    require(msg.sender == owner);
    
    // 2. EFFECTS: Mudar estado
    balance[msg.sender] -= amount;
    totalSupply -= amount;
    
    // 3. INTERACTIONS: Depois chamar externos
    externalContract.doStuff();
    (bool sent, ) = msg.sender.call{value: amount}("");
}
```

### 2️⃣ Usar Bibliotecas Confiáveis

```solidity
// ✅ Use OpenZeppelin - auditado, confiável

import "openzeppelin/token/ERC20/ERC20.sol";
import "openzeppelin/access/Ownable.sol";
import "openzeppelin/security/ReentrancyGuard.sol";

// ❌ Não reinvente a roda
contract Token {
    // Seu próprio token pode ter bugs!
}
```

### 3️⃣ Validar Inputs

```solidity
// ❌ RUIM
function transfer(address to, uint amount) public {
    balances[msg.sender] -= amount;
    balances[to] += amount;
}

// ✅ BOM
function transfer(address to, uint amount) public {
    require(to != address(0), "No zero address");
    require(amount > 0, "Amount must be positive");
    require(balances[msg.sender] >= amount, "Insufficient balance");
    
    balances[msg.sender] -= amount;
    balances[to] += amount;
    emit Transfer(msg.sender, to, amount);
}
```

### 4️⃣ Testar TUDO

```solidity
// Teste casos bons
function testTransfer() public {
    token.transfer(alice, 100);
    assertEq(token.balanceOf(alice), 100);
}

// Teste casos ruins (edge cases)
function testTransferFailZeroAmount() public {
    vm.expectRevert();
    token.transfer(alice, 0);
}

function testTransferFailInsufficientBalance() public {
    vm.expectRevert();
    token.transfer(alice, 99999999999e18);
}

function testTransferFailZeroAddress() public {
    vm.expectRevert();
    token.transfer(address(0), 100);
}

// Sempre rodar: forge test
```

### 5️⃣ Usar Ferramentas de Análise

```bash
# Slither - análise estática
pip install slither-analyzer
slither contracts/BCIToken.sol

# Saída:
# High: Reentrancy in transfer()
# Medium: Unchecked call
# Etc.

# Mythril - análise de segurança
pip install mythril
myth analyze contracts/BCIToken.sol

# Solidhint - style + segurança
npm install solhint
solhint 'contracts/**/*.sol'
```

---

## 🔍 Auditoria: Checklist de Segurança

```
□ Usar Solidity 0.8+ (overflow protection)
□ Usar Checks-Effects-Interactions
□ Não usar delegatecall (ou muito cuidado)
□ Validar ALL inputs
□ ReentrancyGuard se chamar externos
□ Sem hardcoded addresses
□ Events para ações críticas
□ Ownership correto
□ Testes com 100% coverage
□ Code review por pessoa
□ Rodou slither?
□ Rodou mythril?
```

---

## 🔒 Nosso Sistema: Análise de Risco

### BCIToken

```
✅ Usa OpenZeppelin ERC20 (confiável)
✅ Solidity 0.8.19 (overflow protection)
✅ Supply fixo (1M, não pode mudar)
✅ Só owner pode emitir? (verificar)
❓ Precisa auditoria formal

Recomendações:
- Adicionar pause/unpause (bloquear em emergência)
- Adicionar whitelist (opcional)
```

### DAOVoting

```
✅ Checks-Effects-Interactions implementado
✅ hasVoted mapping previne duplicatas
✅ Deadline validado
✅ Solidity 0.8.19

❌ Ataque possível: Votação antes da deadline
   Solução: Adicionar require(now >= deadline)

Recomendações:
- Adicionar mais testes de edge cases
- Verificar overflow de votação (improvável, mas...)
- Considerar pause/unpause
```

---

## 🧪 Exemplo: Teste de Segurança

```solidity
contract SecurityTests is Test {
    BCIToken token;
    DAOVoting dao;

    // Test 1: Prevent double voting
    function testCantVoteTwice() public {
        vm.prank(voter);
        dao.vote(1, true);
        
        vm.expectRevert("Already voted");
        vm.prank(voter);
        dao.vote(1, true);
    }

    // Test 2: Prevent early execution
    function testCantExecuteEarly() public {
        vm.prank(alice);
        dao.createProposal("Test", "Test", 5);
        
        vm.expectRevert("Voting not ended");
        dao.executeProposal(1);
    }

    // Test 3: Prevent zero address transfer
    function testCantTransferToZero() public {
        vm.expectRevert();
        token.transfer(address(0), 100);
    }

    // Test 4: Prevent overflow (Solidity 0.8 automatic)
    function testNoOverflow() public {
        uint256 max = 2**256 - 1;
        vm.expectRevert();
        token.transfer(alice, max + 1);
    }
}
```

---

## 📚 Resources Segurança

```
Documentação:
├─ OpenZeppelin: https://docs.openzeppelin.com
├─ Secureum: https://secureum.substack.com/ (artigos)
└─ SWC Registry: https://swcregistry.io/ (vulnerabilidades)

Ferramentas:
├─ Slither: Static analysis
├─ Mythril: Symbolic execution
└─ Foundry: Fuzzing built-in

Comunidade:
├─ Ethereum.org Security: ethereum.org/security
└─ Trail of Bits: trailofbits.com/ethereum
```

---

## 📈 Próximas Leituras

- **Gas Optimization**: [15 - Otimizações de Gas](./15-optimizacoes-gas.md)
- **Integração**: [16 - Integração Frontend](./16-integracao-frontend.md)
- **FAQ**: [17 - FAQ](./17-faq.md)

---

**Resumo**: Segurança = paranoia amiiga. Valide tudo, não confie em nada, teste sempre. Bloqckchain é para sempre!
