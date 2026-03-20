# 02 - O que é Blockchain? 🔗

**Leitura: 8 minutos**

## Explicação Simples

Blockchain é como um **livro de registros compartilhado que ninguém pode apagar ou falsificar**.

### Comparação: Banco vs Blockchain

| Aspecto | Banco Tradicional | Blockchain |
|--------|------------------|-----------|
| **Quem controla?** | Um banco central | Todos os participantes |
| **Como registra?** | Servidor central | Múltiplos computadores |
| **Pode apagar?** | Sim (admin pode deletar) | Não (criptografia impede) |
| **Segurança** | Confia em senhas | Confia em criptografia |
| **Transparência** | Você vê seu saldo | VOCÊ VÊ TUDO! |

---

## 🧱 Como Funciona (Explicação Visual)

### Bloco = Página do Livro

```
┌─────────────────────────────────────┐
│        BLOCO #1 (Página 1)          │
├─────────────────────────────────────┤
│ Tempo: 2026-03-20 10:00:00          │
│                                     │
│ Transação 1: Alice → Bob: 10 coins   │
│ Transação 2: Bob → Carol: 5 coins    │
│ Transação 3: Carol → Alice: 2 coins  │
│                                     │
│ Hash: 0xAB3F4C5...                 │
│ (assinatura digital do bloco)       │
└─────────────────────────────────────┘
           ↓ (conectado ao anterior)
┌─────────────────────────────────────┐
│        BLOCO #2 (Página 2)          │
├─────────────────────────────────────┤
│ Hash anterior: 0xAB3F4C5...         │
│                                     │
│ Transação 1: Alice → Dave: 3 coins   │
│ ...                                 │
│                                     │
│ Hash: 0x9F7E2D1...                 │
└─────────────────────────────────────┘
           ↓ (conectado ao anterior)
       ... próximos blocos ...
```

**Propriedade Importante**: Se alguém tentar mudar uma transação no Bloco #1:
- O hash do Bloco #1 muda
- Isso quebra o link com Bloco #2
- Bloco #2 invalida
- E assim sucessivamente...

**Resultado**: É praticamente impossível falsificar históricos!

---

## 👥 Descentralização

### Modelo Centralizado (Banco)
```
┌────────────────────────┐
│                        │
│  BANCO CENTRAL         │  ← Um servidor controla tudo
│  (confia em mim?)      │
│                        │
└────────────┬───────────┘
      ↑      │      ↑
   Você  Você  Você
```

### Modelo Descentralizado (Blockchain)
```
    Você      Eu      Amigo    Desconhecido
      ↓       ↓        ↓          ↓
    ┌─────────────────────────────┐
    │  REDE DE BLOCKCHAIN         │
    │  (ninguém controla)         │
    │                             │
    │ ✓ Sincronizado              │
    │ ✓ Seguro                    │
    │ ✓ Transparente              │
    └─────────────────────────────┘
```

---

## 🔐 Criptografia (Segurança)

### Hash (Impressão Digital)

```python
# SHA-256 (algoritmo usado em blockchain)

input: "Alice enviou 10 BCI para Bob"
output: 0x3f9e7c4a2b1d5e8f9c7a6b5e4d3c2b1a0f9e8d7c

# Qualquer mudança mínima:
input: "Alice enviou 11 BCI para Bob"  # mudou 1 número!
output: 0x8c9f7a6e5d4c3b2a1f9e8d7c6b5a4f3e2d1c0b9a

# Totalmente diferente! Detecta falsificação
```

### Assinatura Digital

```
Você cria uma mensagem:
"Envio 100 BCI para João"

Seu computador:
1. Cria hash da mensagem
2. Criptografa com sua chave privada
3. Resultado = sua assinatura

Rede verifica:
1. Descriptografa assinatura (com sua chave pública)
2. Confere se hash bate
3. ✅ É realmente você!
```

---

## 📊 Exemplo Real: Sua Transação

```
Você clica "Enviar 50 BCI"
         ↓
Seu navegador cria transação:
├─ De: 0x123...abc (sua carteira)
├─ Para: 0x456...def (carteira do amigo)
├─ Valor: 50 BCI
└─ Gas fee: 0.001 ETH

         ↓
Sua carteira ASSINA com chave privada
(só você tem esta chave)

         ↓
Transação vai para MEMPOOL (fila)
(milhares de transações esperando)

         ↓
Mineradores/Validadores pegam transação
Verificam: "É assinatura válida? Tem saldo?"
✅ Sim!

         ↓
Incluso no bloco novo
Bloco é adicionado à blockchain

         ↓
CONFIRMADO!
Seu amigo agora tem +50 BCI
Você tem -50 BCI
(permanentemente registrado para sempre)
```

---

## 🔍 Ethereum (Nossa Rede)

Ethereum é um **blockchain que permite programas** (chamados smart contracts).

```
Bitcoin: 💰 Apenas transações (moeda)
         └─ "A enviou 10 para B"

Ethereum: 💻 Transações + Programas
          ├─ "A enviou 10 para B"
          ├─ Execute função criar_proposta()
          ├─ Execute função votar()
          └─ "Se votos > 50%, aprova"
```

### Sepolia (Nossa Testnet)

```
MAINNET (Real)
└─ ETH = $$$
└─ Transações de verdade
└─ Blockchain Ethereum oficial

SEPOLIA TESTNET (Teste)
└─ ETH = R$ 0 (grátis!)
└─ Blockchain idêntica (mas teste)
└─ Perfeita para aprender
```

---

## 💾 Gas (Combustível)

Cada ação na blockchain **custa "gas"**:

```
Ação                    Gas Típico      Custo (Sepolia)
─────────────────────────────────────────────────────
Transfer token          65.000 gas      ≈ poucos centavos
Create proposal         100.000 gas     ≈ menos de 1 real
Vote (sim/não)          80.000 gas      ≈ menos de 1 real
```

**Por que existe gas?**
- Evita spam (ações custam algo)
- Paga mineradores/validadores
- Se não houvesse, alguém mandaria bilhões de transações

---

## 🔑 Conceitos-Chave

| Termo | Explicação |
|-------|-----------|
| **Bloco** | Conjunto de transações agrupadas |
| **Hash** | Impressão digital criptográfica |
| **Chave Privada** | Senha que ONLY você tem (nunca compartilhe!) |
| **Chave Pública** | Seu endereço (tipo email - pode publicar) |
| **Transação** | Movimentação de fundos/dados |
| **Smart Contract** | Programa que roda na blockchain |
| **Gas** | Combustível para executar ações |
| **Block Explorer** | Website que mostra blockchain (etherscan.io) |
| **Testnet** | Versão de teste (sem dinheiro real) |

---

## 🎯 Blockchain vs Banco Lado a Lado

```
PROBLEMA: Você quer saber se alguém mentiu

💳 BANCO:
   "Confie em mim, aqui está seu extrato"
   ← Tem que confiar no banco

⛓️ BLOCKCHAIN:
   "Aqui está o histórico todo assinado e verificado"
   ← Você pode verificar tudo!
```

---

## 🚀 Próximo Nível

Agora que entendeu blockchain:
- Leia [03 - Smart Contracts 101](./03-smart-contracts-101.md)
- Veja o projeto: [04 - Arquitetura Overview](./04-arquitetura-overview.md)

---

**Resumo**: Blockchain = banco descentralizado + segurança criptográfica + transparência total
