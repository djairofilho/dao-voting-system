# 01 - Guia Rápido ⚡

**Leitura: 5 minutos**

## O Projeto em 30 Segundos

Este é um **sistema de votação descentralizado (DAO)** construído em Solidity que roda na rede Sepolia da Ethereum.

- **O que faz**: Permite que membros com tokens BCI criem propostas e votem
- **Onde roda**: Blockchain Ethereum (testnet Sepolia)
- **Frontend**: Aplicação React que conecta via MetaMask
- **Objetivo**: Demonstrar votação democrática em blockchain

---

## 🎯 Os 3 Conceitos Centrais

### 1️⃣ **BCIToken (Token de Governança)**
```solidity
// Você precisa ter tokens BCI para votar
balanceOf(seu_endereco) >= 100 // mínimo para criar propostas
```
- Token ERC20 padrão
- Supply inicial: 10.000 tokens
- Distribuível entre membros da DAO

### 2️⃣ **DAOVoting (Votação)**
```solidity
// 3 passos:
1. Alguém com 100+ BCI cria uma proposta
2. Qualquer um com BCI vota (sim/não)
3. Proposta é executada se aprovada
```

### 3️⃣ **Frontend (Interface)**
- Conecta via MetaMask
- Exibe propostas ativas
- Permite criar votos
- Distribui tokens para testes

---

## 🚀 Começar em 10 Minutes

### Passo 1: Instalar MetaMask
```
1. Ir para: https://metamask.io/download/
2. Instalar extensão do navegador
3. Criar/Importar carteira
```

### Passo 2: Conectar Sepolia Testnet
```
1. MetaMask → Network → Add Network
2. Nome: Sepolia
3. RPC: https://eth-sepolia.g.alchemy.com/v2/SEU_API_KEY
4. Chain ID: 11155111
5. Salvar
```

### Passo 3: Obter Testnet ETH
```
👉 Vá para a seção "💰 Obter Sepolia ETH"
   no frontend e clique em um faucet
   - Grabteeth: 0.1 ETH (sem login)
   - Alchemy: 0.5 ETH (com conta)
```

### Passo 4: Usar o Sistema
```
1. npm start (no diretório frontend)
2. Clique em "Conectar Carteira"
3. Escolha "💰 Obter Testnet ETH"
4. Peça tokens BCI no admin panel
5. Pronto! Agora vota e cria propostas
```

---

## 📊 Fluxo Básico (Visão de Usuário)

```
┌─────────────────────────────────────────┐
│ 1. Você conecta sua carteira MetaMask   │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ 2. Admin distribui 100+ BCI tokens      │ ← Teste: Tab "Distribuir Tokens"
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ 3. Você cria uma proposta               │ ← "Registrar Nova Proposta"
│    (requer 100 BCI + taxa de gas)       │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ 4. Sistema cria proposta no blockchain  │
│    Votação aberta por 24horas           │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ 5. Membros votam (sim/não)              │ ← "Consultar Propostas"
│    (precisa de 1+ BCI)                  │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ 6. Votação encerra                      │
│    • Se maioria 'sim': Aprovada ✅      │
│    • Se maioria 'não': Rejeitada ❌     │
└─────────────────────────────────────────┘
```

---

## 💡 Exemplos Práticos

### Criar Proposta
```
Título: "Aumentar budget de pesquisa"
Descrição: "Alocar 5% mais orçamento para blockchain"
Período votação: 2 dias
```
✅ Custo: ~50.000-100.000 gas (≈ pequena taxa ETH)

### Votar
```
Proposta #1: "Aumentar budget"
Seu voto: ✅ SIM
Seu poder: 500 BCI = 500 votos
```
✅ Custo: ~30.000-50.000 gas (menos que criar)

---

## 🔗 Endereços dos Contratos

Rodando em **Sepolia Testnet**:

| Contrato | Endereço |
|----------|----------|
| **BCI Token** | `0x0FCE6ecA806E93cF683bB807E56Cec74Ed87f9f7` |
| **DAO Voting** | `0xb3d9dD3213b7B6c8D1F46Dc24c869c99647b53e9` |

Ver no Etherscan: https://sepolia.etherscan.io/

---

## ❓ Perguntas Rápidas

**P: Preciso de dinheiro real?**
→ Não! Testnet ETH é grátis. Vá em "💰 Obter Sepolia ETH"

**P: Quanto custa criar proposta?**
→ ~100.000 gas (que em Sepolia = centavos)

**P: Meu voto é anônimo?**
→ Não. Blockchain = transparente. Seu voto fica registrado permanentemente

**P: Posso mudar meu voto?**
→ Não. Uma vez votado, não pode mudar

**P: E se a proposta tiver empate?**
→ Ela é rejeitada (maioria inclusive deve ser > 50%)

---

## 🎓 Próximos Passos

Quer aprender mais?

- **Iniciante**: Leia [02 - Blockchain Básico](./02-blockchain-basico.md)
- **Técnico**: Vá para [04 - Arquitetura Overview](./04-arquitetura-overview.md)
- **Usuário**: Siga [08 - Como Usar o Frontend](./08-frontend-guia.md)
- **Dev**: Estude [09 - Deploy de Contratos](./09-deploy-contratos.md)

---

## 📞 Precisa de Ajuda?

- 🔍 Ver FAQ: [17 - FAQ & Troubleshooting](./17-faq.md)
- 📖 Ver Glossário: [18 - Glossário Web3](./18-glossario.md)
- 🔗 Recursos: [19 - Links Úteis](./19-links-uteis.md)

---

**Tempo total**: ~10 minutos para estar pronto!
