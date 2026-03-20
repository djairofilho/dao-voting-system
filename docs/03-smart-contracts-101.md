# 03 - Smart Contracts 101 📝

**Leitura: 10 minutos**

## O que é um Smart Contract?

Um **smart contract é um programa que roda na blockchain**.

### Comparação: Código Normal vs Smart Contract

```javascript
// ❌ CÓDIGO NORMAL (no seu computador)
function transferir(destinatario, valor) {
  conta -= valor;
  console.log("Transferência feita!");
  // Pode virar Código Normal que deseja 😅
}

// ✅ SMART CONTRACT (na blockchain)
function transferir(destinatario, valor) {
  require(conta >= valor, "Saldo insuficiente");
  conta -= valor;
  destinatario.recebe(valor);
  // Executa EXATAMENTE como escrito 🔒
  // NINGUÉM pode mudar ou "desfazer"
}
```

---

## 🎯 Propriedades Principais

| Propriedade | Significado |
|-------------|------------|
| **Determinístico** | Mesma input = Mesmo output (sempre) |
| **Imutável** | Uma vez deployado, não muda |
| **Transparente** | Todos veem o código e execução |
| **Irreversível** | Uma vez executado, não desfaz |
| **Autônomo** | Executa sozinho se condições forem atendidas |

---

## 🔄 Ciclo de Vida

### 1. Escrever (Desenvolvimento)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Votacao {
    mapping(address => uint256) public votos;
    
    function votar() external {
        require(tem_direito(), "Sem direito!");
        votos[msg.sender]++;
    }
}
```

### 2. Compilar

```bash
$ solc Votacao.sol --bin --abi
# Produz:
# - Bytecode (instruções para blockchain)
# - ABI (como chamar o contrato)
```

### 3. Deploy (Publicar na Blockchain)

```
Você envia transação:
"Criar contrato Votacao"
        ↓
Mineradores validam
        ↓
Contrato criado em endereço:
0x123...abc
        ↓
PERMANENTEMENTE na blockchain!
```

### 4. Usar (Chamar Funções)

```javascript
// Frontend (React)
const contrato = new ethers.Contract(
  address,    // onde está o contrato
  abi,        // como usar
  signer      // quem está chamando
);

await contrato.votar();  // Executa na blockchain
```

---

## 📚 Conceitos de Smart Contracts

### Estado (Dados Persistentes)

```solidity
// Estes dados PERMANECEM mudando:
contract Votacao {
    uint256 public totalVotos = 0;        // armazenado
    mapping(address => bool) hasVoted;    // armazenado
    string public proposalTitulo = "";    // armazenado
}

// Toda mudança custa gas!
```

### Funções

```solidity
contract Votacao {
    // VIEW: Lê dados (gratuito, não muda estado)
    function getTotalVotos() public view returns (uint256) {
        return totalVotos;
    }
    
    // TRANSACTION: Muda dados (custa gas)
    function votar(uint256 proposalId) external {
        totalVotos++;
    }
}
```

### Modificadores (Controle de Acesso)

```solidity
contract Votacao {
    address public owner;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Não é owner!");
        _;
    }
    
    // Só owner pode chamar
    function pause() external onlyOwner {
        ativo = false;
    }
}
```

### Eventos (Logs)

```solidity
contract Votacao {
    event VotoRegistrado(address indexed votante, bool suporta);
    
    function votar(bool suporta) external {
        // ... código de votação ...
        
        emit VotoRegistrado(msg.sender, suporta);
        // ^ Registra na blockchain que votação aconteceu
    }
}
```

---

## 💰 Gas (Combustível do Smart Contract)

Cada operação custa gas:

```solidity
contract Exemplo {
    mapping(address => uint256) balances;
    
    function transferir(address para, uint256 valor) external {
        // ✅ Leitura (~200 gas)
        uint256 meuSaldo = balances[msg.sender];
        
        // ❌ Verificação (~3.000 gas)
        require(meuSaldo >= valor, "Insuficiente!");
        
        // ❌ Escrita (~20.000 gas)
        balances[msg.sender] -= valor;
        balances[para] += valor;
        
        // Total: ~23.200 gas
        // Custo real = 23.200 * gasprice
    }
}
```

### Gas Price (varia)

```
Gas Price Alto → Transações rápidas (caro)
Gas Price Baixo → Transações lentas (barato)

Exemplo Sepolia:
  21.000 gas * 2 gwei = 0.000042 ETH ≈ R$0,10
```

---

## 🔐 Segurança Importante

### Nunca Compartilhe Sua Chave Privada!

```
❌ NUNCA:
   - Copie chave privada em email
   - Digite em websites estranhos
   - Compartilhe com qualquer um
   
✅ SEMPRE:
   - Guarde em lugar seguro (hardware wallet)
   - Only use em sites que você CONFIA
   - Quando alguém pede = é scam!
```

### Reentrância (Attack Comum)

```solidity
// ❌ VULNERÁVEL:
function sacar(uint256 valor) external {
    require(balances[msg.sender] >= valor);
    // 1. Checa saldo
    
    msg.sender.call{value: valor}("");
    // 2. Manda ETH (PERIGO!)
    // Contrato malicioso pode chamar sacar() de novo!
    
    balances[msg.sender] -= valor;
    // 3. Atualiza saldo (tarde demais!)
}

// ✅ SEGURO (Checks-Effects-Interactions pattern):
function sacar(uint256 valor) external {
    require(balances[msg.sender] >= valor);
    balances[msg.sender] -= valor;  // Atualiza PRIMEIRO
    msg.sender.call{value: valor}("");  // Depois manda
}
```

---

## 🗺️ Arquitetura Básica

```
┌─────────────────────────────────┐
│     SMART CONTRACT             │
├─────────────────────────────────┤
│                                 │
│  STATE (Dados):                │
│  ├─ mapping(estouro)           │
│  ├─ uint256 valor              │
│  └─ array propostas            │
│                                 │
│  FUNCTIONS (Ações):            │
│  ├─ ler dados [view/gratuito]  │
│  ├─ mudar dados [transaction]  │
│  └─ lógica de negócio          │
│                                 │
│  EVENTS (Eventos):             │
│  └─ emit ao fazer coisas       │
│                                 │
└─────────────────────────────────┘
```

---

## 📊 Tipos de Smart Contracts

| Tipo | Exemplo | Neste Projeto |
|------|---------|--------------|
| **Token** | ERC20 (moeda) | BCIToken ✅ |
| **DAO** | Votação | DAOVoting ✅ |
| **NFT** | ERC721 (desenho único) | - |
| **Swap** | Trocar um token por outro | - |
| **Lending** | Emprestar cripto | - |

---

## 🌍 ERC20 (Padrão Token)

Nossa BCIToken é um **ERC20**. Significa:

```solidity
interface IERC20 {
    function balanceOf(address owner) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}
```

**Por que ERC20?**
- Padrão universal
- Exchanges (.endeçam)
- Wallets suportam
- Compatível com outros contratos

---

## 🚀 Próximo Passo

Agora que entende smart contracts:
- Veja [04 - Arquitetura Overview](./04-arquitetura-overview.md) (projeto todo)
- Aprenda sobre [05 - BCIToken](./05-bci-token.md) (nosso token)
- Estude [06 - DAOVoting](./06-dao-voting.md) (votação)

---

**Resumo**: Smart contracts = programas confiáveis na blockchain que ninguém pode hackear ou mudar!
