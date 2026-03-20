# 18 - Glossário Web3 📖

**Leitura: 7 minutos**

---

## A️⃣ A-D

**Address (Endereço)**
- Identificador único na blockchain (42 caracteres, começa com 0x)
- Exemplo: `0x1234567890123456789012345678901234567890`
- Cada pessoa/contrato tem um

**ABI (Application Binary Interface)**
- "Dicionário" que Frontend usa para falar com Smart Contract
- Define quais funções existe e como chamar
- Gerada ao compilar contrato

**Altcoin**
- Qualquer criptomeda que não é Bitcoin
- Ethereum, Solana, Polygon, etc.

**Block (Bloco)**
- Conjunto de transações confirmadas
- Adicionado a cada ~15 segundos em Ethereum
- Imutável uma vez confirmado

**Blockchain**
- Corrente de blocos
- Cada bloco referencia anterior (daí "cadeia")
- Transparente + Descentralizado

**Bridge (Ponte)**
- Transferência entre blockchains
- Exemplo: ETH em Mainnet → Polygon

**Burn (Queimar)**
- Destruir tokens permanentemente
- Reduz supply total
- Às vezes aumenta valor

**Bytecode**
- Código compilado do Smart Contract
- Gera o "bytecode" que blockchain executa

**Cadeia**
Ver: Blockchain

---

## C️⃣ C-D (continuação)

**Call (Chamada)**
- Executa função de contrato sem mudar estado
- SEM CUSTO DE GAS
- Exemplo: `balanceOf()`, `allowance()`

**Calldata**
- Dados passados para função
- Mais barato que memory

**CEX (Centralized Exchange)**
- Exchange centralizado (exemplo: Binance, Coinbase)
- Guarda suas moedas
- Risco de hack/fecho

**Confirmação**
- Bloco foi minerado e aceito
- 1 confirmação = em bloco
- 12+ confirmações = bem seguro

**Contract (Contrato)**
Ver: Smart Contract

**DAO (Decentralized Autonomous Organization)**
- Organização sem gerente, governada por votação
- Código=lei
- Exemplo: nosso sistema!

**dApp (Decentralized Application)**
- App que roda em blockchain
- Exemplo: app de votação, Exchange DEX

**DEX (Decentralized Exchange)**
- Exchange descentralizado (Uniswap, SushiSwap)
- Sem intermediário
- Transparente

**DeFi (Decentralized Finance)**
- Finanças descentralizadas
- Lending, Swaps, Staking sem banco

---

## E️⃣ E-G

**ETH (Ethereum)**
- Criptomoeda nativa da rede Ethereum
- Usa para pagar gas/transações

**Event (Evento)**
- "Grito" do contrato quando algo acontece
- Registrado permanentemente
- Exemplo: `Transfer` event

**Exploit (Exploração)**
- Ataque que explora vulnerabilidade
- Pode roubar fundos
- Razão de testar bem

**Faucet (Torneira)**
- Serviço que distribui testnet ETH/tokens GRÁTIS
- Exemplo: sepolia.drip.sh

**Fee (Taxa)**
- Custo da transação (em gas)
- Vai para minerador/validador

**Fork (Divisão)**
- Cópia do blockchain
- Exemplo: criou testnet Sepolia
- Ou: divisão de protocolo (hard fork)

**Front-running**
- Atacante vê transação pendente
- Envia a dele ANTES
- Lucra com isso

**Function (Função)**
- Operação em Smart Contract
- Exemplo: `transfer()`, `vote()`

**Gas**
- Combustível que paga computação
- Cada operação custa diferente
- Total gas * preço = valor em ETH

**Gas Price (Preço de Gas)**
- Quanto você paga POR UNIDADe de gas
- Medido em gwei ou wei
- Varia com congestionamento

**Gwei**
- 1 gwei = 1 bilionésimo de ETH
- Unidade comum para gas price
- Exemplo: "30 gwei"

---

## H️⃣ H-L

**Hash (Hash Criptográfico)**
- Representação única de dados
- Mesmo 1 bit mudado = hash completamente diferente
- Exemplo: SHA-256

**Hashrate (Taxa de Hash)**
- Poder computacional da rede
- Usado em Proof-of-Work

**Hot Wallet (Carteira Quente)**
- Carteira online/conectada
- Rápido mas menos seguro
- Exemplo: Metamask

**Jean Whitelist**
- Lista de endereços aprovados
- Pode fazer coisas que outros não
- Segurança adicional

**IPFS**
- Sistema de armazenamento descentralizado
- Alternativa ao armazenamento centralizado
- Onde guardam NFT metadados

**Layer 2 (Camada 2)**
- Solução que processa além da mainchain
- Mais rápida e barata
- Exemplo: Polygon, Arbitrum

**Ledger**
- Registro de todas as transações
- Público na blockchain
- Transparente

**Liquidez**
- Quanto de volume pode trocar facilmente
- Mais liquidez = menos slippage

---

## M️⃣ M-P

**Mainnet (Rede Principal)**
- Blockchain oficial com dinheiro REAL
- Ethereum Mainnet (onde está os $$)
- Cuidado: erros são financeiros!

**Memory (Memória)**
- Armazenamento temporário do contrato
- Apagado após transação
- Mais barato que storage

**MEV (Maximum Extractable Value)**
- Valor que pode extrair reordenando transações
- Problema de front-running
- Foco recente de Ethereum

**Miner (Minerador)**
- Computador que processa blocos
- Proof-of-Work apenas
- Ganha taxa + reward

**Mining (Mineração)**
- Processo de confirmar transações
- Proof-of-Work (CPU intensivo)
- Agora deprecated em Ethereum (após Merge)

**Nonce (Number-Once)**
- Contador que incrementa a cada transação
- Previne replay attacks
- Acelerador de transações duplicadas

**Node (Nó)**
- Computador que roda blockchain
- Valida transações
- Você pode rodar um!

**Oracle (Oráculo)**
- Serviço que traz dados do mundo real
- Exemplo: preço de ETH em USD
- Centralizado (risco)

**Peer-to-Peer (P2P)**
- Comunicação direta entre 2 partes
- Sem intermediário
- Blockchain é P2P

**Private Key (Chave Privada)**
- 64 caracteres hexadecimais
- GUARDE COM VIDA
- Controla sua carteira
- SE VAZAR = PERDEU TUDO

---

## P️⃣ P-S

**Public Key (Chave Pública)**
- Derivada de chave privada
- Usada para receber fundos
- OK compartilhar

**PoS (Proof-of-Stake)**
- Consenso baseado em quanto você tem
- Ethereum usa isso agora
- Menos energia que PoW

**PoW (Proof-of-Work)**
- Consenso baseado em computação
- CPU intensivo
- Bitcoin ainda usa

**Proposal (Proposta)**
- Sugestão/voto em DAO
- Exemplo: "aumentar budget"
- Votação determina resultado

**Pull (Puxar)**
- Usuário recebe fundos (vs push)
- Mais seguro que push

**Push (Empurrar)**
- Contrato envia fundos para usuário
- Menos seguro (reentrancy)

**Revert (Reverter)**
- Transação falha e retorna
- Não consome gas desnecessário
- Exemplo: require() que falha

**Rollup (Acúmulo)**
- Layer 2 que acumula múltiplas transações
- Exemplo: Optimism, Arbitrum
- Barato + rápido

**RPC (Remote Procedure Call)**
- Como conectar ao blockchain
- Exemplo: infura.io, alchemy.com
- Frontend usa RPC para falar com blockchain

**Rugpull (Puxada de Tapete)**
- Criador some com fundos
- Golpe comum em crypto
- Razão de verificar contratos

**Salt (Sal)**
- Número aleatório para criar endereço único
- Usado em CREATE2
- Evita colisão de endereços

---

## S️⃣ S-W

**Seed Phrase (Frase Geradora)**
- 12-24 palavras que geram carteira
- BACKUP CRÍTICO
- Se perder = carteira perdida

**Selfdestruct (Auto-destruir)**
- Contrato delete a si mesmo
- Rare, caro (5000 gas)
- Paga refund

**Slashing (Corte)**
- Penalidade por misbehavior em PoS
- Você perde staked ETH
- Incentiva bom comportamento

**Slippage (Deslizamento)**
- Diferença entre preço esperado vs real
- Comum em swaps
- Menos liquidez = mais slippage

**Smart Contract (Contrato Inteligente)**
- Código autexecutável
- Roda em blockchain
- Determinístico

**Storage (Armazenamento)**
- Dados persistentes do contrato
- Caro de escrever (5000 gas)
- Barato de ler (200 gas)

**Stake (Jogo/Aposta)**
- Lock de tokens para consenso PoS
- Você ganha rewards
- Risco: slashing

**Stablecoin (Moeda Estável)**
- Token que acompanha USD/outro fiat
- Exemplo: USDC, USDT, DAI
- Usado para valores previstos

**State (Estado)**
- Dados armazenados no contrato
- Storage + Mapping
- Mutável (mas com custo)

**Swap (Troca)**
- Exchange de 1 token por outro
- Exemplo: Uniswap
- Descentralizado

**Testnet (Rede de Teste)**
- Blockchain fiel mas grátis
- Exemplo: Sepolia, Holesky, Ganache
- USE AQUI antes de Mainnet!

**Token (Ficha)**
- Representação de valor em blockchain
- Exemplo: BCI (nosso token), USDC, USDT
- ERC20 = padrão Ethereum

**Transaction (Transação)**
- Mudança de estado no blockchain
- Custa gas
- Permanente uma vez confirmada

**Validator (Validador)**
- Node que valida blocos (PoS)
- Staked ETH como "pele no jogo"
- Ethereum tem ~900k validadores

**Wallet (Carteira)**
- Software/hardware que gerencia chaves
- Exemplo: Metamask, Ledger
- Seu dinheiro fica aqui

**Wei**
- Unidade mínima de ETH
- 1 ETH = 10^18 wei
- "Satoshi" do Ethereum

---

## Siglas Comuns

```
ASCII / ABI / ATH / APE / APR / APY
DEX / DeFi / DAO / dApp / DCA / DD
ETH / ERC / EVM / EOA
FOMO / FUD / FYI
GM / GN / HODL
KYC / LAMBO
MEV / MM
NFT / NFA
OTC
REKT / ROI
SLASHING / SLLC
TA / TGEN / TXN
TWT / UTC / UX
WAGMI (We're All Gonna Make It!)
WEB3
```

---

## Conversões Úteis

```
1 ETH = 10^18 Wei
1 Gwei = 10^9 Wei
1 Wei = 0,000000000000000001 ETH

Exemplo de cálculo:
├─ Transação: 100.000 gas
├─ Gas price: 30 gwei
├─ Total: 100.000 * 30 = 3.000.000 gwei
├─ Em ETH: 3.000.000 / 10^9 = 0.003 ETH
└─ Em USD: 0.003 * $1,500 = $4.50
```

---

## Recursos para Aprender Mais

```
Definições simples:
- https://ethereum.org/en/glossary/
- https://coinmarketcap.com/crypto/glossary/

Mais técnicas:
- https://docs.openzeppelin.com/
- https://docs.soliditylang.org/

Comunidade:
- Discord Ethereum Builders
- Reddit r/ethereum
```

---

## 📈 Próximas Leituras

- **Links Úteis**: [19 - Links Úteis](./19-links-uteis.md)
- **Roadmap**: [20 - Roadmap](./20-roadmap.md)
- **FAQ**: [17 - FAQ](./17-faq.md)

---

**Resumo**: Glossário é seu amigo. Bookmark e volte quando encontrar termo novo. Crypto/Blockchain usa MUITO jargão. Normal estar confuso! 🎓
