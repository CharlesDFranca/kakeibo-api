# Kakeibo (家計簿)

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge\&logo=nestjs\&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge\&logo=typescript\&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge\&logo=postgresql\&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge\&logo=redis\&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge\&logo=docker\&logoColor=white)

API para gerenciamento financeiro pessoal desenvolvida com **NestJS**, seguindo princípios de **Domain-Driven Design (DDD)** e **Clean Architecture**.

O nome do projeto é inspirado no **Kakeibo**, o método tradicional japonês de organização financeira que busca trazer consciência e intenção para o uso do dinheiro.

Seguindo essa filosofia, a aplicação é organizada em contextos de negócio independentes, com responsabilidades bem definidas:

* **Identity:** identidade, usuários e autenticação.
* **Finance:** registro e gerenciamento da vida financeira atual.
* **Planning:** planejamento financeiro e objetivos futuros.

> API em construção 🚧

---

## Status

Este projeto encontra-se em desenvolvimento contínuo.

O objetivo é evoluir a API progressivamente, incorporando novas funcionalidades, testes automatizados, documentação, CI/CD e melhorias arquiteturais.

---

## Tecnologias

* Node.js
* TypeScript
* NestJS
* TypeORM
* PostgreSQL
* Redis
* Docker
* Docker Compose

---

## Arquitetura

O projeto utiliza uma arquitetura modular baseada em **Domain-Driven Design (DDD)** e **Clean Architecture**.

Os principais módulos de negócio são organizados como *Bounded Contexts*, enquanto `Core` e `Shared` fornecem recursos transversais e abstrações reutilizáveis.

```text
src
├── core
├── identity
├── finance
├── planning
├── shared
├── types
├── app.module.ts
└── main.ts
```

### Contextos de negócio

#### Identity

Responsável pela identidade dos usuários e pelo processo de autenticação.

Inclui:

* Usuários
* Autenticação
* Sessões
* Contexto de autenticação
* Hash de senhas

As sessões são persistidas no Redis.

#### Finance

Representa o **System of Record** financeiro da aplicação.

É responsável pelo registro e gerenciamento dos recursos financeiros atuais do usuário, incluindo:

* Carteiras
* Categorias
* Transações
* Resumo financeiro

O contexto garante a consistência das movimentações e dos saldos das carteiras.

#### Planning

Representa o **System of Guidance** da aplicação.

É responsável pelo planejamento financeiro e pelos objetivos que o usuário deseja alcançar, incluindo:

* Metas financeiras
* Movimentações das metas
* Aportes
* Resgates
* Reversões de aportes
* Ciclo de vida das metas

---

## Core e Shared

A aplicação diferencia responsabilidades entre `Core` e `Shared`.

### Core

O `Core` contém componentes técnicos responsáveis por integrar a aplicação ao framework e fornecer infraestrutura transversal.

```text
core
├── app
│   └── contracts
├── decorators
├── filters
├── infra
│   ├── database
│   │   └── unit-of-work
│   ├── errors
│   ├── redis
│   └── services
├── interceptors
├── core.module.ts
└── core.tokens.ts
```

Entre suas responsabilidades estão:

* Contratos técnicos da aplicação
* Decorators utilizados pela camada de apresentação
* Tratamento global de exceções
* Interceptors HTTP
* Unit of Work
* Integração com Redis
* Geração de identificadores

O `Core` possui dependências relacionadas à infraestrutura da aplicação e ao framework.

### Shared

O `Shared` contém abstrações e conceitos reutilizáveis entre os diferentes contextos de negócio.

```text
shared
├── app
│   └── contracts
├── domain
│   ├── entities
│   ├── errors
│   └── value-objects
├── errors
│   ├── formatters
│   ├── mappers
│   ├── types
│   └── error-codes.ts
└── utils
```

Entre seus componentes estão:

* Contratos base para Use Cases
* Unit of Work contract
* Entidade base
* Value Objects compartilhados
* `Money`
* `Name`
* Erros base da aplicação
* Mapeamento de erros
* Formatação de respostas de erro
* Utilitários genéricos

O objetivo é evitar que conceitos genéricos e reutilizáveis sejam duplicados entre os contextos.

---

## Organização Interna dos Módulos

Os contextos de negócio seguem uma estrutura baseada nas responsabilidades da Clean Architecture:

```text
module/
├── app/
├── domain/
├── infra/
└── presentation/
```

### App

A camada `App` contém a lógica de aplicação e orquestração dos casos de uso.

Pode conter:

* Use Cases
* Contratos específicos da aplicação
* Policies
* Queries
* Services de aplicação
* Types
* Erros de aplicação

Essa camada coordena o fluxo das operações sem implementar diretamente os detalhes de infraestrutura.

### Domain

A camada `Domain` representa o núcleo do negócio.

Contém:

* Entidades
* Value Objects
* Enums
* Erros de domínio
* Contratos de repositórios
* Contratos de serviços de domínio

O domínio é mantido **livre de frameworks e detalhes de infraestrutura**.

### Infra

A camada `Infra` contém as implementações técnicas necessárias para persistência e integração com recursos externos.

Contém, por exemplo:

* Entidades TypeORM
* Repositórios
* Mappers
* Queries
* Integrações com infraestrutura

As implementações de infraestrutura dependem dos contratos definidos pelas camadas internas.

### Presentation

A camada `Presentation` representa a entrada da aplicação.

Contém:

* Controllers
* DTOs
* Guards

É responsável por adaptar requisições externas para os casos de uso da aplicação.

---

## Funcionalidades

### Identity

#### Usuários

* Criação de usuários
* Busca de usuário por ID
* Validação de `Email`
* Validação de `Username`
* Proteção contra e-mail duplicado
* Proteção contra username duplicado

#### Autenticação

* Login
* Logout
* Gerenciamento de sessões
* Sessões persistidas em Redis
* Validação de sessão
* `SessionGuard`
* Contexto de autenticação

A aplicação disponibiliza decorators como:

* `@CurrentUserId`
* `@CurrentAuth`
* `@CurrentSessionId`
* `@PublicRoute`

---

### Finance

#### Wallets

Responsáveis pelo gerenciamento dos recursos financeiros do usuário.

Funcionalidades:

* Criação
* Listagem
* Renomeação
* Exclusão
* Controle de saldo

A exclusão de carteiras é protegida por regras de negócio, como a impossibilidade de excluir uma carteira que possua recursos alocados em determinadas operações.

#### Categories

Responsáveis pela classificação das transações financeiras.

Funcionalidades:

* Criação
* Listagem
* Validação de nomes únicos

#### Transactions

Representam as movimentações financeiras do usuário.

Incluem:

* Receitas
* Despesas
* Data da transação
* Carteira de origem
* Categoria
* Tipo
* Status

As movimentações atualizam o saldo das carteiras de forma consistente.

#### Finance Summary

Fornece uma visão consolidada da situação financeira do usuário, incluindo:

* Receitas
* Despesas
* Balanço financeiro

---

### Planning

O contexto `Planning` gerencia os objetivos financeiros e a alocação de recursos.

#### Goals

Representam objetivos financeiros definidos pelo usuário.

Uma meta possui, entre outras informações:

* Nome
* Valor alvo
* Valor atual
* Prazo
* Status

O domínio controla o ciclo de vida da meta, incluindo estados como:

* Em progresso
* Pausada
* Concluída
* Cancelada
* Expirada

As regras de negócio relacionadas a prazo, valores e transições de estado são encapsuladas no domínio.

#### Goal Movements

Registram o histórico de movimentações financeiras relacionadas às metas.

Incluem:

* Depósitos
* Resgates
* Reversão de depósitos
* Origem dos recursos em carteiras

As movimentações permitem preservar o histórico das operações realizadas sobre uma meta.

---

## Estrutura do Projeto

A estrutura atual do projeto é organizada da seguinte forma:

```text
src
├── core
│   ├── app
│   │   └── contracts
│   ├── decorators
│   ├── filters
│   ├── infra
│   │   ├── database
│   │   ├── errors
│   │   ├── redis
│   │   └── services
│   ├── interceptors
│   ├── core.module.ts
│   └── core.tokens.ts
│
├── identity
│   ├── app
│   │   ├── contracts
│   │   ├── errors
│   │   ├── services
│   │   ├── types
│   │   └── use-cases
│   ├── domain
│   │   ├── entities
│   │   ├── errors
│   │   ├── repositories
│   │   └── value-objects
│   ├── infra
│   │   ├── entities
│   │   ├── mappers
│   │   ├── repositories
│   │   └── services
│   ├── presentation
│   │   ├── controllers
│   │   ├── dto
│   │   └── guards
│   ├── identity.module.ts
│   └── identity.token.ts
│
├── finance
│   ├── app
│   │   ├── errors
│   │   ├── policies
│   │   ├── queries
│   │   ├── types
│   │   └── use-cases
│   ├── domain
│   │   ├── entities
│   │   ├── enums
│   │   ├── errors
│   │   ├── repositories
│   │   ├── services
│   │   └── value-objects
│   ├── infra
│   │   ├── entities
│   │   ├── mappers
│   │   ├── queries
│   │   └── repositories
│   ├── presentation
│   │   └── controllers
│   ├── finance.module.ts
│   └── finance.tokens.ts
│
├── planning
│   ├── app
│   │   ├── errors
│   │   └── use-cases
│   ├── domain
│   │   ├── entities
│   │   ├── enums
│   │   ├── errors
│   │   ├── repositories
│   │   └── value-objects
│   ├── infra
│   │   ├── entities
│   │   ├── mappers
│   │   └── repositories
│   ├── presentation
│   ├── planning.module.ts
│   └── planning.tokens.ts
│
├── shared
│   ├── app
│   │   └── contracts
│   ├── domain
│   │   ├── entities
│   │   ├── errors
│   │   └── value-objects
│   ├── errors
│   │   ├── formatters
│   │   ├── mappers
│   │   └── types
│   └── utils
│
├── types
│   └── express.d.ts
│
├── app.module.ts
└── main.ts
```

---

## Como executar

### Pré-requisitos

* Docker
* Docker Compose

### Clone o projeto

```bash
git clone https://github.com/CharlesDFranca/kakeibo-api.git
cd kakeibo-api
```

### Configure as variáveis de ambiente

```bash
cp .env.example .env
```

> O arquivo `.env.example` já contém uma configuração padrão para execução local.

### Inicie a aplicação

```bash
docker compose up --build
```

A API ficará disponível em:

`http://localhost:3000`

---

## Ferramentas de desenvolvimento

* **Adminer (PostgreSQL):** `http://localhost:8080`
* **Redis Commander:** `http://localhost:8081`

---

## Roadmap

### Arquitetura e Base

* [x] Definição da arquitetura (DDD + Clean Architecture)
* [x] Estruturação dos Bounded Contexts
* [x] Separação entre `Core` e `Shared`
* [x] Implementação do Unit of Work
* [x] Implementação da infraestrutura Redis
* [x] Tratamento global de erros
* [x] Padronização de respostas HTTP

### Identity

* [x] Criação de usuários
* [x] Busca de usuários
* [x] Value Objects `Email` e `Username`
* [x] Login
* [x] Logout
* [x] Sessões persistidas em Redis
* [x] `SessionGuard`
* [x] Contexto de autenticação

### Finance

* [x] Wallets
* [x] Categories
* [x] Transactions
* [x] Finance Summary
* [x] Controle de saldo
* [x] Unit of Work para operações transacionais
* [x] Policies de domínio

### Planning v1

* [x] Goals
* [x] Criação de metas
* [x] Listagem de metas
* [x] Busca de meta por ID
* [x] Renomeação de metas
* [x] Cancelamento de metas
* [x] Goal Movements
* [x] Registro de depósitos
* [x] Reversão de depósitos
* [x] Controle do ciclo de vida das metas
* [x] Persistência estruturada em TypeORM

### Planning v2

* [ ] Limites de gastos (*Budgets*) por categoria
* [ ] Disparos de alertas
* [ ] Previsão de fluxo de caixa (*Forecast*)
* [ ] Agendamento de transações recorrentes
* [ ] Processamento de transações recorrentes

### Evolução Técnica

* [ ] CRUD completo dos recursos
* [ ] Paginação
* [ ] Filtros por período
* [ ] Testes unitários
* [ ] Testes E2E
* [ ] Migrations com TypeORM
* [ ] Documentação interativa da API (Swagger/OpenAPI)
* [ ] Pipelines de CI/CD
* [ ] Deploy em nuvem
