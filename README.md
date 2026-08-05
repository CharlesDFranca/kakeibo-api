# Kakeibo

API para gerenciamento financeiro pessoal desenvolvida com **NestJS**, seguindo princípios de **Domain-Driven Design (DDD)** e **Clean Architecture**.

O projeto permite o gerenciamento de carteiras, categorias e transações financeiras, utilizando autenticação baseada em sessões armazenadas no Redis.

---

## Status

Este projeto encontra-se em desenvolvimento contínuo. O objetivo é evoluir a API progressivamente, incorporando novas funcionalidades, testes automatizados, documentação, CI/CD e melhorias arquiteturais.

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

O projeto é organizado em módulos seguindo uma abordagem orientada ao domínio.

```text
Identity
├── Users
└── Auth

Finance
├── Wallets
├── Categories
└── Transactions

Shared
├── Database
├── Redis
└── Common Services
```

Cada módulo é dividido em quatro camadas:

```text
app/
domain/
infra/
presentation/
```

---

## Funcionalidades

### Autenticação

- Cadastro de usuários
- Login
- Logout
- Sessões armazenadas no Redis
- Global Session Guard
- Rotas públicas configuráveis (`@Public()`)

### Carteiras

- Criar carteira
- Renomear carteira
- Remover carteira
- Listar carteiras do usuário

### Categorias

- Criar categoria
- Listar categorias

### Transações

- Criar transação
- Listar transações
- Atualização automática do saldo da carteira

### Financeiro

- Resumo financeiro
- Cálculo de receitas
- Cálculo de despesas
- Saldo consolidado

---

## Estrutura do projeto

```text
src
├── identity
├── finance
├── shared
└── app.module.ts
```

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

O arquivo `.env.example` já contém uma configuração padrão para execução local.

### Inicie a aplicação

```bash
docker compose up --build
```

A API ficará disponível em:

```
http://localhost:3000
```

---

## Ferramentas de desenvolvimento

### PostgreSQL

Adminer

```
http://localhost:8080
```

### Redis

Redis Commander

```
http://localhost:8081
```

---

## Variáveis de ambiente

As variáveis necessárias estão documentadas em `.env.example`.

---

## Roadmap

- [ ] CRUD completo dos módulos
- [ ] Testes automatizados
- [ ] Migrations
- [ ] Paginação
- [ ] Filtros por período
- [ ] Documentação da API
- [ ] CI/CD
- [ ] Deploy em nuvem
