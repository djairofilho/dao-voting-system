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