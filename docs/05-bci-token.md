# 05 - BCIToken Explicado 💰

**Leitura: 15 minutos**

## O que é BCIToken?

BCIToken é um **token ERC20** que funciona como:
- 🎫 Ticket de entrada da DAO
- 🗳️ Direito de voto
- 💎 Prova de participação

---

## 📋 Visão Geral do Contrato

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BCIToken is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 10000 * 10**18; // 10.000 tokens
    
    constructor(address initialOwner) 
        ERC20("Blockchain Insper", "BCI") 
        Ownable(initialOwner) 
    {
        _mint(initialOwner, INITIAL_SUPPLY);
    }
    
    // ... funções ...
}
```

**Herança**:
- **ERC20**: Padrão de token (transfer, approve, etc)
- **Ownable**: Controle de acesso (owner pode fazer coisas)

---

## 🔧 Funções Principais

### 1. `balanceOf(address account)` - Consultar Saldo

```solidity
// Função herdada de ERC20 - NÃO CUSTA GAS
function balanceOf(address account) external view returns (uint256)
```

**Uso Prático**:
```javascript
// Frontend (React)
const balance = await bciToken.balanceOf("0x123...abc");
console.log(balance);  // "100000000000000000000" (100 BCI, com 18 decimais)
console.log(formatUnits(balance, 18));  // "100.0" (formatado)
```

**Quando é chamado**:
- ✅ Frontend verifica se usuário pode criar proposta (>= 100 BCI)
- ✅ Frontend mostra saldo na tela
- ✅ DAOVoting valida direito de voto

### 2. `transfer(address to, uint256 amount)` - Enviar Tokens

```solidity
function transfer(address to, uint256 amount) 
    external 
    returns (bool) 
{
    _transfer(msg.sender, to, amount);
    emit Transfer(msg.sender, to, amount);
    return true;
}
```

**Custa**: ~65.000 gas

**Uso Prático**:
```javascript
// Alice envia 50 BCI para Bob
const tx = await bciToken.transfer(
    "0x456...def",      // Bob's address
    parseUnits("50", 18) // 50 BCI
);
await tx.wait();  // Espera confirmação
```

**Diagrama**:
```
Alice (1000 BCI)
    ├─ -50 BCI
    └─ 950 BCI

Bob (100 BCI)
    ├─ +50 BCI
    └─ 150 BCI

Total: sempre 1000 (conservado!)
```

### 3. `mint(address to, uint256 amount)` - Criar Tokens

```solidity
function mint(address to, uint256 amount) external onlyOwner {
    _mint(to, amount);
}
```

**Requer**: Ser owner (ou admin)
**Custa**: ~50.000 gas

**Uso Prático**:
```javascript
// Admin cria 500 BCI novos para Carol
await bciToken.mint("0x789...xyz", parseUnits("500", 18));
// Carol agora tem +500 BCI
// Total supply aumenta de 10.000 para 10.500
```

**Quando usado**:
- ✅ Na distribuição inicial (Setup)
- ✅ Admin distribui para novos membros
- ✅ Testes e desenvolvimento

### 4. `burn(uint256 amount)` - Destruir Tokens

```solidity
function burn(uint256 amount) external onlyOwner {
    _burn(msg.sender, amount);
}
```

**Requer**: Ser owner
**Custa**: ~50.000 gas

**Uso Prático**:
```javascript
// Admin queima 100 BCI próprios para reduzir supply
await bciToken.burn(parseUnits("100", 18));
// Total supply cai de 10.000 para 9.900
```

**Por que usar?**
- Deflationary token (diminui supply = cada token vale mais)
- Remove tokens comprometidos
- Controlar inflação

### 5. `approve(address spender, uint256 amount)` - Autorizar Gasto

```solidity
function approve(address spender, uint256 amount) 
    external 
    returns (bool) 
{
    _approve(msg.sender, spender, amount);
    emit Approval(msg.sender, spender, amount);
    return true;
}
```

**Uso**: Autorizar outro contrato usar seus tokens

```javascript
// Alice autoriza DAOVoting usar seus BCI para votar
await bciToken.approve(
    "0xDAOVoting...address",  // DAOVoting smartcontract
    parseUnits("1000", 18)      // até 1000 BCI
);
```

**Retorno**:
```javascript
// DAOVoting pode agora chamar:
// transferFrom(Alice, DAO, valor) até 1000 BCI
```

### 6. `distributeTokens(address[] recipients, uint256[] amounts)` - Distribuição em Massa

```solidity
function distributeTokens(
    address[] calldata recipients, 
    uint256[] calldata amounts
) external onlyOwner {
    require(recipients.length == amounts.length, "Length mismatch");
    
    for (uint256 i = 0; i < recipients.length; i++) {
        require(recipients[i] != address(0), "Invalid recipient");
        require(amounts[i] > 0, "Amount must be > 0");
        _mint(recipients[i], amounts[i]);
    }
}
```

**Requer**: Ser owner
**Custa**: ~50.000 + 40.000 por pessoa

**Uso Prático** (via Frontend Admin):
```
Recipients:
1. 0x123...abc → 100 BCI
2. 0x456...def → 250 BCI
3. 0x789...xyz → 150 BCI

Total: 500 BCI novos criados
```

---

## 📊 Estrutura de Dados

### Balances (Saldos)

```solidity
mapping(address => uint256) balances;
```

```
Interno (não vê):
balances[0x123...abc] = 100000000000000000000  // 100 BCI
balances[0x456...def] = 500000000000000000000  // 500 BCI

Frontend vê (formatado):
Alice: 100 BCI
Bob: 500 BCI
```

### Allowances (Autorizações)

```solidity
mapping(address => mapping(address => uint256)) allowances;
```

```
allowances[Alice][DAOVoting] = 1000 BCI
// Alice autoriza DAOVoting usar até 1000 BCI dela

allowances[Alice][Other] = 100 BCI
// Alice autoriza Other usar até 100 BCI dela
```

---

## 🎯 Fluxo: Como Funciona na Prática

### Cenário: Alice quer votar

```
PASSO 1: Distribuição
┌────────────────────────────────┐
│ Admin UI → clica "Distribuir"  │
│ Escolhe Alice (0x123...abc)    │
│ Quantidade: 100 BCI            │
└───────────┬────────────────────┘
            │
            ▼
    ┌──────────────────┐
    │ bciToken.mint()  │
    │ to: Alice        │
    │ amount: 100 BCI  │
    └────────┬─────────┘
             │
             ▼
    ┌────────────────────────────┐
    │  Alice agora tem 100 BCI   │
    │  balances[Alice] = 100     │
    └────────────────────────────┘

PASSO 2: Verificação
┌────────────────────────────────┐
│ Alice clica "Criar Proposta"   │
└───────────┬────────────────────┘
            │
            ▼
    ┌────────────────────────────┐
    │ Frontend verifica:          │
    │ bciToken.balanceOf(Alice)  │
    │ = 100 (>= 100 min)         │
    │ ✅ OK!                     │
    └────────┬───────────────────┘
             │
             ▼
    ┌────────────────────────────┐
    │ Frontend mostra:           │
    │ ✅ Você pode criar         │
    │ (tem 100 BCI)              │
    └────────────────────────────┘

PASSO 3: Votação
┌──────────────────────────────────┐
│ Alice vota SIM em proposta #1    │
└────────────────────┬─────────────┘
                     │
                     ▼
        ┌──────────────────────────┐
        │ DAOVoting.castVote()     │
        │ Verifica:                │
        │ bciToken.balanceOf()>0   │
        │ ✅ OK!                   │
        └────────────┬─────────────┘
                     │
                     ▼
        ┌──────────────────────────┐
        │ Voto registrado!         │
        │ Alice: 100 votos         │
        │ (100 BCI = 100 poder)    │
        └──────────────────────────┘
```

---

## 🔐 Segurança

### O que Não Pode Fazer

```javascript
// ❌ Não pode mudar como tokens funcionam
bciToken.transfer = function() { ... }  // Erro!

// ❌ Não pode congelar tokens de alguém
bciToken.balances[Alice] = 0;  // Impossível (privado)

// ❌ Não pode falsificar assinatura
bciToken.transferFrom(Alice, Eve, 1000);  // Vai falhar (sem auth)

// ✅ TUDO IMUTÁVEL E VERIFICÁVEL
```

### ERC20 Safety (OpenZeppelin)

Usa biblioteca confiável que previne:
- Overflow/underflow (versões antigas)
- Reentrância
- Problemas de aprovação
- Etc

---

## 📊 Exemplo Completo de Uso

### Setup Inicial

```javascript
// 1. Deploy contrato (já feito)
const bciToken = new ethers.Contract(
    "0x0FCE6ecA806E93cF683bB807E56Cec74Ed87f9f7",
    BCI_TOKEN_ABI,
    signer
);

// 2. Admin distribui para 3 membros
const recipients = [
    "0x123...alice",
    "0x456...bob",
    "0x789...carol"
];
const amounts = [
    ethers.parseUnits("100", 18),   // Alice
    ethers.parseUnits("250", 18),   // Bob
    ethers.parseUnits("150", 18)    // Carol
];

const tx = await bciToken.distributeTokens(recipients, amounts);
await tx.wait();
// ✅ 3 membros têm tokens!
```

### Verificar Saldos

```javascript
// Alice verifica seu saldo
const aliceBalance = await bciToken.balanceOf("0x123...alice");
console.log(ethers.formatUnits(aliceBalance, 18));  // "100.0"

// Verificar total de tokens em circulação
const totalSupply = await bciToken.totalSupply();
console.log(ethers.formatUnits(totalSupply, 18));   // "10500.0"
```

### Transferência Entre Usuários

```javascript
// Bob envia 25 BCI para Carol
const tx = await bciToken.transfer(
    "0x789...carol",
    ethers.parseUnits("25", 18)
);
await tx.wait();

// Resultado:
// Bob: 250 - 25 = 225 BCI
// Carol: 150 + 25 = 175 BCI
```

---

## 🎓 Próximas Leituras

- **Usar com DAOVoting**: [06 - DAOVoting](./06-dao-voting.md)
- **Funções específicas**: [11 - Funções BCIToken](./11-funcoes-bci-token.md)
- **Events**: [13 - Events & Logs](./13-events-logs.md)

---

**Resumo**:
- BCIToken = Token ERC20 que controla acesso à votação
- Qualquer um com BCI pode votar
- Admin distribui tokens
- Impossível falsificar ou roubar
