# 07 - Fluxos do Sistema 🔄

**Leitura: 10 minutos**

## Os 3 Fluxos Principais

### Fluxo 1: Criação de Proposta

```
USUÁRIO (com 100+ BCI)
    │
    └─► Frontend: "Criar Proposta"
        ├─ Título: "..."
        ├─ Descrição: "..."
        ├─ Período votação: 2 dias
        └─ [CONFIRMAR]
            │
            ▼
        MetaMask: "Assinar transação?"
            │ (usuario clica OK)
            ▼
        Smart Contract DAOVoting
            │
            ├─ Valida: tem 100+ BCI?
            ├─ Valida: título não vazio?
            ├─ Valida: descrição não vazia?
            ├─ Valida: período 1-30 dias?
            │
            ├─ ✅ TUDO OK
            │
            ├─ Cria proposta #N
            ├─ proposalCounter++
            ├─ Emite evento: ProposalCreated
            │
            ▼
        Blockchain Sepolia
            │ (confirmado em bloco)
            │
            ▼
        Frontend recebe evento
            │
            ├─ Mostra "✅ Proposta criada!"
            ├─ Atualiza lista de propostas
            └─ Link para Etherscan
```

**Tempo Total**: ~30 segundos a 2 minutos
**Custo**: ~100.000 gas (~R$0,20-R$0,50)

---

### Fluxo 2: Votação

```
USUÁRIO (com 1+ BCI)
    │
    └─► Frontend: Lista de Propostas
        │
        ├─ [Proposta #1: "Aumentar orçamento"]
        │  ├─ Status: Votação aberta
        │  ├─ Plazo: 1d 14h
        │  ├─ SIM: 500 votos
        │  ├─ NÃO: 300 votos
        │  └─ [VOTAR SIM] [VOTAR NÃO]
        │
        └─► Usuario clica [VOTAR SIM]
            │
            ▼
        Frontend: "Você tem X BCI"
            │
            └─► MetaMask: "Assinar voto?"
                │
                ▼
            Smart Contract DAOVoting.castVote()
                │
                ├─ Valida: votação ainda aberta?
                ├─ Valida: você já votou?
                ├─ Valida: você tem BCI?
                │
                ├─ ✅ TUDO OK
                │
                ├─ forVotes += seu_saldo_bci
                ├─ hasVoted[você] = true
                ├─ Emite evento: VoteCast
                │
                ▼
            Blockchain
                │
                ▼
            Frontend: "✅ Voto registrado!"
                │
                └─► Atualiza placar em tempo real
```

**Tempo Total**: ~20 segundos a 1 minuto
**Custo**: ~80.000 gas (~R$0,15-R$0,40)

---

### Fluxo 3: Execução de Proposta

```
PROPOSTA #1 (após prazo de votação)
    │
    ├─ Votação ENCERRADA
    ├─ SIM: 600 votos
    ├─ NÃO: 500 votos
    │
    └─► QUALQUER USUÁRIO clica "Executar"
        │
        ▼
        Frontend: daoVoting.executeProposal(1)
            │
            ▼
        Smart Contract
            │
            ├─ Verifica: votação terminou?
            ├─ Verifica: já foi executada?
            │
            ├─ ✅ OK!
            │
            ├─ Calcula: 600 > 500? SIM ✅
            ├─ Marca: executed = true
            ├─ Emite: ProposalExecuted(true)
            │
            ▼
        Blockchain
            │
            ▼
        Frontend
            │
            ├─ Proposta agora mostra: "✅ APROVADA"
            ├─ Link para Etherscan com resultado
            └─► Pode arquivar ou comentar
```

**Tempo Total**: ~1 minuto (após votação encerrar)
**Custo**: ~50.000 gas (~R$0,10-R$0,25)

---

## 🔀 Interação Entre Contratos

### Como BCIToken e DAOVoting se Comunicam

```
┌─────────────────────────────────────────────┐
│         USUÁRIO INTERAGE                    │
│  (via Frontend + MetaMask)                  │
└────────────────┬────────────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
    ┌────▼─────┐     ┌────▼────┐
    │ BCIToken │     │DAOVoting │
    └────┬─────┘     └────┬─────┘
         │                │
         │ 1. Consulta    │
         │ balanceOf()?   │
         │◄───────────────┤
         │                │
         │ "você tem"     │
         │ "100 BCI" ────►│
         │                │
         │                │ 2. OK! Cria proposta
         │                │
         │ 3. Alguém quer │
         │    votar       │
         │◄───────────────┤
         │                │
         │ balanceOf()    │
         │ verify? ────► │
         │                │
         │ "tem 500 BCI"  │
         │◄───────────────┤
         │                │
         │                │ 3. OK! Registra voto
         │                │
```

---

## 📊 Estados de Uma Proposta

```
CICLO DE VIDA

Estado 1: CRIADA (block 100 - 200)
├─ Existe no blockchain
├─ Depositante pagou gas
├─ Status: ⏳ Votação aberta
├─ forVotes = 0
├─ againstVotes = 0
└─ executed = false

Estado 2: VOTANDO (block 200 - 5000)
├─ Membros votam
├─ Placar muda constantemente
├─ Status: ⏳ Votação ainda aberta
├─ forVotes = aumenta
├─ againstVotes = aumenta
└─ executed = false

Estado 3: ENCERRADA (block 5000+, após endTime)
├─ Votação expirou
├─ Ninguém pode mais votar
├─ Resultado definido
├─ Status: ⏳ Aguardando execução
├─ forVotes = final
├─ againstVotes = final
└─ executed = false

Estado 4: EXECUTADA (após alguém chamar execute())
├─ Resultado permanente
├─ Status: ✅ APROVADA ou ❌ REJEITADA
├─ forVotes = final
├─ againstVotes = final
└─ executed = true
```

---

## 🎬 Timeline Real: Exemplo Completo

```
SEGUNDA 10:00
┌─────────────────────────────────┐
│ Alice cria proposta #1          │
│ Período: 2 dias                 │
│ Prazo: QUARTA 10:00             │
└─────────────────────────────────┘

SEGUNDA 11:00
┌─────────────────────────────────┐
│ Bob vota SIM                    │
│ Poder: 500 BCI                  │
│ Placar: 500 SIM, 0 NÃO          │
└─────────────────────────────────┘

SEGUNDA 15:00
┌─────────────────────────────────┐
│ Carol vota NÃO                  │
│ Poder: 750 BCI                  │
│ Placar: 500 SIM, 750 NÃO        │
└─────────────────────────────────┘

TERÇA 08:00
┌─────────────────────────────────┐
│ Dave vota SIM                   │
│ Poder: 200 BCI                  │
│ Placar: 700 SIM, 750 NÃO        │
└─────────────────────────────────┘

QUARTA 09:59
┌─────────────────────────────────┐
│ Votação ainda aberta             │
│ (1 minuto antes do fim)          │
│ Placar: 700 SIM, 750 NÃO        │
└─────────────────────────────────┘

QUARTA 10:00:01  ← Votação ENCERRA
┌─────────────────────────────────┐
│ ⏹️ FECHADO                       │
│                                 │
│ Resultado: 700 SIM vs 750 NÃO   │
│ Aprovada? 700 > 750? NÃO ✗      │
│                                 │
│ Status: ❌ REJEITADA            │
└─────────────────────────────────┘

QUARTA 14:00
┌─────────────────────────────────┐
│ Alguém executa proposta #1      │
│ Resultado confirmado             │
│ Permanente na blockchain        │
└─────────────────────────────────┘
```

---

## 🔗 Sequência de Eventos

### Proposta Criada

```javascript
// Frontend emite transação
daoVoting.createProposal(...)

// Blockchain:
emit ProposalCreated(
    proposalId: 1,
    proposer: 0x123...abc,
    title: "Aumentar orçamento",
    endTime: 1700000000
)

// Frontend escuta:
console.log("Proposta #1 criada!")
```

### Voto Registrado

```javascript
// Usuário vota
daoVoting.castVote(1, true)

// Blockchain:
emit VoteCast(
    proposalId: 1,
    voter: 0x456...def,
    support: true,
    tokens: 500
)

// Frontend:
console.log("500 votos SIM!")
```

### Proposta Executada

```javascript
// Após votação terminar
daoVoting.executeProposal(1)

// Blockchain:
emit ProposalExecuted(
    proposalId: 1,
    approved: false  // rejeitada
)

// Frontend:
console.log("Proposta rejeitada!")
```

---

## 📱 Fluxo Frontend

```
App.js
├─ [Conectar Carteira] ← WalletConnection
│
├─ [Abas Disponíveis]:
│  ├─ 📋 Propostas ← ProposalList
│  │  ├─ Carrega propostas do DAOVoting
│  │  ├─ Mostra placar
│  │  ├─ Botões: [VOTAR SIM] [VOTAR NÃO]
│  │
│  ├─ ➕ Nova Proposta ← CreateProposal
│  │  ├─ Form: título, descrição, dias
│  │  ├─ Verifica: tem 100+ BCI?
│  │  ├─ Botão: [CRIAR]
│  │
│  ├─ 💰 Distribuir Tokens ← TokenDistribution
│  │  ├─ (admin) Adiciona endereços
│  │  ├─ Confirma distribuição
│  │
│  └─ 💧 Obter Testnet ETH ← SepoliaFaucet
│     └─ Links para faucets
│
└─ NetworkSelector
   └─ Escolhe: Sepolia, Holesky, Localhost
```

---

## 🔀 Ordem de Operações Importante

### Cenário 1: ✅ Usuário PODE votar

```
1. ✅ Usuário conecta carteira
2. ✅ Frontend verifica: balanceOf() >= 1?
3. ✅ SIM! Mostra botões [VOTAR SIM/NÃO]
4. ✅ Usuário clica [VOTAR SIM]
5. ✅ Frontend checa: votação ainda aberta?
6. ✅ SIM! Coloca no blockchain
7. ✅ Contrato valida NOVAMENTE:
   ├─ Votação ainda aberta?
   ├─ Já votou?
   ├─ Tem BCI?
8. ✅ TUDO OK! Voto registrado
```

### Cenário 2: ❌ Usuário NÃO pode votar

```
1. ❌ Usuario não tem BCI
   └─ Frontend NÃO mostra botões
   └─ Mensagem: "Peça tokens a um admin"

2. ❌ Já votou
   └─ Contrato rejeita: "Already voted"
   └─ Erro no MetaMask

3. ❌ Votação encerrou
   └─ Frontend fecha form
   └─ Mostra: "Votação encerrada"

4. ❌ Não tem Sepolia ETH
   └─ MetaMask não consegue pagar gas
   └─ Erro: "Insufficient funds"
```

---

## 📊 Ordem de Custo (Mais Caro → Mais Barato)

```
1. Criar Proposta
   └─ ~100.000 gas (CARO)
   └─ Requer: 100+ BCI + ETH para gas

2. Votar
   └─ ~80.000 gas (MÉDIO)
   └─ Requer: 1+ BCI + ETH para gas

3. Executar Proposta
   └─ ~50.000 gas (BARATO)
   └─ Requer: ETH para gas

4. Consultar (view functions)
   └─ 0 gas (GRÁTIS)
   └─ Requer: nada!
   └─ Exemplos: getProposal(), balanceOf()
```

---

## 🎓 Próximas Leituras

- **Como usar**: [08 - Frontend Guia](./08-frontend-guia.md)
- **Deploy**: [09 - Deploy de Contratos](./09-deploy-contratos.md)
- **Testes**: [10 - Testando Contratos](./10-testando-contratos.md)

---

**Resumo**: Os 3 fluxos (criar → votar → executar) formam o ciclo completo de governança
