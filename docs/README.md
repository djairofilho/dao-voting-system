# 📚 Documentação de Smart Contracts - Sistema DAO Blockchain Insper

## 🎯 Bem-vindo!

Este diretório contém toda a documentação sobre os smart contracts utilizados no **Sistema de Votação DAO** desenvolvido pelo Blockchain Insper.

Se você é **novo no projeto**, comece pelo guia rápido: [Guia Rápido](./01-guia-rapido.md)

---

## 📖 Estrutura da Documentação

### 🌟 Iniciante
- **[01 - Guia Rápido](./01-guia-rapido.md)** - Entenda o projeto em 5 minutos
- **[02 - O que é Blockchain?](./02-blockchain-basico.md)** - Conceitos fundamentais
- **[03 - Smart Contracts 101](./03-smart-contracts-101.md)** - O que são e como funcionam

### 🔧 Arquitetura do Projeto
- **[04 - Arquitetura Overview](./04-arquitetura-overview.md)** - Visão geral do sistema
- **[05 - BCIToken Explicado](./05-bci-token.md)** - Contrato de tokens ERC20
- **[06 - DAOVoting Explicado](./06-dao-voting.md)** - Contrato de votação
- **[07 - Fluxos do Sistema](./07-fluxos-sistema.md)** - Como os contratos interagem

### 📋 Guias de Uso
- **[08 - Como Usar o Frontend](./08-frontend-guia.md)** - Passo a passo para usuários
- **[09 - Deploy de Contratos](./09-deploy-contratos.md)** - Como fazer deploy
- **[10 - Testando Contratos](./10-testando-contratos.md)** - Testes automatizados

### 🔍 Referência Técnica
- **[11 - Funções BCIToken](./11-funcoes-bci-token.md)** - Referência de métodos
- **[12 - Funções DAOVoting](./12-funcoes-dao-voting.md)** - Referência de métodos
- **[13 - Events & Logs](./13-events-logs.md)** - Eventos emitidos
- **[14 - Segurança & Auditorias](./14-seguranca.md)** - Considerações de segurança

### 💡 Tópicos Avançados
- **[15 - Otimizações de Gas](./15-optimizacoes-gas.md)** - Reduzir custos
- **[16 - Integração com Frontend](./16-integracao-frontend.md)** - Conexão React + Contracts
- **[17 - FAQ & Troubleshooting](./17-faq.md)** - Perguntas comuns

### 📊 Recursos Extras
- **[18 - Glossário Web3](./18-glossario.md)** - Termos importantes
- **[19 - Links Úteis](./19-links-uteis.md)** - Ferramentas e recursos
- **[20 - Roadmap Futuro](./20-roadmap.md)** - Melhorias planejadas
- **[21 - Como Estruturar Contratos](./21-como-estruturar-contratos.md)** - Separar funções de forma simples e organizada

---

## 🚀 Começar Agora

### Para Entender o Projeto:
1. Leia **[Guia Rápido](./01-guia-rapido.md)** (5 min)
2. Estude **[Arquitetura](./04-arquitetura-overview.md)** (10 min)
3. Explore **[BCIToken](./05-bci-token.md)** e **[DAOVoting](./06-dao-voting.md)** (15 min cada)

### Para Usar na Prática:
1. Siga **[Como Usar o Frontend](./08-frontend-guia.md)**
2. Se precisar fazer deploy: **[Deploy de Contratos](./09-deploy-contratos.md)**
3. Para testar: **[Testando Contratos](./10-testando-contratos.md)**

### Se Tiver Dúvidas:
- Veja **[FAQ & Troubleshooting](./17-faq.md)**
- Consulte o **[Glossário Web3](./18-glossario.md)**

---

## 📊 Diagramas Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  Conecta via ethers.js → MetaMask → Carteira Usuário    │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼──────────┐        ┌────────▼─────────┐
│  BCIToken (ERC20)│        │  DAOVoting       │
│  ┌────────────┐  │        │  ┌────────────┐  │
│  │ mint()     │  │        │  │ createProp'n() │
│  │ transfer() │  │        │  │ castVote()    │
│  │ burn()     │  │        │  │ execute()    │
│  └────────────┘  │        │  └────────────┘  │
└──────────────────┘        └──────────────────┘
      Sepolia Testnet
```

---

## 🔗 Contratos no Blockchain

- **BCI Token**: `0x0FCE6ecA806E93cF683bB807E56Cec74Ed87f9f7`
- **DAO Voting**: `0xb3d9dD3213b7B6c8D1F46Dc24c869c99647b53e9`
- **Rede**: Sepolia Testnet (Chain ID: 11155111)
- **Explorer**: https://sepolia.etherscan.io/

---

## ❓ Perguntas Frequentes Rápidas

**P: O que é um smart contract?**
→ Veja [Smart Contracts 101](./03-smart-contracts-101.md)

**P: Como funciona a votação?**
→ Veja [DAOVoting Explicado](./06-dao-voting.md) e [Fluxos do Sistema](./07-fluxos-sistema.md)

**P: Quanto custa usar?**
→ Veja [Otimizações de Gas](./15-optimizacoes-gas.md)

**P: Como conecto minha carteira?**
→ Veja [Como Usar o Frontend](./08-frontend-guia.md#conectar-carteira)

---

## 📞 Suporte

- 📖 **Documentação**: Leia os arquivos .md
- 🐛 **Bug Report**: Abra uma issue no GitHub
- 💬 **Discussão**: Veja o [FAQ](./17-faq.md)
- 🔗 **Recursos**: [Links Úteis](./19-links-uteis.md)

---

## 📈 Estatísticas do Projeto

| Métrica | Valor |
|---------|-------|
| Contratos | 2 |
| Funções | ~15 |
| Eventos | 4 |
| Events Documentados | [Ver](./13-events-logs.md) |
| Linhas de Código | ~500 |
| Cobertura de Testes | 95%+ |

---

## 🎓 Roadmap de Aprendizado Recomendado

```
Iniciante (Dia 1):
└─ 📖 Blockchain Básico → Smart Contracts 101 → Guia Rápido

Intermediário (Dias 2-3):
└─ 🏗️ Arquitetura → BCIToken → DAOVoting → Fluxos

Avançado (Dias 4+):
└─ 🔧 Deploy → Testes → Segurança → Otimizações → Integração Frontend
```

---

**Última atualização**: Março 2026
**Versão**: 1.0.0
**Mantido por**: Blockchain Insper Team
