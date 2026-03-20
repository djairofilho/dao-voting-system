# 08 - Como Usar o Frontend 🎨

**Leitura: 12 minutos**

## Pré-requisitos

✅ MetaMask instalado
✅ Conectado em Sepolia testnet
✅ ETH testnet (obtenha em "Obter Sepolia ETH")
✅ BCI tokens (peça ao admin)

---

## 🚀 Começar: Passo a Passo

### Passo 1: Abrir Aplicação

```
1. npm start (no diretório frontend)
2. Abre http://localhost:3000
3. Vê tela com "🗳️ Sistema de Votação DAO"
```

### Passo 2: Conectar Carteira

```
┌─────────────────────────────────┐
│ [🔗 Conectar Carteira]          │
└─────────────────────────────────┘
            ↓ Clique
        ↓
MetaMask pop-up: "Conectar?"
            ↓ Aprove
        ↓
Frontend mostra:
├─ 0x123...abc (seu endereço)
├─ 0.5 ETH (seu saldo)
├─ 100 BCI (seu saldo token)
```

**O que acontece nos bastidores**:
```javascript
// Frontend
const accounts = await window.ethereum.request({
  method: 'eth_requestAccounts'
});
setConnectedAccount(accounts[0]);  // 0x123...abc

// Pega saldo de ETH
const balance = await provider.getBalance(accounts[0]);

// Pega saldo de BCI
const bciBalance = await bciToken.balanceOf(accounts[0]);
```

---

## 📋 Aba: Consultar Propostas

### O que Você Vê

```
┌─────────────────────────────────────────┐
│ 📋 Consultar Propostas                  │
├─────────────────────────────────────────┤
│                                         │
│ [Proposta #1]                           │
│ ├─ Título: "Aumentar orçamento"        │
│ ├─ Descrição: "Alocar 5% adicional"    │
│ ├─ Votação: 1d 14h39m (ainda aberta)   │
│ ├─ ✅ SIM: 600 votos                   │
│ ├─ ❌ NÃO: 500 votos                   │
│ ├─ Propositor: 0x123...abc             │
│ ├─ [📊 Ver no Etherscan]               │
│ ├─ [✅ VOTAR SIM] [❌ VOTAR NÃO]       │
│ └─ Status: Seu voto: ⏳ Ainda não votou│
│                                         │
│ [Proposta #2]                           │
│ ├─ Título: "Nova sede em São Paulo"    │
│ ├─ Votação: ENCERRADA                  │
│ ├─ ✅ SIM: 450                         │
│ └─ [⚡ EXECUTAR]                       │
│                                         │
└─────────────────────────────────────────┘
```

### Como Votar

```
Clique em [✅ VOTAR SIM] ou [❌ VOTAR NÃO]
        ↓
MetaMask: "Você está assinando uma transação"
├─ Para: DAOVoting contract
├─ Gás: ~80.000
├─ [Cancelar] [Confirmar]
        ↓ (clique Confirmar)
        ↓
Aguarde ~30 segundos
        ↓
✅ Seu voto foi registrado!
```

### Como Executar Proposta

```
Se votação expirou:
        ↓
Clique [⚡ EXECUTAR]
        ↓
MetaMask: Confirmar?
        ↓
✅ Proposta executada!
   Resultado: ✅ APROVADA ou ❌ REJEITADA
```

---

## ➕ Aba: Registrar Nova Proposta

### O que Você Preenche

```
┌─────────────────────────────────────────┐
│ ➕ Registrar Nova Proposta              │
├─────────────────────────────────────────┤
│                                         │
│ Título: [________________]              │
│ "Máx 100 caracteres"                   │
│                                         │
│ Descrição: [__________________]        │
│ [                                  ]   │
│ [  Máx 500 caracteres           ]     │
│ [__________________]                   │
│                                         │
│ Período de Votação: [__] dias          │
│ "Entre 1 e 30 dias"                   │
│                                         │
│ Status: Você tem 100 BCI ✅            │
│ Número de propostas: 42                │
│                                         │
│ [➕ CRIAR PROPOSTA]                    │
│                                         │
└─────────────────────────────────────────┘
```

### Exemplo de Preenchimento

```
Título:
"Aumentar investimento em blockchain"

Descrição:
"Aumentar orçamento anual de 2% para 7% para 
pesquisa e desenvolvimento em tecnologia blockchain. 
Isso permitirá: 1) Mais time, 2) Melhores ferramentas,
3) Publicações científicas."

Período:
3 (dias)

Ao clicar [➕ CRIAR PROPOSTA]:
        ↓
MetaMask: Confirmar?
        ↓
Aguarde...
        ↓
✅ Proposta #43 criada com sucesso!
   Link: https://sepolia.etherscan.io/tx/0x...
```

### Validações

```
❌ Se título vazio:
   Erro: "Título é obrigatório"

❌ Se descrição vazia:
   Erro: "Descrição é obrigatória"

❌ Se período < 1 dia:
   Erro: "Mínimo 1 dia de votação"

❌ Se período > 30 dias:
   Erro: "Máximo 30 dias de votação"

❌ Se tem < 100 BCI:
   Erro: "Precisa de 100+ BCI para criar proposta"

✅ Se tudo ok:
   Vai para o blockchain!
```

---

## 💰 Aba: Distribuir Tokens (Admin Only)

### Visibilidade

```
Se você for Admin (dono da carteira):
        ↓
Vê aba: 💰 Distribuir Tokens (Admin)
        ↓
Pode adicionar múltiplos endereços

Se você NÃO for Admin:
        ↓
Não vê esta aba
```

### Interface

```
┌─────────────────────────────────────────┐
│ 💰 Distribuir Tokens BCI (Admin)        │
├─────────────────────────────────────────┤
│                                         │
│ Sua carteira: 0x123...abc ✅ Admin      │
│                                         │
│ Adicionar destinatários:                │
│                                         │
│ 1. [0x789...xyz] [100 BCI] [❌]        │
│ 2. [0xABC...def] [250 BCI] [❌]        │
│ 3. [0x456...ghi] [150 BCI] [❌]        │
│                                         │
│ [+ Adicionar Endereço]                  │
│                                         │
│ Resumo:                                 │
│ Total: 500 BCI para 3 pessoas           │
│                                         │
│ [💸 DISTRIBUIR TOKENS]                 │
│                                         │
└─────────────────────────────────────────┘
```

### Passo a Passo

```
1. Digita endereço: 0x123...abc
2. Digita quantidade: 100
3. Clica [+ Adicionar]
4. Repite para mais pessoas
5. Clica [💸 DISTRIBUIR TOKENS]
6. MetaMask pede confirmação
7. ✅ Distribuição concluída!

Cada pessoa recebe seus tokens!
```

---

## 💧 Aba: Obter Sepolia ETH

### Interface

```
┌─────────────────────────────────────────┐
│ 💰 Obter Sepolia ETH de Teste           │
├─────────────────────────────────────────┤
│                                         │
│ Seu endereço (copiar):                  │
│ ┌─────────────────────────────────────┐ │
│ │ 0x123...abc                         │ │
│ └─────────────────────────────────────┘ │
│ [📋 COPIAR]                             │
│                                         │
│ Faucets disponíveis:                    │
│                                         │
│ [⚡ Alchemy Faucet] → 0.5 ETH           │
│ Requer conta Alchemy (recomendado)     │
│                                         │
│ [🔷 Infura Faucet] → 1 ETH             │
│ Requer conta Infura                    │
│                                         │
│ [🦷 Grabteeth] → 0.1 ETH                │
│ Sem login (mais rápido)                │
│                                         │
│ [💧 Sepolia Faucet] → 0.5 ETH          │
│ Sem login                              │
│                                         │
│ ⚠️ Sepolia ETH é GRÁTIS e só para     │
│    testes. Sem valor real!             │
│                                         │
└─────────────────────────────────────────┘
```

### Como Usar

```
1. Clica [🦷 Grabteeth] (mais rápido)
2. Abre em novo site
3. Cola seu endereço (clique [📋 COPIAR])
4. Espera 30-60 segundos
5. ✅ Pronto! Tem 0.1 ETH testnet

Agora pode pagar as taxas de transação!
```

---

## 🌐 Seletor de Rede

### Onde Fica

```
Topo da página:

┌─────────────────────────────────────────┐
│ [Sepolia] [Holesky] [Localhost]        │
│ ← escolha qual rede usar               │
└─────────────────────────────────────────┘
```

### Como Usar

```
Padrão: Sepolia

Para trocar:
1. Clica [Holesky]
2. Confirmação do MetaMask
3. Página recarrega
4. ✅ Agora usa Holesky

(Todos os contratos mudam automaticamente)
```

---

## 📊 Diagnostico da Conexão

### Ver Status

```
Topo da página aparece:

🔧 Diagnóstico da Conexão
┌─────────────────────────────────┐
│ ✅ Rede: Sepolia                │
│ ✅ RPC URL: Conectada           │
│ ✅ Contratos: Configurados      │
│ ✅ MetaMask: Detectado          │
│                                 │
│ 🟢 Sistema OK!                  │
│ [🔄 Revalidar]                  │
└─────────────────────────────────┘

Se algo falhar:
├─ ❌ RPC URL indisponível
├─ ❌ Endereços dos contratos não definidos
└─ ❌ MetaMask não encontrado
    → Veja FAQ para soluções
```

---

## ⚠️ Erros Comuns e Soluções

### Erro: "MetaMask não encontrado"
```
Solução:
1. Instale MetaMask: https://metamask.io
2. Conecte sua carteira
3. Recarregue a página
```

### Erro: "Saldo insuficiente"
```
Solução 1: Precisa de BCI?
└─ Peça a um admin distribuir tokens

Solução 2: Precisa de ETH para gas?
└─ Use "💧 Obter Sepolia ETH"
└─ Klique em um faucet
```

### Erro: "Já votou"
```
Solução:
Você não pode mudar seu voto
Uma vez votado, é permanente
(Isso é segurança blockchain!)
```

### Erro: "Votação encerrada"
```
Pergunta: "Por que expirou?"
Resposta: Período acabou (ex: 2 dias passaram)

O que fazer:
- Se quer executar: clique [⚡ EXECUTAR]
- Se quer votar: crie outra proposta
```

### Erro: "Transaction failed"
```
Causas possíveis:
1. Saldo insuficiente
2. Gas price muito alto
3. Contrato em erro
4. Rede indisponível

Solução:
1. Verifique saldo (ETH + BCI)
2. Tente novamente em 1 minuto
3. Veja Etherscan para detalhes
```

---

## 💡 Dicas Pro

✅ **Dica 1: Executar Proposta**
Qualquer um pode executar (não precisa ser admin)
Apenas clique [⚡ EXECUTAR] após votação expirar

✅ **Dica 2: Ver na Blockchain**
Cada ação gera link [📊 Ver no Etherscan]
Você vê TODOS os dados permanentemente registrados

✅ **Dica 3: Gas Otimizado**
Criar proposta = mais caro
Votar = mais barato
Consultar = grátis!

✅ **Dica 4: Múltiplos Votos**
Uma pessoa = um voto por proposta
NOVO: em propostas diferentes, pode votar novamente

✅ **Dica 5: Transparência**
Seu voto é PÚBLICO e PERMANENTE
Ninguém pode deletar ou mudar histórico

---

## 🎓 Primeira Experiência Completa

### 5 Minutos de Teste

```
1. Conecta carteira (1 min)
   └─ [🔗 Conectar Carteira]

2. Obtém ETH testnet (1 min)
   └─ Tab [💧 Obter Sepolia ETH]
   └─ Clica Grabteeth

3. Recebe tokens BCI (1 min)
   └─ Admin distribui 100 BCI

4. Cria proposta (1 min)
   └─ Tab [➕ Nova Proposta]
   └─ Título: "Test"
   └─ Descrição: "Test"
   └─ Dias: 1
   └─ [➕ CRIAR]

5. Vota em proposta (1 min)
   └─ Tab [📋 Propostas]
   └─ [✅ VOTAR SIM]

Total: 5 minutos! 🎉
Parabéns, você fez seu primeiro DAO vote!
```

---

## 🎓 Próximas Leituras

- **Entender fluxos**: [07 - Fluxos do Sistema](./07-fluxos-sistema.md)
- **Fazer deploy**: [09 - Deploy de Contratos](./09-deploy-contratos.md)
- **Dúvidas?**: [17 - FAQ](./17-faq.md)

---

**Resumo**: Frontend=interface amigável sobre smart contracts. Tudo que você clica vira transação blockchain!
