# 19 - Links Úteis e Recursos 🔗

**Leitura: 5 minutos**

---

## 🌐 Documentação Oficial

### Ethereum & Smart Contracts

| Link | O quê | Nível |
|------|-------|-------|
| [ethereum.org](https://ethereum.org) | Hub oficial Ethereum | Iniciante |
| [docs.soliditylang.org](https://docs.soliditylang.org) | Linguagem Solidity | Referência |
| [eips.ethereum.org](https://eips.ethereum.org) | Propostas Ethereum | Avançado |
| [web3.org](https://web3.org) | Web3 em geral | Iniciante |

### Ferramentas

| Link | O quê | Uso |
|------|-------|-----|
| [Foundry Book](https://book.getfoundry.sh) | Framework Solidity | Dev |
| [ethers.js](https://docs.ethers.org) | Biblioteca JavaScript | Frontend |
| [web3.js](https://docs.web3js.org) | Alternativa a ethers | Frontend |
| [OpenZeppelin Docs](https://docs.openzeppelin.com) | Contratos auditados | Security |

---

## 🧪 Testnet Faucets

### Sepolia ETH (Recomendado)

```
Grabteeth (mais rápido)
https://grabteeth.xyz

Sepolia Faucet
https://sepolia.drip.sh

Alchemy
https://www.alchemy.com/faucets/ethereum-sepolia

Infura
https://www.infura.io/faucet/sepolia
```

### Holesky ETH

```
https://holesky-faucet.pk910.de
https://faucet.holesky.ethpandaops.io
```

### Testnet Tokens

```
Sepolia Token Fauets (para outros tokens)
https://sepoliafaucet.com
https://tokens.etherscan.io
```

---

## 🔍 Exploradores de Bloco (Blockchain Explorers)

### Ethereum

| Rede | Link |
|------|------|
| Mainnet | [etherscan.io](https://etherscan.io) |
| Sepolia | [sepolia.etherscan.io](https://sepolia.etherscan.io) |
| Holesky | [holesky.etherscan.io](https://holesky.etherscan.io) |

### Como Usar

```
1. Cola endereço do contrato ou tx hash
2. Vê todos os detalhes (estado, eventos, etc)
3. Verifica se contrato é auditado
4. Vê histórico de transações
```

---

## 💻 IDEs Online

### Remoto (sem instalar nada)

```
Remix IDE
https://remix.ethereum.org

├─ Editor Solidity
├─ Deploy rápido
├─ Debugger integrado
└─ Melhor para aprender
```

### Local (instalado)

```
VS Code + Solidity Extension
├─ Syntax highlighting
├─ Autocompletar
└─ Mais power que Remix
```

---

## 🔐 Seguran

### Análise de Contratos

| Ferramenta | Uso |
|-----------|-----|
| [Slither](https://github.com/crytic/slither) | Static analysis |
| [Mythril](https://mythril.ai) | Symbolic execution |
| [Certora](https://www.certora.com) | Formal verification |
| [Tenderly](https://tenderly.co) | Debugging + simulation |

### Audit Companies

```
Trail of Bits
https://www.trailofbits.com

OpenZeppelin
https://www.openzeppelin.com/security-audits

ConsenSys Diligence
https://consensys.io/diligence
```

---

## 📚 Educação

### Cursos Gratuitos

```
Ethereum.org Learning
https://ethereum.org/en/learn

CryptoZombies
https://cryptozombies.io
├─ Solidity interativo
├─ Muito divertido
└─ Recomendado!

OpenZeppelin Contracts Wizard
https://docs.openzeppelin.com/contracts/5.x/wizard
├─ Gera contratos
└─ Aprender vendo código
```

### Comunidade

```
Ethereum Builders Discord
https://discord.gg/ethereum-builders

Reddit
https://reddit.com/r/ethdev

Twitter (X)
Search: #Solidity #Web3Dev
```

---

## 🛠️ Utilities & Tools

### Testing & Simulation

| Tool | URL |
|------|-----|
| Foundry | [getfoundry.sh](https://getfoundry.sh) |
| Hardhat | [hardhat.org](https://hardhat.org) |
| Truffle | [trufflesuite.com](https://trufflesuite.com) |

### Gas Optimization

```
Gas Reporter
https://github.com/cgewecke/eth-gas-reporter

Ethernauts
https://etherscan.io/gas/
└─ Ver gas prices atualmente
```

### Contract Verification

```
Etherscan Verify
1. Deploy contrato
2. Vá em etherscan.io
3. Procura seu endereço
4. Clica "Verify & Publish"
5. Cola o Solidity code
```

---

## 💰 Preços & Analytics

### Preços Real-Time

```
CoinGecko
https://coingecko.com

CoinMarketCap
https://coinmarketcap.com

Binance
https://www.binance.com
```

### On-Chain Analytics

```
Glassnode
https://glassnode.com

IntoTheBlock
https://intotheblock.com

Nansen
https://nansen.ai
```

---

## 🧠 Segurança & Best Practices

### OWASP Smart Contract

```
Smart Contract Top 10
https://owasp.org/www-project-smart-contract-top-10/

SWC Registry (Vulnerabilities)
https://swcregistry.io
```

### Checklist Pré-Mainnnet

```
□ Auditoria externa (TEST em testnet primeiro!)
□ Testes com 100% coverage
□ slither + mythril rodados
□ Code review
□ Upgrade path documentado
□ Pausable em caso emergência
□ Saldo adequado de ETH
□ Team info known
```

---

## 🌐 RPC Providers

### Principais

```
Alchemy
https://www.alchemy.com
├─ Grátis até 300M req/mês
└─ Recomendado

Infura
https://www.infura.io
├─ Grátis até 100k req/dia
└─ Alternativa

QuickNode
https://www.quicknode.com
├─ Grátis + pago
└─ Bom suporte

Blast
https://blastapi.io
├─ Novo
└─ Rápido
```

### Para Local

```
Ganache
http://trufflesuite.com/ganache
└─ Blockchain local GUI

Anvil (no Foundry)
```bash
anvil
```
└─ CLI blockchain local
```

---

## 📖 Blogs & Publicações

### Web3 Insights

```
Vitalik Buterin
https://vitalik.ca
└─ Vitalik escreve sobre visão Ethereum

Mirror
https://mirror.xyz
└─ Publicações blockchain

Substack
Busque: "Ethereum", "Solidity", "Web3"
```

### Segurança

```
Secureum
https://secureum.substack.com
├─ Artigos de segurança
└─ Recomendado!

Samczsun Blog
https://samczsun.com
└─ Análises técnicas
```

---

## 🎥 Vídeos

### YouTube Channels

```
Patrick Collins (Freecodejcamp)
- Foundry, Solidity, Web3

Smart Contract Programmer
- Conceitos avançados

Ethereum Foundation
- Oficialmente ethereum
```

### Tutoriais

```
CryptoZombies (interativo + vídeos)
EatTheBlocks (curso Solidity)
Dapp University (full stack)
```

---

## 🔧 Stack Recomendado 2024

```
Smart Contract Development:
├─ Language: Solidity 0.8.24+
├─ Framework: Foundry
├─ Testing: Forge
├─ Verification: Etherscan
└─ Audit: Slither + Mythril

Frontend:
├─ Framework: React 18
├─ Web3: ethers.js v6
├─ Wallet: Wagmi + web3 Modal
├─ UI: Tailwind CSS
└─ Testing: Vitest

Deployment:
├─ Testnet: Sepolia
├─ Provider: Alchemy ou Infura
├─ Deployment Tool: Foundry
└─ Verification: Etherscan API
```

---

## 📊 Métricas Úteis

### Gas Prices Agora?

```
https://etherscan.io/gastracker
```

### CID Atual?

```
Linux: date +%s
Windows: PowerShell [math]::Round((Get-Date).AddSeconds(-$Offset).ToFileTime()/10000000)-11644473600
```

### Confirmações Recomendadas?

```
Testnet: 1-2
Mainnet testados: 3-6
Mainnet financeiro: 12+
```

---

## 🎓 Próximas Etapas

```
1. Bookmark os links úteis
2. Criar conta em Alchemy/Infura
3. Deploy seu primeiro contrato em Sepolia
4. Pedir review em comunidade
5. Considerar auditoria antes de Mainnet
```

---

## ❓ Links para FAQ

```
Confuso sobre blockchain?
→ [18 - Glossário](./18-glossario.md)

Erro específico?
→ [17 - FAQ](./17-faq.md)

Precisa de deploy?
→ [09 - Deploy](./09-deploy-contratos.md)
```

---

## 📈 Próximas Leituras

- **Roadmap**: [20 - Roadmap](./20-roadmap.md)
- **Glossário**: [18 - Glossário](./18-glossario.md)
- **FAQ**: [17 - FAQ](./17-faq.md)

---

**Resumo**: Web3 = gigantesco. Mais links que consegue explorar. Comece com Ethereum.org + Foundry + ethers.js. Depois vá explorando! 🚀
