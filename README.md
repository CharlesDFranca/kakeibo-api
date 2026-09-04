# Kakeibo (家計簿)

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

API para gerenciamento financeiro pessoal desenvolvida com NestJS, TypeScript, Domain-Driven Design (DDD) e Clean Architecture.

O nome do projeto é inspirado no Kakeibo, o método tradicional japonês de organização financeira que busca trazer consciência e intenção para o uso do dinheiro.

A aplicação é estruturada em Bounded Contexts, mantendo as regras de negócio isoladas dos detalhes de infraestrutura.

Status: em desenvolvimento ativo.

---

## Visão geral

O Kakeibo é organizado em três contextos principais:

- **Identity** — usuários, autenticação e sessões.
- **Finance** — registro e gerenciamento da situação financeira atual.
- **Planning** — planejamento financeiro, metas e alocação de recursos.

A separação permite que cada contexto possua seu próprio domínio, casos de uso, contratos e implementações de infraestrutura.

---

## Tecnologias

- Node.js
- TypeScript
- NestJS
- TypeORM
- PostgreSQL
- Redis
- Docker
- Docker Compose

---

## Arquitetura

O projeto segue uma arquitetura modular baseada em DDD e Clean Architecture.

Os contextos de negócio são organizados de forma independente, enquanto Core e Shared concentram responsabilidades transversais e abstrações reutilizáveis.

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

### Dependências entre camadas

De forma geral, o fluxo da aplicação segue:

```text
Presentation
     ↓
    App
     ↓
  Domain
     ↑
   Infra
```

A camada de domínio define as regras e contratos do negócio. A infraestrutura implementa esses contratos, evitando que o domínio dependa diretamente de TypeORM, Redis ou NestJS.

---

## Bounded Contexts

### Identity

O contexto Identity é responsável pela identidade do usuário e autenticação.

**Responsabilidades:**

- Criação de usuários
- Busca de usuário por ID
- Validação de Email
- Validação de Username
- Proteção contra e-mail duplicado
- Proteção contra username duplicado
- Login
- Logout
- Gerenciamento de sessões
- Validação de sessão
- Contexto de autenticação
- Hash de senhas

As sessões são persistidas no Redis.

O contexto também disponibiliza componentes para integração com a camada HTTP, como:

- `SessionGuard`
- `@CurrentUserId`
- `@CurrentAuth`
- `@CurrentSessionId`
- `@PublicRoute`

---

### Finance

O contexto Finance representa o **System of Record** financeiro da aplicação.

É responsável por registrar e manter a situação financeira atual do usuário.

#### Wallets

As carteiras representam os recursos financeiros do usuário.

**Funcionalidades:**

- Criação
- Listagem
- Renomeação
- Exclusão
- Controle de saldo

A exclusão é protegida por regras de negócio. Por exemplo, uma carteira não pode ser removida quando possui dinheiro alocado em operações que impedem sua exclusão.

#### Categories

As categorias classificam as transações financeiras.

**Funcionalidades:**

- Criação
- Listagem
- Renomeação
- Exclusão
- Validação de nomes únicos
- Proteção das categorias de sistema

#### Transactions

As transações representam movimentações financeiras.

Elas podem representar:

- Receitas
- Despesas

Cada transação possui informações como:

- Descrição
- Valor
- Data
- Carteira
- Categoria
- Tipo
- Status

As operações são realizadas de forma consistente com o saldo das carteiras.

#### Transfers

As transferências representam movimentações entre carteiras.

O contexto possui operações para:

- Criação de transferências
- Reversão de transferências

As regras de domínio impedem operações inválidas, como transferir recursos para a mesma carteira ou reverter uma transferência em uma situação não permitida.

#### Finance Dashboard

O contexto também disponibiliza uma visão consolidada das informações financeiras.

O dashboard reúne informações como:

- Receitas
- Despesas
- Balanço financeiro
- Informações detalhadas das carteiras
- Informações relacionadas às transações

---

### Planning

O contexto Planning representa o **System of Guidance** da aplicação.

Seu objetivo é lidar com objetivos financeiros e com a alocação de recursos necessários para alcançá-los.

#### Goals

As metas representam objetivos financeiros definidos pelo usuário.

Uma meta possui informações como:

- Nome
- Valor alvo
- Valor atual
- Prazo
- Status

O ciclo de vida da meta contempla estados como:

- `IN_PROGRESS`
- `PAUSED`
- `COMPLETED`
- `CANCELLED`
- `EXPIRED`

As regras relacionadas a valores, prazos e transições de estado ficam encapsuladas no domínio.

#### Goal Movements

As movimentações registram o histórico dos recursos destinados às metas.

São contempladas operações como:

- Depósitos
- Resgates
- Reversões de depósitos
- Associação dos recursos às carteiras de origem

O histórico das movimentações permite controlar quanto foi efetivamente alocado em uma meta e preservar a rastreabilidade das operações.

#### Planning Dashboard

O contexto possui uma visão consolidada das informações relacionadas ao planejamento financeiro e às metas.

---

## Organização interna dos módulos

Cada Bounded Context segue uma estrutura baseada nas responsabilidades da Clean Architecture:

```text
module/
├── api/
├── app/
├── domain/
├── infra/
└── presentation/
```

Nem todos os módulos possuem exatamente os mesmos diretórios, pois a estrutura é adaptada às necessidades de cada contexto.

### App

A camada App contém a lógica de aplicação e a orquestração dos casos de uso.

Pode conter:

- Use Cases
- Contratos específicos da aplicação
- Policies
- Queries
- Services de aplicação
- Types
- Erros de aplicação

Essa camada coordena os fluxos da aplicação sem implementar diretamente os detalhes de persistência.

### Domain

A camada Domain representa o núcleo do negócio.

Contém:

- Entidades
- Value Objects
- Enums
- Erros de domínio
- Contratos de repositórios
- Contratos de serviços de domínio

O domínio permanece independente de frameworks e detalhes de infraestrutura.

### Infra

A camada Infra contém as implementações técnicas.

Contém, entre outros:

- Entidades TypeORM
- Repositórios
- Mappers
- Queries
- Unit of Work
- Integrações com infraestrutura

As implementações de infraestrutura atendem aos contratos definidos pelas camadas internas.

### Presentation

A camada Presentation representa a entrada HTTP da aplicação.

Contém:

- Controllers
- DTOs
- Guards

Sua responsabilidade é adaptar as requisições externas para os casos de uso da aplicação.

### API

Os contextos Finance e Planning também possuem uma camada `api`, utilizada para expor contratos de alto nível entre partes da aplicação, como as respectivas facades.

---

## Core e Shared

### Core

O Core concentra componentes técnicos e transversais relacionados à execução da aplicação e à integração com o framework.

```text
core
├── app
│   └── contracts
├── decorators
├── filters
├── infra
│   ├── database
│   │   └── unit-of-work
│   ├── redis
│   └── services
├── interceptors
├── core.module.ts
└── core.tokens.ts
```

Entre suas responsabilidades estão:

- Contratos técnicos da aplicação
- Decorators HTTP
- Tratamento global de exceções
- Interceptors
- Unit of Work base
- Contexto transacional
- Integração com Redis
- Geração de identificadores

O Core contém dependências relacionadas à infraestrutura e ao framework.

### Shared

O Shared contém conceitos e abstrações realmente reutilizáveis entre os contextos.

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

Entre os componentes compartilhados estão:

- Contrato base para Use Cases
- Contrato de Unit of Work
- Entidade base
- `Money`
- `Name`
- Erros base
- Mapeamento de erros
- Formatação de respostas
- Utilitários genéricos

A separação entre Core e Shared evita misturar conceitos de infraestrutura com conceitos reutilizáveis de domínio e aplicação.

---

## Padrões e decisões arquiteturais

O projeto utiliza alguns padrões para manter as regras de negócio desacopladas da infraestrutura.

### Repository Pattern

Os contextos definem contratos de repositórios dentro do domínio:

```text
domain/repositories/
```

As implementações concretas ficam em:

```text
infra/repositories/
```

Isso permite que os casos de uso dependam de abstrações, e não diretamente do TypeORM.

### Unit of Work

Operações que envolvem múltiplas alterações de estado podem utilizar uma Unit of Work para manter a consistência transacional.

Existe uma implementação base no Core, enquanto cada contexto fornece sua implementação específica.

```text
core/infra/database/unit-of-work/
```

Exemplos:

```text
finance/infra/database/typeorm-finance.uow.ts
planning/infra/database/typeorm-planning.uow.ts
identity/infra/database/typeorm-identity.uow.ts
```

### Value Objects

Conceitos que possuem regras próprias são representados por Value Objects.

Exemplos:

- `Money`
- `Name`
- `Email`
- `Username`
- Tipos relacionados ao ciclo de vida de metas e movimentações

### Domain Errors

Regras de negócio inválidas são representadas por erros específicos do domínio.

Exemplos:

- Saldo insuficiente
- Transferência para a mesma carteira
- Categoria de sistema não pode ser removida
- Meta com valor atual acima do objetivo
- Operação inválida sobre uma meta
- Data de transação inválida

### Policies

Algumas regras que envolvem decisões sobre operações são encapsuladas em policies, mantendo os casos de uso mais focados em orquestração.

Atualmente existem policies relacionadas à exclusão de:

- Categorias
- Carteiras

---

## Estrutura atual

A estrutura principal do projeto encontra-se organizada da seguinte forma:

```text
src
├── core
│   ├── app
│   │   └── contracts
│   ├── decorators
│   ├── filters
│   ├── infra
│   │   ├── database
│   │   │   └── unit-of-work
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
│   │   └── use-cases
│   ├── domain
│   │   ├── entities
│   │   ├── errors
│   │   ├── repositories
│   │   └── value-objects
│   ├── infra
│   │   ├── database
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
│   ├── api
│   ├── app
│   │   ├── contracts
│   │   ├── errors
│   │   ├── services
│   │   └── use-cases
│   ├── domain
│   │   ├── entities
│   │   ├── enums
│   │   ├── errors
│   │   ├── repositories
│   │   ├── services
│   │   └── value-objects
│   ├── infra
│   │   ├── database
│   │   ├── entities
│   │   ├── mappers
│   │   ├── queries
│   │   └── repositories
│   ├── presentation
│   │   ├── controllers
│   │   └── dtos
│   ├── finance.module.ts
│   └── finance.tokens.ts
│
├── planning
│   ├── api
│   ├── app
│   │   ├── contracts
│   │   ├── errors
│   │   ├── services
│   │   └── use-cases
│   ├── domain
│   │   ├── entities
│   │   ├── enums
│   │   ├── errors
│   │   ├── repositories
│   │   └── value-objects
│   ├── infra
│   │   ├── database
│   │   ├── entities
│   │   ├── mappers
│   │   ├── queries
│   │   └── repositories
│   ├── presentation
│   │   ├── controllers
│   │   └── dtos
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

## Funcionalidades

### Identity

- Criação de usuários
- Busca de usuário por ID
- Value Objects `Email` e `Username`
- Validação de unicidade de e-mail
- Validação de unicidade de username
- Login
- Logout
- Sessões persistidas em Redis
- Validação de sessão
- `SessionGuard`
- Contexto de autenticação
- Hash de senhas

### Finance

- Criação de carteiras
- Listagem de carteiras
- Renomeação de carteiras
- Exclusão de carteiras
- Controle de saldo
- Criação de categorias
- Listagem de categorias
- Renomeação de categorias
- Exclusão de categorias
- Categorias de sistema
- Criação de transações
- Listagem de transações
- Receitas e despesas
- Controle de saldo durante movimentações
- Criação de transferências
- Reversão de transferências
- Dashboard financeiro
- Queries específicas para leitura
- Unit of Work
- Policies de exclusão
- Repositórios desacoplados do TypeORM

### Planning

- Criação de metas
- Listagem de metas
- Busca de meta por ID
- Renomeação de metas
- Cancelamento de metas
- Movimentações de metas
- Registro de depósitos
- Reversão de depósitos
- Controle de saldo das metas
- Controle do ciclo de vida das metas
- Validação de prazos
- Dashboard de planejamento
- Unit of Work
- Persistência com TypeORM

---

## Como executar

### Pré-requisitos

- Docker
- Docker Compose

### Clone o projeto

```bash
git clone https://github.com/CharlesDFranca/kakeibo-api.git
cd kakeibo-api
```

### Configure as variáveis de ambiente

```bash
cp .env.example .env
```

O arquivo `.env.example` contém a configuração necessária para execução local.

### Inicie a aplicação

```bash
docker compose up --build
```

A API ficará disponível em:

```text
http://localhost:3000
```

---

## Ferramentas de desenvolvimento

Durante a execução do ambiente Docker, as seguintes ferramentas podem ser utilizadas:

| Ferramenta       | Endereço                     |
|------------------|------------------------------|
| API              | `http://localhost:3000`      |
| Adminer          | `http://localhost:8080`      |
| Redis Commander  | `http://localhost:8081`      |

---

## Roadmap

O projeto está em evolução contínua. As próximas etapas estão concentradas principalmente em qualidade, documentação e evolução da infraestrutura.

### Qualidade

- Testes unitários
- Testes de integração
- Testes E2E
- Aumento da cobertura de testes

### API

- CRUD completo dos recursos
- Paginação
- Filtros avançados
- Documentação com Swagger/OpenAPI

### Infraestrutura

- Migrations com TypeORM
- Pipelines de CI/CD
- Deploy em nuvem
- Melhorias de observabilidade

### Planning — próximas evoluções

- Budgets por categoria
- Alertas relacionados ao orçamento
- Forecast de fluxo de caixa
- Transações recorrentes
- Agendamento de transações recorrentes
