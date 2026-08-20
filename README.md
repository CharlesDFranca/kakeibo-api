# Kakeibo

API para gerenciamento financeiro pessoal desenvolvida com **NestJS**, seguindo princípios de **Domain-Driven Design (DDD)** e **Clean Architecture**.

O projeto permite o gerenciamento de usuários, autenticação, carteiras, categorias, transações financeiras e planejamento de objetivos financeiros, utilizando autenticação baseada em sessões armazenadas no Redis.

> API em construção

---

## Status

Este projeto encontra-se em desenvolvimento contínuo. O objetivo é evoluir a API progressivamente, incorporando novas funcionalidades, testes automatizados, documentação, CI/CD e melhorias arquiteturais.

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

O projeto é organizado em módulos e submódulos seguindo uma abordagem orientada ao domínio.

```text
src
├── identity
│   ├── users
│   └── auth
│
├── finance
│   ├── wallets
│   ├── categories
│   └── transactions
│
├── planning
│   └── goals
│
├── shared
│
└── app.module.ts
```

Os principais contextos da aplicação são:

### Identity

Responsável pela identidade dos usuários e pelo processo de autenticação.

```text
Identity
├── Users
└── Auth
```

### Finance

Responsável pelo gerenciamento das movimentações e recursos financeiros do usuário.

```text
Finance
├── Wallets
├── Categories
└── Transactions
```

### Planning

Responsável pelo planejamento financeiro e pelos objetivos que o usuário deseja alcançar.

```text
Planning
└── Goals
```

### Shared

Fornece componentes compartilhados entre os módulos da aplicação.

```text
Shared
├── Application Contracts
├── Domain
├── Database
├── Redis
└── Services
```

---

## Organização dos módulos

Os módulos de negócio seguem uma separação baseada em responsabilidades:

```text
module/
├── app/
├── domain/
├── infra/
└── presentation/
```

### App

Contém a lógica de aplicação, principalmente os casos de uso, contratos e componentes necessários para orquestrar as operações do sistema.

### Domain

Contém as regras de negócio e os modelos pertencentes ao domínio.

Inclui elementos como:

* Entidades
* Value Objects
* Enums
* Interfaces de repositórios

### Infra

Contém as implementações relacionadas à infraestrutura.

Inclui elementos como:

* Repositórios
* Mappers
* Queries
* Persistência
* Integrações com serviços externos

### Presentation

Responsável pela exposição das funcionalidades da aplicação, principalmente através dos controllers.

---

## Funcionalidades

### Identity

O contexto `Identity` concentra as funcionalidades relacionadas aos usuários e à autenticação.

#### Usuários

O módulo `Users` é responsável pelo gerenciamento dos usuários da aplicação.

* Criar usuários
* Buscar usuário por ID
* Validação de dados de usuário
* Value Objects para `Email` e `Username`
* Persistência dos usuários através de TypeORM

#### Autenticação

O módulo `Auth` é responsável pelo controle de autenticação e sessões.

* Login
* Logout
* Criação e gerenciamento de sessões
* Persistência das sessões no Redis
* Session Guard
* Identificação do usuário autenticado
* Identificação da sessão atual
* Rotas públicas através de `@Public()`
* Contexto de autenticação

---

### Finance

O contexto `Finance` concentra as funcionalidades relacionadas ao gerenciamento financeiro.

#### Wallets

O módulo `Wallets` representa as carteiras utilizadas pelo usuário para organizar seus recursos financeiros.

* Criar carteira
* Listar carteiras
* Renomear carteira
* Remover carteira
* Gerenciamento do saldo
* Persistência através de TypeORM

#### Categories

O módulo `Categories` permite classificar as transações financeiras.

* Criar categoria
* Listar categorias
* Persistência através de TypeORM

#### Transactions

O módulo `Transactions` representa as movimentações financeiras realizadas pelo usuário.

* Criar transação
* Listar transações
* Associar transações a carteiras
* Associar transações a categorias
* Classificação por tipo de transação
* Controle de status da transação
* Queries específicas para consulta de transações
* Atualização do saldo da carteira

O domínio de transações possui conceitos próprios para representar seu tipo e status:

```text
Transaction
├── TransactionType
└── TransactionStatus
```

#### Finance Summary

O contexto financeiro também possui uma operação para obtenção de um resumo consolidado.

O resumo permite consultar informações como:

* Receitas
* Despesas
* Saldo
* Dados consolidados das movimentações

---

### Planning

O contexto `Planning` concentra as funcionalidades relacionadas ao planejamento financeiro.

Atualmente, o módulo possui a estrutura inicial para trabalhar com objetivos financeiros.

```text
Planning
└── Goals
    ├── Domain
    │   ├── Entities
    │   │   └── Goal
    │   └── Value Objects
    │       └── GoalStatus
    │
    └── Presentation
        └── GoalsController
```

#### Goals

Uma `Goal` representa um objetivo financeiro que o usuário deseja alcançar.

A entidade possui:

* `userId`
* `name`
* `targetAmount`
* `currentAmount`
* `deadline`
* `status`

```text
Goal
├── userId
├── name
├── targetAmount
├── currentAmount
├── deadline?
└── status
```

O domínio da meta encapsula operações relacionadas à evolução do objetivo, incluindo:

* Depósito de valores
* Retirada de valores
* Atualização do valor alvo
* Atualização do prazo
* Conclusão
* Cancelamento
* Pausa
* Reativação
* Expiração

O status da meta é representado pelo Value Object `GoalStatus`.

```text
IN PROGRESS
├── PAUSED
├── COMPLETED
├── CANCELLED
└── EXPIRED
```

As regras para essas operações permanecem encapsuladas na entidade `Goal`, evitando que regras de negócio relacionadas ao ciclo de vida da meta sejam distribuídas entre controllers ou outras camadas.

O módulo `Planning` encontra-se atualmente em desenvolvimento, portanto sua estrutura ainda não possui todas as camadas presentes nos módulos já implementados de `Finance` e `Identity`.

---

## Estrutura do projeto

```text
src
├── finance
│   ├── app
│   │   └── use-cases
│   │
│   ├── categories
│   │   ├── app
│   │   ├── domain
│   │   ├── infra
│   │   └── presentation
│   │
│   ├── transactions
│   │   ├── app
│   │   ├── domain
│   │   ├── infra
│   │   └── presentation
│   │
│   ├── wallets
│   │   ├── app
│   │   ├── domain
│   │   ├── infra
│   │   └── presentation
│   │
│   ├── finance.controller.ts
│   ├── finance.module.ts
│   └── finance.tokens.ts
│
├── identity
│   ├── auth
│   │   ├── app
│   │   ├── domain
│   │   ├── dto
│   │   ├── infra
│   │   └── presentation
│   │
│   ├── users
│   │   ├── app
│   │   ├── domain
│   │   ├── dto
│   │   ├── infra
│   │   └── presentation
│   │
│   └── identity.module.ts
│
├── planning
│   ├── goals
│   │   ├── domain
│   │   │   ├── entities
│   │   │   └── value-objects
│   │   ├── presentation
│   │   └── goals.module.ts
│   │
│   └── planning.module.ts
│
├── shared
│   ├── app
│   │   └── contracts
│   ├── domain
│   │   └── entities
│   ├── infra
│   │   ├── database
│   │   ├── redis
│   │   └── services
│   ├── utils
│   ├── shared.module.ts
│   └── shared.token.ts
│
├── types
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

---

## Shared

O módulo `Shared` contém componentes utilizados por diferentes contextos da aplicação.

### Application Contracts

Contratos compartilhados pela camada de aplicação:

* `BaseUseCase`
* `IdGenerator`
* `PasswordHasher`

### Domain

Elementos compartilhados do domínio, como a entidade base utilizada pelas entidades da aplicação.

### Database

Configuração e entidades de persistência utilizando TypeORM.

### Redis

Integração com Redis, utilizada principalmente pelo contexto de autenticação para persistência das sessões.

### Services

Serviços compartilhados, incluindo:

* Geração de IDs
* Hash de senhas utilizando bcrypt

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

O arquivo `.env.example` já contém uma configuração padrão para execução local.

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

### PostgreSQL

Adminer:

```text
http://localhost:8080
```

### Redis

Redis Commander:

```text
http://localhost:8081
```

---

## Variáveis de ambiente

As variáveis necessárias estão documentadas em `.env.example`.

---

## Roadmap

* [ ] Finalizar implementação do módulo Planning
* [ ] Implementar casos de uso de Goals
* [ ] Implementar persistência de Goals
* [ ] Implementar histórico de aportes nas metas
* [ ] CRUD completo dos módulos
* [ ] Testes automatizados
* [ ] Migrations
* [ ] Paginação
* [ ] Filtros por período
* [ ] Documentação da API
* [ ] CI/CD
* [ ] Deploy em nuvem

```
