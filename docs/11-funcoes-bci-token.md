# 11 - Referência de Funções: BCIToken 📚

**Leitura: 10 minutos**

---

## 📋 Visão Geral

```
BCIToken = Token ERC20 padrão
├─ Total supply inicial: 10.000 BCI
├─ Decimais: 18
├─ Transferível: Sim
└─ Queimável: Sim (apenas owner)
```

---

## 🔧 Funções Principais

### 1️⃣ `balanceOf(address account) → uint256`

**O que faz**: Retorna quantidade de tokens que alguém tem

**Parâmetros**:
| Param | Tipo | Descrição |
|-------|------|-----------|
| `account` | address | Endereço da pessoa |

**Retorno**:
| Tipo | Descrição |
|------|-----------|
| uint256 | Saldo em wei (com 18 decimais) |

**Exemplo**:
```solidity
// Quanto alice tem?
uint256 saldo = bciToken.balanceOf(alice);
// Retorno: 100000000000000000000 (100 tokens com 18 decimais)

// Frontend:
import { ethers } from 'ethers';
const balance = await bciToken.balanceOf(address);
const formatted = ethers.utils.formatUnits(balance, 18);
console.log(`Você tem ${formatted} BCI`);
// Output: Você tem 100.0 BCI
```

**Gas**: ~600 (leitura, sem custo)

---

### 2️⃣ `transfer(address to, uint256 amount) → bool`

**O que faz**: Transfere tokens para outro endereço

**Parâmetros**:
| Param | Tipo | Descrição |
|-------|------|-----------|
| `to` | address | Destinatário |
| `amount` | uint256 | Quantidade em wei |

**Retorno**:
| Tipo | Descrição |
|------|-----------|
| bool | true se sucesso, revert se falhe |

**Exemplo**:
```solidity
// Alice envia 50 tokens para Bob
bciToken.transfer(bob, 50e18);

// Frontend:
const tx = await bciToken.transfer(
    '0x789...',  // endereço destino
    ethers.utils.parseUnits('50', 18)  // 50 BCI
);
await tx.wait();  // Aguarda confirmação
console.log('✅ Transferência feita!');
```

**Validações**:
```
✅ Se tem saldo suficiente: sucesso
❌ Se saldo < amount: revert ("ERC20: insufficient balance")
❌ Se to = address(0): revert ("ERC20: transfer to zero address")
```

**Gas**: ~52.000

**Emite evento**: `Transfer(from, to, amount)`

---

### 3️⃣ `approve(address spender, uint256 amount) → bool`

**O que faz**: Permite que alguém GASTE seus tokens (não transfere ainda!)

**Parâmetros**:
| Param | Tipo | Descrição |
|-------|------|-----------|
| `spender` | address | Quem pode gastar |
| `amount` | uint256 | Quanto pode gastar |

**Retorno**:
| Tipo | Descrição |
|------|-----------|
| bool | true se sucesso |

**Exemplo**:
```solidity
// Alice autoriza Bob a gastar 100 tokens dela
bciToken.approve(bob, 100e18);

// Frontend (na carteira de Alice):
const tx = await bciToken.approve(
    '0x789...',  // endereço de Bob
    ethers.utils.parseUnits('100', 18)
);
await tx.wait();
console.log('✅ Bob pode gastar 100 BCI seus!');

// Depois Bob pode fazer:
// await bciToken.transferFrom(alice, bob, 100e18);
// (transfere os tokens de alice para bob)
```

**Casos de Uso**:
```
1. Alice quer que contrato X gaste 100 BCI dela
   bciToken.approve(contratX, 100e18);
   
2. Alice quer que Bob custeie algo por ela
   bciToken.approve(bob, 1000e18);
   bob.doSomethingWithMyTokens();
```

**Gas**: ~46.000

**Emite evento**: `Approval(owner, spender, amount)`

---

### 4️⃣ `transferFrom(address from, address to, uint256 amount) → bool`

**O que faz**: Transfere tokens DE alguém que autorizou (precisa de approve primeiro!)

**Parâmetros**:
| Param | Tipo | Descrição |
|-------|------|-----------|
| `from` | address | De quem vem o token |
| `to` | address | Para quem vai |
| `amount` | uint256 | Quantidade em wei |

**Retorno**:
| Tipo | Descrição |
|------|-----------|
| bool | true se sucesso |

**Exemplo**:
```solidity
// Cenário: Bob quer gastar os tokens de Alice

// 1. Alice autoriza Bob
bciToken.approve(bob, 100e18);

// 2. Bob transfere (chamado por Bob)
vm.prank(bob);
bciToken.transferFrom(alice, bob, 50e18);

// Frontend (Bob pegando 50 BCI de Alice):
const tx = await bciToken.transferFrom(
    '0x123...',  // endereço de Alice
    '0x789...',  // endereço de Bob (ou outro)
    ethers.utils.parseUnits('50', 18)
);
await tx.wait();
```

**Validações**:
```
✅ Se Alice autorizou Bob e tem saldo: sucesso
❌ Se Bob não foi autorizado: revert ("ERC20: insufficient allowance")
❌ Se Alice não tem saldo: revert ("ERC20: insufficient balance")
```

**Gas**: ~67.000

**Emite evento**: `Transfer(from, to, amount)`

---

### 5️⃣ `allowance(address owner, address spender) → uint256`

**O que faz**: Verifica quanto alguém autorizou outra pessoa gastar

**Parâmetros**:
| Param | Tipo | Descrição |
|-------|------|-----------|
| `owner` | address | Dono dos tokens |
| `spender` | address | Quem pode gastar |

**Retorno**:
| Tipo | Descrição |
|------|-----------|
| uint256 | Quanto spender ainda pode gastar |

**Exemplo**:
```solidity
// Alice autorizou Bob para 100 tokens
bciToken.approve(bob, 100e18);

// Verificar quanto Bob pode gastar
uint256 permitido = bciToken.allowance(alice, bob);
// Retorno: 100000000000000000000 (100 BCI)

// Bob gasta 50
bciToken.transferFrom(alice, bob, 50e18);

// Verificar novamente
permitido = bciToken.allowance(alice, bob);
// Retorno: 50000000000000000000 (50 BCI restantes)

// Frontend:
const allowed = await bciToken.allowance(
    '0x123...', // alice
    '0x789...'  // bob
);
console.log('Bob pode gastar:', ethers.utils.formatUnits(allowed, 18), 'BCI');
```

**Gas**: ~1.000 (leitura, grátis)

---

### 6️⃣ `totalSupply() → uint256`

**O que faz**: Retorna quantidade TOTAL de tokens criados

**Parâmetros**: Nenhum

**Retorno**:
| Tipo | Descrição |
|------|-----------|
| uint256 | Total em wei |

**Exemplo**:
```solidity
uint256 total = bciToken.totalSupply();
// Retorno inicial: 10000000000000000000000 (10.000 BCI com 18 decimais)

// Frontend:
const total = await bciToken.totalSupply();
const formatted = ethers.utils.formatUnits(total, 18);
console.log(`Total BCI em circulação: ${formatted}`);
// Output inicial: Total BCI em circulação: 10000.0
```

**Nota**: O total supply inicia em 10.000, mas pode variar se o owner usar `mint` ou `burn`.

**Gas**: ~1.000 (leitura, grátis)

---

## 📊 Tabela Rápida

| Função | O Quê | Custo | Autorização |
|--------|-------|-------|-------------|
| `balanceOf` | Ver saldo | grátis | - |
| `transfer` | Enviar seus tokens | ~52k | próprios |
| `approve` | Autorizar alguém | ~46k | próprios |
| `transferFrom` | Gastar autorizado | ~67k | autorizado |
| `allowance` | Ver autorização | grátis | - |
| `totalSupply` | Total criado | grátis | - |

---

## 🔄 Fluxo Típico: Transferência

```
┌─────────────────────────────────────────┐
│ Cenário: Alice envia 50 BCI para Bob    │
└─────────────────────────────────────────┘

Opção 1: Transfer Direto (Alice é sender)
├─ Alice: bciToken.transfer(bob, 50e18)
├─ Validação: alice tem >= 50?
├─ Ação: move 50 de alice para bob
├─ Evento: Transfer(alice, bob, 50e18)
└─ ✅ Pronto!

Opção 2: Approve + TransferFrom (Bob é sender)
├─ Alice: bciToken.approve(bob, 50e18)
├─ Evento: Approval(alice, bob, 50e18)
├─ Bob: bciToken.transferFrom(alice, bob, 50e18)
├─ Validação: alice autorizou? alice tem saldo?
├─ Ação: move 50 de alice para bob
├─ Evento: Transfer(alice, bob, 50e18)
└─ ✅ Pronto!

Quando usar cada uma?
├─ transfer: você envia (simples)
└─ approve+transferFrom: contrato faz por você
```

---

## 📝 Padrão: Aprovar e Fazer Algo

```solidity
// Exemplo: Comprar algo em um marketplace

// 1. Owner aprova contrato marketplace
token.approve(address(marketplace), 100e18);

// 2. Marketplace tira tokens e envia produto
marketplace.buyItem(productId, 100e18);
    // Internamente:
    // token.transferFrom(msg.sender, marketplace, 100e18);
    // sendProduct(msg.sender, productId);
```

---

## 🚨 Segurança: ATAQUES Possíveis

### ❌ Double Spending (não é possível)
```
Alice tem 100 BCI
Alice envia 100 para Bob
Alice tenta enviar 100 para Charlie
    → Falha: insufficient balance
```

### ❌ Aproval Front-Running
```
Cenário PERIGOSO:
1. Alice aprovação Bob para 100
2. Alice vê Bob aprovação abusiva
3. Alice tenta reduzir para 50
4. Ordem pode ficar:
   a) Bob tira 100 (antigos)
   b) Alice reduz para 50 (novo)
   c) Bob tira 50 MORE (novo allowance!)
   
Solução: Use increaseAllowance/decreaseAllowance
```

---

## 💻 Exemplo Frontend Completo

```javascript
import { ethers } from 'ethers';
import BCIToken_ABI from './abis/BCIToken.json';

async function tokenOperations() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const token = new ethers.Contract(
        ADDRESS_BCI_TOKEN,
        BCIToken_ABI,
        signer
    );

    // 1. Ver saldo
    const myBalance = await token.balanceOf(await signer.getAddress());
    console.log('Meu saldo:', ethers.utils.formatUnits(myBalance, 18), 'BCI');

    // 2. Transferir
    const tx1 = await token.transfer(
        '0x789...',
        ethers.utils.parseUnits('50', 18)
    );
    await tx1.wait();
    console.log('✅ Enviado 50 BCI');

    // 3. Aprovar
    const tx2 = await token.approve(
        ADDRESS_DAO_VOTING,
        ethers.utils.parseUnits('100', 18)
    );
    await tx2.wait();
    console.log('✅ Aprovado para DAO usar 100 BCI');

    // 4. Checar allowance
    const allowed = await token.allowance(
        await signer.getAddress(),
        ADDRESS_DAO_VOTING
    );
    console.log('DAO pode usar:', ethers.utils.formatUnits(allowed, 18), 'BCI');
}
```

---

## 🎓 Teste Unitário

```solidity
function testBCITokenFunctions() public {
    // Usuários
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    // 1. Check initial supply
    assertEq(token.totalSupply(), 10_000e18);

    // 2. Owner tem tudo
    assertEq(token.balanceOf(address(this)), 10_000e18);

    // 3. Transfer
    token.transfer(alice, 100e18);
    assertEq(token.balanceOf(alice), 100e18);

    // 4. Approve
    vm.prank(alice);
    token.approve(bob, 50e18);
    assertEq(token.allowance(alice, bob), 50e18);

    // 5. TransferFrom
    vm.prank(bob);
    token.transferFrom(alice, bob, 50e18);
    assertEq(token.balanceOf(bob), 50e18);
    assertEq(token.balanceOf(alice), 50e18);
    assertEq(token.allowance(alice, bob), 0);  // zerou!
}
```

---

## 📈 Próximas Leituras

- **Funções DAO**: [12 - Funções DAOVoting](./12-funcoes-dao-voting.md)
- **Events**: [13 - Events e Logs](./13-events-logs.md)
- **Testes**: [10 - Testando Contratos](./10-testando-contratos.md)

---

**Resumo**: BCIToken = 6 funções simples. Transfer move tokens direto. Approve + TransferFrom permite que contratos usem seus tokens!
