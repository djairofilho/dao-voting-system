# 21 - Como Estruturar Contratos de Forma Simples e Organizada 🧩

**Leitura: 10 minutos**

---

## 🎯 Objetivo

Este guia ensina um padrao simples para:
- Criar contratos sem virar bagunca
- Separar funcoes por responsabilidade
- Facilitar testes, manutencao e evolucao

Ideia principal:

**Cada contrato deve ter uma responsabilidade clara.**

---

## 🧠 Regra de Ouro

Antes de codar, responda:

1. Este contrato faz o que exatamente?
2. O que NAO deve estar nele?
3. Quem pode chamar cada funcao?
4. Quais eventos serao emitidos?

Se a resposta estiver confusa, a arquitetura ainda nao esta boa.

---

## 🏗️ Separacao Simples por Contrato

No seu projeto, um desenho limpo e:

- `BCIToken.sol`: token (saldo, transferencia, mint, burn)
- `DAOVoting.sol`: propostas e votacao
- (futuro) `Treasury.sol`: movimentacao de fundos
- (futuro) `AccessManager.sol`: permissoes/roles

Assim, cada modulo cuida de um assunto.

---

## 🧱 Separacao Simples por Tipo de Funcao

Dentro de cada contrato, organize nesta ordem:

1. **State variables**
2. **Events**
3. **Modifiers**
4. **Funcoes externas principais**
5. **Funcoes de leitura (view/pure)**
6. **Funcoes internas privadas**

Exemplo de esqueleto:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Example {
    // 1) State
    uint256 public counter;
    address public owner;

    // 2) Events
    event CounterIncremented(uint256 newValue);

    // 3) Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address initialOwner) {
        owner = initialOwner;
    }

    // 4) External write functions
    function increment() external onlyOwner {
        counter += 1;
        emit CounterIncremented(counter);
    }

    // 5) External read functions
    function getCounter() external view returns (uint256) {
        return counter;
    }

    // 6) Internal helpers
    function _isOwner(address user) internal view returns (bool) {
        return user == owner;
    }
}
```

---

## 📦 Padrao Pratico para Separar Funcoes

Use 3 grupos mentais:

### A) Comando (escreve estado)
- cria proposta
- vota
- executa proposta

Regra:
- validar entrada
- atualizar estado
- emitir evento

### B) Consulta (so leitura)
- listar proposta
- verificar se usuario votou
- total de propostas

Regra:
- sem side effects
- preferir `view` e `pure`

### C) Infra/Suporte (internas)
- validacoes internas
- calculos
- utilitarios

Regra:
- manter `internal` ou `private`
- evitar duplicacao

---

## 🔐 Permissoes Simples e Claras

Para cada funcao write, documente quem pode chamar:

- `onlyOwner`
- `onlyRole(...)`
- qualquer usuario

Exemplo curto:

```solidity
function mint(address to, uint256 amount) external onlyOwner {
    _mint(to, amount);
}

function castVote(uint256 proposalId, bool support) external {
    // qualquer usuario com saldo > 0
}
```

Se permissao nao estiver clara, o contrato fica perigoso.

---

## 🧪 Como isso melhora seus testes

Quando funcoes estao bem separadas, voce testa melhor:

1. Testes de comando:
- atualiza estado certo?
- emite evento?
- bloqueia quem nao pode?

2. Testes de consulta:
- retorna dados corretos?
- edge cases (id invalido, vazio)?

3. Testes de seguranca:
- reverte quando necessario?
- previne reentrancia e duplicidade?

---

## 📁 Estrutura de Pastas Recomendada (Foundry)

```text
contracts/
├─ src/
│  ├─ BCIToken.sol
│  ├─ DAOVoting.sol
│  ├─ interfaces/
│  │  └─ IDAOVoting.sol
│  ├─ libraries/
│  │  └─ Errors.sol
│  └─ utils/
│     └─ Validation.sol
├─ script/
│  └─ Deploy.s.sol
└─ test/
   ├─ BCIToken.t.sol
   ├─ DAOVoting.t.sol
   └─ integration/
      └─ VotingFlow.t.sol
```

---

## ✅ Checklist Rápido (Use Antes de Commit)

- Cada contrato tem uma responsabilidade?
- Funcoes estao divididas em comando/consulta/suporte?
- Toda funcao write emite evento util?
- Permissao de cada write esta explicita?
- Nomes estao claros (`createProposal`, `castVote`, `executeProposal`)?
- Existem testes para sucesso e falha?

Se respondeu "sim" para quase tudo, voce esta em um caminho muito bom.

---

## 🚀 Plano de Evolucao Simples (Sem Reescrever Tudo)

### Fase 1
- Padronizar ordem interna das funcoes
- Renomear funcoes confusas
- Adicionar eventos faltantes

### Fase 2
- Extrair validacoes repetidas para funcoes internas
- Criar interfaces para contratos principais

### Fase 3
- Quebrar modulos grandes (ex: tesouraria separada)
- Introduzir roles mais finas

---

## 🔗 Leia Depois

- [04 - Arquitetura Overview](./04-arquitetura-overview.md)
- [06 - DAOVoting](./06-dao-voting.md)
- [10 - Testando Contratos](./10-testando-contratos.md)
- [14 - Segurança](./14-seguranca.md)

---

**Resumo**: para manter simples e organizado, separe por responsabilidade (contratos) e por tipo de funcao (comando, consulta, suporte). Isso reduz bugs e deixa evoluir sem caos.