# 17 - FAQ (Respostas às Dúvidas) ❓

**Leitura: 8 minutos**

---

## 💰 Perguntas sobre Tokens

### P1: Quanto BCI preciso para votar?

**R:** Mínimo **1 BCI** para votar. Sua força de voto = quantos BCI você tem.

```
Exemplo:
Alice tem 100 BCI → 100 votos
Bob tem 50 BCI → 50 votos
Se ambos votam SIM em proposta, SIM ganha 150 votos
```

### P2: Quanto BCI preciso para criar proposta?

**R:** Mínimo **100 BCI** para criar proposta. Você não "gasta" os BCI, só precisa ter!

```
Alice tem 100 BCI
Alice cria proposta
Alice ainda tem 100 BCI (não foram gastos)
```

### P3: Posso transferir meus BCI durante votação?

**R:** **Sim, mas seu voto não muda!** Seu poder de voto é "snapshot" no momento que votou.

```
1. Alice tem 100 BCI
2. Alice vota SIM (poder = 100)
3. Alice transfere 50 BCI para Bob
4. Alice agora tem 50 BCI
5. MAS voto dela ainda conta como 100 votos!

Isso é por segurança (previne ataques)
```

### P4: Como obtenho BCI?

**R:** Peça a um admin. No frontend: aba "💰 Distribuir Tokens (Admin)".

```
Admin clica na aba
Coloca seu endereço + quantidade
Admin clica "DISTRIBUIR"
Você recebe!
```

---

## 🗳️ Perguntas sobre Votação

### P5: Posso mudar meu voto?

**R:** **Não!** Uma vez votado, é permanente na blockchain.

```
Razão: Segurança + Transparência
Não queremos manipulação de votos
```

### P6: Por quanto tempo a votação fica aberta?

**R:** Depende do criador. Pode ser 1 a 30 dias. Padrão é 3 dias.

```
Criador escolhe: 1 a 30 dias
Exemplo típico: 3 dias
Após expirar: não pode mais votar
```

### P7: Quem pode executar a proposta?

**R:** **Qualquer um!** Depois que votação expirar, qualquer pessoa clica "⚡ EXECUTAR".

```
Não precisa ser criador da proposta
Não precisa ter votado
Qualquer endereço pode
```

### P8: Como saber resultado da votação?

**R:** Após votação expirar, clique "⚡ EXECUTAR". Sistema compara SIM vs NÃO.

```
Se SIM > NÃO → Proposta APROVADA
Se NÃO ≥ SIM → Proposta REJEITADA
Se empate (raro) → SIM vence (padrão)
```

---

## ⛽ Perguntas sobre Gas e Custos

### P9: Quanto custa votar?

**R:** Varia, mas típico é **~80.000 gas**. Com gas price de 30 gwei = ~$2 USD.

```
formula: gas * gwei_price = wei
         80000 * 30 = 2.400.000 wei
         = 0.0024 ETH
         = ~$2 USD
         
Sepolia = testnet = grátis!
Mainnet = real money
```

### P10: Quanto custa criar proposta?

**R:** Típico é **~100.000 gas** = ~$2.50 USD (Sepolia = grátis).

```
Mais caro que votar porque:
- Escreve mais dados no storage
- Inicializa estrutura nova
```

### P11: Como economizar gas?

**R:** Não há muito que fazer no frontend, mas:

```
1. Votar em massa (em 1 tx)
2. Usar blockchain que for mais barato
   (Polygon < Sepolia eth-wise)
```

---

## 🔗 Perguntas sobre Redes

### P12: Posso usar em Mainnet?

**R:** **Tecnicamente sim, mas cuidado!** Mainnet = dinheiro real.

```
NUNCA use Mainnet sem auditoria!
Nosso contrato é de TESTE

Hoje: Use Sepolia (testnet) apenas
Futuro: Auditoria → Mainnet com cabeça fria
```

### P13: Qual rede é melhor: Sepolia ou Holesky?

**R:** **Sepolia** é mais popular e tem mais faucets. Use Sepolia.

```
Sepolia:
✅ Mais nodes
✅ Mais ativo
✅ Faucets abundantes
✅ Recomendado

Holesky:
✅ Novo (mais rápido)
✅ Menos congestionado
❌ Menos faucets
```

### P14: Posso usar Localhost?

**R:** **Sim!** Melhor para desenvolvimento local.

```
1. Rode: anvil (inicia blockchain local)
2. Switched para Localhost na UI
3. Deploy contratos
4. Teste de verdade LOCALMENTE!

Benefícios:
✅ Quase instantâneo
✅ 10000 ETH grátis por conta
✅ Sem depender de faucets
✅ Melhor para debug
```

---

## 🔑 Perguntas sobre Segurança

### P15: Minha chave privada é segura no frontend?

**R:** **Não coloque chave privada no frontend!** Use MetaMask.

```
❌ ERRADO:
const privateKey = "0xabc...";  // NO CÓDIGO!

✅ CORRETO:
// Deixe MetaMask gerenciar
// Frontend só assina com MetaMask.request()
```

### P16: O que é esse aviso "Conectar à carteira"?

**R:** Você está autorizando o site a:
- Ver seu endereço
- Ver seus saldos
- **Não**: puxar dinheiro (só você aprova cada transação)

```
Cuidado com sites maliciosos!
- Clique "Conectar" APENAS em sites confiáveis
- Cada transação requer sua aprovação
```

### P17: E se perder minha frase de recuperação?

**R:** **Sua carteira é perdida para sempre!** Não há "recuperar".

```
BACKUP essencial:
1. Escreva frase 12-24 palavras em papel
2. Guarde em lugar seguro (cofre?)
3. NUNCA digite em site suspeito
4. NUNCA compartilhe com ninguém
```

---

## 🐛 Perguntas sobre Erros Comuns

### P18: "Votação Encerrada" - o que significa?

**R:** Período de votação expirou. Ninguém mais pode votar.

```
Próximo passo: Clique "⚡ EXECUTAR" para ver resultado
```

### P19: "Já Votou" - por que não deixa votar de novo?

**R:** Blockchain é transparente! Sistema previne duplicatas de voto.

```
1 pessoa = 1 voto por proposta = Final!

Se votou errado:
- Desculpa, votou. Fica assim.
- Crie proposta NOVA para "corrigir"
```

### P20: "Saldo Insuficiente" na criação de proposta

**R:** Você tem < 100 BCI. Precisa 100 para criar.

```
Soluções:
1. Peça admin distribuir 100 BCI
2. Ou compre tokens (em mainnet apenas)
```

### P21: "Saldo insuficiente" para pagar gas

**R:** Precisa ETH testnet (não BCI!). Use faucet.

```
├─ Sepolia ETH ≠ Sepolia BCI
├─ ETH = para pagar "gasolina" (gas)
├─ BCI = token de votação
└─ Precisa AMBOS!

Solução: Tab "💧 Obter Sepolia ETH" → pega grátis
```

---

## 💻 Perguntas sobre Desenvolvimento

### P22: Como faço deploy em produção?

**R:** **Não recomendado ainda!** Sistema é TESTE. Passos:

```
1. Auditoria de segurança (externa)
2. Testes mais agressivos (fuzzing)
3. Insurance/proteção
4. Deploy em Mainnet (com $$ real)
5. Marketing
```

### P23: Como mudo os endereços dos contratos?

**R:** Em `frontend/src/utils/contracts.js`, seção `ADDRESSES`.

```javascript
const ADDRESSES = {
    sepolia: {
        bciToken: '0x1234...',    // ← mude aqui
        daoVoting: '0x5678...',   // ← mude aqui
    }
}
```

### P24: Como adiciono nova ata eventos?

**R:** Veja [16 - Integração Frontend](./16-integracao-frontend.md#ouvir-eventos).

```javascript
// Adicione novo listener:
dao.on("ProposalExecuted", (propId, approved) => {
    console.log(`Proposta ${propId} ${approved ? 'APROVADA' : 'REJEITADA'}`);
});
```

---

## 🎯 Perguntas sobre Usar o Produto

### P25: Como faço uma proposta?

**R:** Tab "➕ Registrar Nova Proposta". Preencha:

```
1. Título (até 100 caracteres)
2. Descrição (até 500 caracteres)
3. Período de votação (1-30 dias)
4. Clique [➕ CRIAR PROPOSTA]
5. Aprove no MetaMask
6. ✅ Proposta criada!
```

### P26: Posso deletar proposta?

**R:** **Não!** Blockchain é permanente. Tudo fica registrado para sempre.

```
Dica: Crie apenas propostas bem pensadas
      Qualidade > Quantidade
```

### P27: Como vejo histórico de votações?

**R:** Tab "📋 Consultar Propostas" mostra TODAS (passadas e atuais).

```
Cada proposta mostra:
✅ Votos SIM
❌ Votos NÃO
⏱️ Tempo restante
🔗 Link para Etherscan
```

---

## 🚀 Próximas Etapas

### P28: E agora, o que faço?

**R:** Escolha seu caminho:

```
Se quer USAR:
1. [08 - Frontend](./08-frontend-guia.md)
2. Distribua tokens
3. Crie primeira proposta!
4. Vote!

Se quer DESENVOLVER:
1. [09 - Deploy](./09-deploy-contratos.md)
2. [10 - Testes](./10-testando-contratos.md)
3. [14 - Segurança](./14-seguranca.md)
4. Modifique contratos
5. Redeploye

Se quer APRENDER:
1. [02 - Blockchain Básico](./02-blockchain-basico.md)
2. [03 - Smart Contracts](./03-smart-contracts-101.md)
3. [18 - Glossário](./18-glossario.md)
```

---

## 📚 Índice de Respostas Rápidas

```
Tokens:
├─ P1: Quanto BCI para votar?      → 1 BCI
├─ P2: Quanto para criar proposta? → 100 BCI
├─ P3: Posso transferir durante votação? → Sim, voto não muda
└─ P4: Como obtenho BCI? → Pedir admin

Votação:
├─ P5: Posso mudar voto? → Não
├─ P6: Quanto tempo votação fica aberta? → 1-30 dias (criador escolhe)
├─ P7: Quem pode executar? → Qualquer um
└─ P8: Como vejo resultado? → Clique EXECUTAR

Gas:
├─ P9: Quanto custa votar? → ~$2 (80k gas)
├─ P10: Quanto custa proposta? → ~$2.50 (100k gas)
└─ P11: Como economizar? → Pouco no frontend

Redes:
├─ P12: Posso usar Mainnet? → Não (sem auditoria)
├─ P13: Sepolia ou Holesky? → Sepolia
└─ P14: Localhost? → Sim! Melhor para dev

Segurança:
├─ P15: Chave privada no frontend? → Nunca!
├─ P16: Aviso "Conectar Carteira"? → Normal, aprove
└─ P17: Perdi frase 12 palavras? → Carteira perdida

Erros:
├─ P18: "Votação Encerrada"? → Pode executar
├─ P19: "Já Votou"? → 1 voto por proposta
├─ P20: "Saldo insuficiente" BCI? → Pedir admin
└─ P21: "Saldo insuficiente" ETH? → Usar faucet

Dev:
├─ P22: Deploy em produção? → Não ainda, precisa auditoria
├─ P23: Mudar endereços? → contracts.js
└─ P24: Adicionar eventos? → Ver doc 16

Uso:
├─ P25: Como fazer proposta? → Tab ➕ Registrar
├─ P26: Deletar proposta? → Não, permanente
└─ P27: Ver histórico? → Tab 📋 Consultar
```

---

## 📈 Próximas Leituras

- **Glossário**: [18 - Glossário](./18-glossario.md)
- **Links Úteis**: [19 - Links Úteis](./19-links-uteis.md)
- **Roadmap**: [20 - Roadmap](./20-roadmap.md)

---

**Resumo**: Não tem pergunta boba. Blockchain é novo, confuso, mas poderoso. Pergunte antes de clicar! 🚀
