# 09 - Deploy de Contratos 🚀

**Leitura: 14 minutos**

---

## 📋 Pre-requisitos

```
✅ Foundry instalado (forge)
✅ Git instalado
✅ Chave privada de teste (segura!)
✅ ETH testnet na carteira
✅ Conta em faucet (ex: Alchemy, Infura)
```

---

## 🏠 Opção 1: Deploy Local (Anvil)

**Melhor para**: Desenvolvimento e testes rápidos

### Iniciar Blockchain Local

```bash
# Terminal 1: inicia blockchain local
cd contracts
anvil

# Saída:
> Listening on 127.0.0.1:8545
> Accounts:
> 0 (0x1234...): 10000 ETH
> 1 (0x5678...): 10000 ETH
```

Você tem 10 contas com 10000 ETH grátis cada!

### Fazer Deploy

```bash
# Terminal 2: deploy
cd contracts

# Cria arquivo .env
cp .env.example .env

# Edita .env:
# PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb476c6b8d8d3eb64a1f94fac417f
# (primeira conta do anvil)

# Faz deploy
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 \
  --private-key $PRIVATE_KEY --broadcast

# Saída:
> Deployed BCIToken at: 0x1234567890123456789
> Deployed DAOVoting at: 0x9876543210987654321
```

### Usar no Frontend

```javascript
// frontend/src/utils/contracts.js

const LOCALHOST_CONFIG = {
  chainId: 31337,
  rpcUrl: 'http://localhost:8545',
  bciToken: '0x1234567890123456789',    // copiar de cima
  daoVoting: '0x9876543210987654321'    // copiar de cima
};
```

Pronto! Seu frontend fala com blockchain local.

---

## 🛰️ Opção 2: Deploy em Sepolia (Testnet Real)

**Melhor para**: Testes públicos, compartilhar com outros

### Passo 1: Preparar Ambiente

```bash
cd contracts
cp .env.example .env
```

Edite `.env`:
```
# Sepolia RPC (escolha um provider):
RPC_URL_SEPOLIA=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
# ou
RPC_URL_SEPOLIA=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Sua chave privada (cuidado! guarde bem!)
PRIVATE_KEY=0xabc123...

# Etherscan (para verificar contrato)
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_KEY
```

### Passo 2: Obter Testnet ETH

```
1. Acesse: https://sepolia.drip.sh/
2. Cole seu endereço público (sem 0x privada!)
3. Recebe 0.5 ETH grátis
4. Espera ~1 minuto

Verificar:
```bash
cast balance 0x123...abc --rpc-url $RPC_URL_SEPOLIA
# Saída: 0.5 ETH
```
```

### Passo 3: Fazer Deploy

```bash
cd contracts

# Opção A: Deploy sem verificação (rápido)
forge script script/Deploy.s.sol \
  --rpc-url $RPC_URL_SEPOLIA \
  --private-key $PRIVATE_KEY \
  --broadcast

# Saída:
> Transaction submitted: 0xab12...
> BCIToken deployed: 0x1234567890123456789
> DAOVoting deployed: 0x9876543210987654321
> Block: 4123456
> Gas used: 2.5M
```

### Passo 4: Verificar Contrato (Opcional)

```bash
# Verifica na Etherscan
forge verify-contract \
  0x1234567890123456789 BCIToken \
  --chain sepolia \
  --etherscan-api-key $ETHERSCAN_API_KEY

# Anyone pode ler código agora em:
# https://sepolia.etherscan.io/address/0x1234567890123456789
```

### Passo 5: Atualizar Frontend

```javascript
// frontend/src/utils/contracts.js

const SEPOLIA_CONFIG = {
  chainId: 11155111,
  rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY',
  bciToken: '0x1234567890123456789',
  daoVoting: '0x9876543210987654321'
};
```

Agora seu frontend está em Sepolia público!

---

## 🔐 Segurança: Gerenciar Chaves Privadas

### ⚠️ NUNCA FAÇA:

```javascript
// ❌ ERRADO! Chave visível!
const PRIVATE_KEY = '0xabc123...';
git push origin main
// COMPROMETIDO!
```

### ✅ CORRETO:

```bash
# 1. Cria arquivo .env
echo "PRIVATE_KEY=0xabc123..." > .env

# 2. Adiciona ao .gitignore
echo ".env" >> .gitignore

# 3. Committa
git add .gitignore
git commit -m "Add .env to gitignore"

# 4. Chave fica segura localmente!
```

### Testar Sem Comprometer

```bash
# Cria carteira de teste
cast wallet new
# Output: Private key: 0x123...
#         Address: 0x456...

# Usa para testes
export PRIVATE_KEY=0x123456...
forge script script/Deploy.s.sol ...
```

---

## 📊 Tabela: Qual Rede Usar?

| Rede | RPC | Quando | Custo | Velocidade |
|------|-----|--------|--------|-----------|
| **Localhost** | anvil | desenvolvimento | $0 | <1s |
| **Sepolia** | Alchemy/Infura | testes públicos | $0.01-1 | 15s |
| **Mainnet** | Alchemy/Infura | produção real | $10-1000 | 15s |

---

## 🎯 Deploy Script Fácil

### Criar deploy.sh (para reutilizar)

```bash
#!/bin/bash
# contracts/deploy.sh

NETWORK=$1  # "localhost" ou "sepolia"
PRIVATE_KEY=$2

if [ "$NETWORK" == "localhost" ]; then
  RPC_URL="http://localhost:8545"
elif [ "$NETWORK" == "sepolia" ]; then
  RPC_URL=$RPC_URL_SEPOLIA
else
  echo "Rede não suportada"
  exit 1
fi

forge script script/Deploy.s.sol \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast

echo "✅ Deployment completo!"
```

### Usar

```bash
# 1. Local
bash contracts/deploy.sh localhost 0xabc123...

# 2. Sepolia
bash contracts/deploy.sh sepolia 0xdef456...
```

---

## 🪜 Passos Detalhados: Deploy Sepolia (Iniciante)

### 1️⃣ Instalar Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc
foundryup
```

### 2️⃣ Fazer Fork do Repositório

```bash
git clone https://github.com/SEU_USER/blockchain-dao.git
cd blockchain-dao/contracts
```

### 3️⃣ Configurar RPC

Criar conta em https://alchemy.com/ (grátis)

```bash
# Copiar API Key e fazer:
cat > .env << EOF
RPC_URL_SEPOLIA=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_KEY
EOF
```

### 4️⃣ Gerar Chave Privada

```bash
# Local (SEGURO)
cast wallet new
# Private key: 0x123...
# Address: 0x456...
```

Copiar esta chave para `.env`:
```
PRIVATE_KEY=0x123...
```

### 5️⃣ Obter ETH Testnet

```bash
# Vá em: https://www.alchemy.com/faucets/ethereum-sepolia
# Cole seu address: 0x456...
# Clique "Send me ETH"
# Espere ~1 min

# Verificar:
cast balance YOUR_ADDRESS --rpc-url $RPC_URL_SEPOLIA
```

### 6️⃣ Deploy!

```bash
source .env
forge script script/Deploy.s.sol \
  --rpc-url $RPC_URL_SEPOLIA \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

### 7️⃣ Ver Resultado

```
Output:
Sequence #0 on chain 11155111
  New Deployer: 0x...
  BCIToken deployed: 0x...
  DAOVoting deployed: 0x...
```

Copiar estes endereços para `frontend/src/utils/contracts.js`

### 8️⃣ Testar no DAO

1. Abra http://localhost:3000
2. Troque para network Sepolia
3. Cole endereços dos contratos
4. Distribua tokens BCI
5. Crie uma proposta
6. Vote!

Parabéns! 🎉 Seu DAO está no blockchain real!

---

## 🐛 Troubleshooting Deploy

### Erro: "Invalid private key"
```
Solução:
- Checa se chave em .env começa com 0x
- Checa se tem 64 caracteres (depois de 0x)
- Não incluir aspas ao redor
```

### Erro: "Insufficient funds"
```
Solução:
- Precisa de ETH testnet
- Use faucet (https://sepolia.drip.sh/)
- Aguarde 1-2 minutos
- Verifique: cast balance 0x... --rpc-url $RPC_URL_SEPOLIA
```

### Erro: "Contract already exists"
```
Solução:
Dois deploys para mesmo endereço? Raro!
- Use novo address com cast wallet new
- Deploy novamente
```

### Erro: "RPC connection failed"
```
Solução:
- Checa se RPC_URL está correto
- Verifica internet
- Tenta outro provider (Infura se Alchemy falha)
```

---

## 📝 Verificação Pós-Deploy

```bash
#!/bin/bash
# Verifica se tudo funcionou

# 1. Checa BCIToken
cast call 0x1234567890123456789 "balanceOf(address)" 0xYOUR_ADDRESS \
  --rpc-url $RPC_URL_SEPOLIA

# 2. Checa DAOVoting
cast call 0x9876543210987654321 "proposalCount()" \
  --rpc-url $RPC_URL_SEPOLIA

# 3. Distribui tokens
cast send 0x1234567890123456789 \
  "transfer(address,uint256)" 0x111... 100e18 \
  --rpc-url $RPC_URL_SEPOLIA \
  --private-key $PRIVATE_KEY
```

---

## 🌐 RPC Providers Recomendados

```
✅ Alchemy (melhor)
   https://www.alchemy.com/
   Grátis até 300M requests/mês

✅ Infura (bom)
   https://www.infura.io/
   Grátis até 100k request/dia

✅ QuickNode (rápido)
   https://www.quicknode.com/
   Plano grátis disponível
```

---

## 📈 Próximas Etapas

```
1. Deploy em Sepolia ✅
2. Testar na blockchain
3. Ir para Mainnet (etapa final - requer $ real!)
```

---

## 🎓 Próximas Leituras

- **Testar contratos**: [10 - Testando Contratos](./10-testando-contratos.md)
- **Referência de funções**: [11 - Funções BCIToken](./11-funcoes-bci-token.md)
- **Troubleshooting**: [17 - FAQ](./17-faq.md)

---

**Resumo**: Deploy = enviar smart contract para blockchain. Local para dev, Sepolia para testes, Mainnet para produção com dinheiro real!
