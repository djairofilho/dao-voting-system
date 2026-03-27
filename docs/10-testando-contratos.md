# 10 - Testando Smart Contracts ✅

**Leitura: 13 minutos**

---

## 📋 Por Que Testar?

```
Blockchain = Permanente
├─ Não pode consertar bugs depois
├─ Perda de dinheiro = real
└─ Então testa ANTES

Teste = Prevenir desastres
├─ Validar lógica
├─ Verificar edge cases
└─ Proteger usuários
```

---

## 🛠️ Setup: Forge Test

Já vem instalado com Foundry!

```bash
cd contracts

# Estrutura de teste
contracts/
├─ src/
│  ├─ BCIToken.sol
│  └─ DAOVoting.sol
└─ test/
   ├─ BCIToken.t.sol
   └─ DAOVoting.t.sol
```

---

## 📝 Exemplo 1: Testar BCIToken

### Abrir: contracts/test/BCIToken.t.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/BCIToken.sol";

contract BCITokenTest is Test {
    BCIToken token;
    address owner;
    address alice;
    address bob;

    // Setup é rodado antes de cada teste
    function setUp() public {
        owner = address(this);
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        
        token = new BCIToken(address(this));
    }

    // Teste 1: Verifica supply inicial
    function testInitialSupply() public {
        assertEq(token.totalSupply(), 10_000e18);
    }

    // Teste 2: Verifica balance do owner
    function testOwnerBalance() public {
        assertEq(token.balanceOf(owner), 10_000e18);
    }

    // Teste 3: Transferência básica
    function testTransfer() public {
        token.transfer(alice, 100e18);
        assertEq(token.balanceOf(alice), 100e18);
        assertEq(token.balanceOf(owner), 10_000e18 - 100e18);
    }

    // Teste 4: Transferência com approve
    function testApproveAndTransferFrom() public {
        token.approve(alice, 500e18);
        assertEq(token.allowance(owner, alice), 500e18);

        vm.prank(alice);  // Simula chamada de alice
        token.transferFrom(owner, alice, 200e18);
        
        assertEq(token.balanceOf(alice), 200e18);
        assertEq(token.allowance(owner, alice), 300e18);
    }

    // Teste 5: Rejeita transferência sem saldo
    function testTransferFailsInsufficientBalance() public {
        vm.prank(alice);
        vm.expectRevert();
        token.transfer(bob, 100e18);
    }
}
```

### Executar Testes

```bash
cd contracts

# Rodas todos os testes
forge test

# Output:
> Running 5 tests for test/BCIToken.t.sol:BCITokenTest
> [PASS] testInitialSupply
> [PASS] testOwnerBalance
> [PASS] testTransfer
> [PASS] testApproveAndTransferFrom
> [PASS] testTransferFailsInsufficientBalance
>
> Test result: ok. 5 passed
```

### Ver Testes com Detalhes

```bash
# Verbose
forge test -vv

# Muito verbose (mostra cada operação)
forge test -vvv

# Apenas teste específico
forge test --match testTransfer
```

---

## 🎯 Exemplo 2: Testar DAOVoting

### Arquivo: contracts/test/DAOVoting.t.sol

```solidity
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/BCIToken.sol";
import "../src/DAOVoting.sol";

contract DAOVotingTest is Test {
    BCIToken token;
    DAOVoting dao;
    
    address owner;
    address alice;
    address bob;

    function setUp() public {
        owner = address(this);
        alice = makeAddr("alice");
        bob = makeAddr("bob");

        // Deploy token
        token = new BCIToken(address(this));
        
        // Deploy DAO com token
        dao = new DAOVoting(address(token), address(this));

        // Distribui tokens
        token.transfer(alice, 100e18);
        token.transfer(bob, 50e18);
    }

    // Teste 1: Criar proposta com tokens suficientes
    function testCreateProposalSuccess() public {
        vm.prank(alice);  // Alice cria
        
        dao.createProposal(
            "Aumentar budget",
            "Aumentar de 2% para 7%",
            1  // 1 dia votação
        );

        assertEq(dao.getTotalProposals(), 1);
    }

    // Teste 2: Falha sem tokens suficientes
    function testCreateProposalFailsNoTokens() public {
        vm.prank(address(0x999));  // Address sem tokens
        vm.expectRevert();
        
        dao.createProposal(
            "Aumentar budget",
            "Aumentar de 2% para 7%",
            1
        );
    }

    // Teste 3: Votar em proposta
    function testVote() public {
        // Alice cria
        vm.prank(alice);
        dao.createProposal("Test", "Test", 1);

        // Bob vota SIM
        vm.prank(bob);
        dao.castVote(1, true);  // proposalId=1, vote=true (SIM)

        // Verifica voto
        (,,, uint yesVotes, uint noVotes,,) = dao.proposals(1);
        assertEq(yesVotes, 50e18);  // Bob tem 50 tokens
        assertEq(noVotes, 0);
    }

    // Teste 4: Não pode votar 2x
    function testCantVoteTwice() public {
        vm.prank(alice);
        dao.createProposal("Test", "Test", 1);

        vm.prank(bob);
        dao.castVote(1, true);

        vm.expectRevert();
        vm.prank(bob);
        dao.castVote(1, true);  // Tenta votar de novo!
    }

    // Teste 5: Executar proposta após votação
    function testExecuteProposal() public {
        vm.prank(alice);
        dao.createProposal("Test", "Test", 1);

        // Vota
        vm.prank(bob);
        dao.castVote(1, true);

        // Avança tempo 1 dia + 1 segundo
        vm.warp(block.timestamp + 1 days + 1 seconds);

        // Executa
        dao.executeProposal(1);

        (,,,, uint executed,,) = dao.proposals(1);
        assertTrue(executed);
    }
}
```

---

## 🧪 Funções de Teste Mais Usadas

### Assertions (Verificações)

```solidity
// Igualdade
assertEq(a, b);        // a == b?
assertEq(a, b, "msg"); // com mensagem

// Booleanos
assertTrue(condition);
assertFalse(condition);

// Comparações
assertLt(a, b);   // a < b?
assertGt(a, b);   // a > b?
assertLte(a, b);  // a <= b?
assertGte(a, b);  // a >= b?

// Endereços
assertEq(addr1, addr2);
```

### Simulação (VM Cheat Codes)

```solidity
// Simular chamadas de outro endereço
vm.prank(alice);
token.transfer(bob, 100);  // "chamada por alice"

// Avançar tempo
vm.warp(block.timestamp + 7 days);

// Minerar bloco
vm.roll(block.number + 5);

// Prank multiple calls
vm.startPrank(alice);
    token.transfer(bob, 50);
    token.approve(bob, 100);
vm.stopPrank();

// Expect revert
vm.expectRevert();
token.transfer(address(0x0), 100);  // vai falhar
```

### Criação de Endereços

```solidity
// Criar endereço fake
address alice = makeAddr("alice");

// Criar com label
address bob = makeAddr("bob");
vm.label(bob, "Bob");  // para logs
```

---

## 🎯 Testes de Gas

Quanto custa cada operação?

```solidity
function testGasCreateProposal() public {
    vm.prank(alice);
    
    // --startMeasure--
    dao.createProposal(
        "Test",
        "Test",
        1
    );
    // --stopMeasure--
    
    // Output:
    // Gas used: 89_234
}
```

Rodar com:
```bash
forge test -vv --gas-report

# Output:
# ┌─────────────────────┬─────────┬───────┬─────────┐
# │ Function            │ Min     │ Max   │ Avg     │
# ├─────────────────────┼─────────┼───────┼─────────┤
# │ createProposal      │ 89,234  │ 98k   │ 94,000  │
# │ vote                │ 67,890  │ 78k   │ 73,000  │
# │ executeProposal     │ 45,123  │ 52k   │ 48,000  │
# └─────────────────────┴─────────┴───────┴─────────┘
```

---

## 🏗️ Estrutura de Teste Completa

```solidity
contract TestStructure is Test {
    // 1. Variáveis necessárias
    BCIToken token;
    DAOVoting dao;
    address alice;

    // 2. Setup (rodado antes de CADA teste)
    function setUp() public {
        alice = makeAddr("alice");
        token = new BCIToken(address(this));
        dao = new DAOVoting(address(token), address(this));
        token.transfer(alice, 100e18);
    }

    // 3. Testes (nomes começam com "test")
    function testSomething() public {
        // Arrange: prepare dados
        vm.prank(alice);
        
        // Act: execute ação
        dao.createProposal("X", "Y", 1);
        
        // Assert: verifica resultado
        assertEq(dao.getTotalProposals(), 1);
    }

    // 4. Testes devem ser independentes
    // testA e testB não se interferem!
    function testA() public { /* ... */ }
    function testB() public { /* ... */ }
    // setUp() roda antes de testA E antes de testB
}
```

---

## 🐛 Debugging Testes

### Quando Falha

```bash
forge test -vvv

# Output com detalhe:
> [FAIL. Reason: assertion failed]
> testVote()
>   AssertionError: a == b not satisfied
>     Expected: 100000000000000000000
>     Actual: 50000000000000000000

# Dica: use console.log!
```

### Adicionar Logs

```solidity
import "forge-std/console.sol";

function testVote() public {
    vm.prank(bob);
    dao.castVote(1, true);

    (,,,, uint yesVotes, uint noVotes,,) = dao.proposals(1);
    
    console.log("Yes votes:", yesVotes);
    console.log("No votes:", noVotes);
    console.log("Bob balance:", token.balanceOf(bob));
    
    assertEq(yesVotes, 50e18);
}
```

Rodar com `-vv` para ver outputs:
```bash
forge test testVote -vv

# Output:
# Yes votes: 50000000000000000000
# No votes: 0
# Bob balance: 50000000000000000000
```

---

## 📊 Rodando Todos os Testes

```bash
# Rodar tudo
forge test

# Rodar um arquivo específico
forge test --match-path "test/BCIToken.t.sol"

# Rodar um teste específico
forge test --match-contract BCITokenTest

# Rodar com padrão
forge test --match "testTransfer*"

# Watch mode (rerun ao salvar arquivo)
forge test --watch
```

---

## ✅ Checklist: Bom Teste

```
□ Nome descritivo (testCriaProposta)
□ Arrange-Act-Assert pattern
□ Testa1 coisa por teste
□ Sem dependências entre testes
□ Testa sucesso E falha
□ Valida edge cases
□ Usa console.log para debug
□ Gas report checado
```

---

## 🎓 Exemplo Completo: Teste a Teste

### Cenário: Votação com 3 participantes

```solidity
contract FullVotingTest is Test {
    BCIToken token;
    DAOVoting dao;
    
    address alice;
    address bob;
    address charlie;

    function setUp() public {
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        charlie = makeAddr("charlie");

        token = new BCIToken(address(this));
        dao = new DAOVoting(address(token), address(this));

        // Distribui tokens
        token.transfer(alice, 1000e18);
        token.transfer(bob, 500e18);
        token.transfer(charlie, 250e18);
    }

    function testFullVotingFlow() public {
        // 1. Alice cria proposta
        vm.prank(alice);
        dao.createProposal(
            "Budget increase",
            "Aumentar budget",
            2  // 2 dias votação
        );
        assertEq(dao.getTotalProposals(), 1);

        // 2. Bob vota SIM
        vm.prank(bob);
        dao.castVote(1, true);
        
        // 3. Charlie vota NÃO
        vm.prank(charlie);
        dao.castVote(1, false);

        // 4. Verificar votos ANTES de expirar
        (,,,, uint yes1, uint no1,,) = dao.proposals(1);
        assertEq(yes1, 500e18);   // Bob: 500
        assertEq(no1, 250e18);    // Charlie: 250

        // 5. Avançar 2 dias
        vm.warp(block.timestamp + 2 days + 1 seconds);

        // 6. Executar proposta
        dao.executeProposal(1);

        // 7. Verificar resultado
        (,,,, uint yesFinal, uint noFinal, bool executed,) = dao.proposals(1);
        assertTrue(executed);
        assertTrue(yesFinal > noFinal);  // SIM ganhou
    }
}
```

Rodar:
```bash
forge test testFullVotingFlow -vv

# Output:
# [PASS] testFullVotingFlow
# Gas used: 345,234
```

---

## 🚨 Testes de Edge Cases

```solidity
// Edge case 1: Votação com 0 votos
function testExecuteWithNoVotes() public {
    vm.prank(alice);
    dao.createProposal("Test", "Test", 1);
    
    vm.warp(block.timestamp + 2 days);
    
    // Deve executar mas com 0 votos
    dao.executeProposal(1);
    
    (,,,,,, bool executed,) = dao.proposals(1);
    assertTrue(executed);
}

// Edge case 2: Votação muito curta (1 segundo)
function testMinVotingPeriod() public {
    vm.prank(alice);
    dao.createProposal("Test", "Test", 0);  // mínimo
    
    vm.warp(block.timestamp + 1 seconds);
    dao.executeProposal(1);
}

// Edge case 3: Transferência durante votação
function testTransferDuringVoting() public {
    vm.prank(alice);
    dao.createProposal("Test", "Test", 2);
    
    vm.prank(bob);
    dao.castVote(1, true);
    
    // Bob tira seus tokens (não afeta voto já dado!)
    vm.prank(bob);
    token.transfer(alice, token.balanceOf(bob));
    
    assertEq(token.balanceOf(bob), 0);
}
```

---

## 📈 Próximas Leituras

- **Funções BCIToken**: [11 - Funções BCIToken](./11-funcoes-bci-token.md)
- **Funções DAOVoting**: [12 - Funções DAOVoting](./12-funcoes-dao-voting.md)
- **Guia de Deploy**: [09 - Deploy](./09-deploy-contratos.md)

---

**Resumo**: Testes = segurança. Melhor pegar bugs localmente com `forge test` do que no blockchain real onde é caro!
