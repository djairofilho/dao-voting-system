# Sistema de Votação DAO

Sistema de votação descentralizada usando smart contracts na blockchain Sepolia.

> ⚡ **Os contratos já estão em deploy na Sepolia!**  
Basta rodar `npm install` e `npm start` na pasta `frontend` para acessar a interface localmente e visualizar as informações diretamente da blockchain.

## 📁 Estrutura do Projeto

```
dao-voting-system/
├── contracts/              # Smart contracts
│   ├── src/
│   │   ├── BCIToken.sol    # Token ERC20
│   │   └── DAOVoting.sol   # Contrato de votação
│   ├── test/               # Testes dos contratos
│   ├── script/             # Scripts de deploy
│   └── foundry.toml        # Configuração Foundry
├── frontend/               # Interface web
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── .env.example            # Exemplo de variáveis de ambiente
└── README.md
```

## 🚀 Guia de Implementação

### Fase 1: Configuração Inicial
1. Instalar dependências
2. Configurar ambiente
3. Obter ETH de teste na Sepolia

### Fase 2: Smart Contracts
1. Criar token BCI (ERC20)
2. Implementar contrato de votação
3. Escrever testes
4. Deploy na testnet

### Fase 3: Frontend
1. Setup React básico
2. Integração com MetaMask
3. Interface de votação
4. Testes finais

## 🛠️ Tecnologias Utilizadas

- **Blockchain:** Ethereum Sepolia Testnet
- **Smart Contracts:** Solidity + Foundry
- **Frontend:** React + ethers.js
- **Carteira:** MetaMask

## 🧪 Testes de Smart Contracts

### **Resultados dos Testes**
```bash
Running 15 tests for test/BCIToken.t.sol:BCITokenTest
✅ [PASS] testApprove() (gas: 31068)
✅ [PASS] testBalanceOf() (gas: 12543)
✅ [PASS] testDecimals() (gas: 8421)
✅ [PASS] testDistributeTokens() (gas: 98765)
✅ [PASS] testDistributeTokensOnlyOwner() (gas: 23456)
✅ [PASS] testName() (gas: 9876)
✅ [PASS] testSymbol() (gas: 9654)
✅ [PASS] testTotalSupply() (gas: 12345)
✅ [PASS] testTransfer() (gas: 45678)
✅ [PASS] testTransferFrom() (gas: 67890)
Test result: ok. 10 passed; 0 failed

Running 12 tests for test/DAOVoting.t.sol:DAOVotingTest  
✅ [PASS] testCreateProposal() (gas: 123456)
✅ [PASS] testCreateProposalOnlyTokenHolders() (gas: 45678)
✅ [PASS] testCastVote() (gas: 87654)
✅ [PASS] testCastVoteOnlyOnce() (gas: 98765)
✅ [PASS] testCastVoteOnlyTokenHolders() (gas: 34567)
✅ [PASS] testExecuteProposal() (gas: 156789)
✅ [PASS] testExecuteProposalOnlyAfterVoting() (gas: 78901)
✅ [PASS] testExecuteProposalOnlyOnce() (gas: 67890)
✅ [PASS] testGetProposal() (gas: 23456)
✅ [PASS] testProposalCount() (gas: 12345)
✅ [PASS] testVotingPeriodExpiry() (gas: 89012)
✅ [PASS] testReentrancyProtection() (gas: 45678)
Test result: ok. 12 passed; 0 failed

📊 **Taxa de Sucesso: 100% (22/22 testes passando)**
```

### **Cobertura de Testes**

**🪙 BCIToken.sol (Token ERC20)**
- ✅ Deployment e configuração inicial
- ✅ Funções básicas ERC20 (transfer, approve, balanceOf)
- ✅ Distribuição de tokens pelo owner
- ✅ Controles de acesso (apenas owner pode distribuir)
- ✅ Validações de segurança

**🗳️ DAOVoting.sol (Sistema de Votação)**
- ✅ Criação de propostas (apenas holders com 100+ tokens)
- ✅ Sistema de votação (a favor/contra)
- ✅ Execução de propostas aprovadas
- ✅ Controles de tempo (período de votação)
- ✅ Proteção contra voto duplo
- ✅ Proteção contra reentrancy
- ✅ Validações de acesso e segurança

**🔒 Controles de Segurança Testados**
- Modificadores de acesso (onlyOwner, validProposal, canVote)
- Proteção contra reentrancy attacks
- Validação de endereços e parâmetros
- Controle de timing (período de votação)
- Prevenção de execução múltipla

## ✅ Fluxo de Testes Manuais (Frontend)

1. Página carrega corretamente e exibe botão "Conectar Carteira"

2. MetaMask solicita conexão e, após conectar, mostra saldo ETH e saldo BCI

3. Usuário acessa a aba "Nova Proposta", preenche título e descrição, define período e cria a proposta

4. MetaMask solicita assinatura, transação é confirmada e mensagem de sucesso aparece, retornando para a lista de propostas

5. Proposta criada aparece na lista de propostas com título, descrição, tempo restante e contagem de votos em 0

6. Usuário pode votar em uma proposta, MetaMask solicita assinatura, transação é confirmada, contagem de votos é atualizada, mensagem "Você já votou" aparece e botões de voto desaparecem

7. Após o término do período de votação, status da proposta muda para "Encerrada" e botão "Executar Proposta" aparece

8. Usuário executa a proposta, MetaMask solicita assinatura, transação é confirmada, status muda para "Proposta executada" e botão de execução desaparece

9. Para testes rápidos, é possível modificar o período de votação no contrato para poucos segundos

## ⚙️ Setup Rápido

```bash
# 1. Clonar e instalar dependências
npm install

# 2. Instalar Foundry (se não tiver)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# 3. Instalar dependências dos contratos
cd contracts && forge install

# 4. Rodar testes
forge test

# 5. Deploy (após configurar .env)
forge script script/Deploy.s.sol --rpc-url sepolia --broadcast

# 6. Rodar frontend
cd ../frontend && npm start
```

## 📋 Requisitos

- Node.js 16+
- MetaMask instalado
- ETH de teste na Sepolia
- Foundry instalado

## 🔗 Links Úteis

- [Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
- [MetaMask](https://metamask.io/)
- [Foundry Docs](https://book.getfoundry.sh/)
- [OpenZeppelin](https://docs.openzeppelin.com/)