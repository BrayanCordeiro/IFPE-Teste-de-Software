# Plano de Testes de Software — Nexus API (Norma IEEE 829)

**Identificador do Documento:** PT-NEXUS-2026-01  
**Projeto:** Nexus API (E-commerce RESTful API)  
**Disciplina:** Teste de Software — IFPE  
**Versão:** 1.0  
**Data:** 21/11/2026  

---

## 1. Introdução e Objetivos
Este documento estabelece o planejamento formal das atividades de verificação e validação da **Nexus API**, em conformidade com a norma **IEEE 829** e as boas práticas do **ISTQB**. O objetivo principal é assegurar a conformidade funcional dos endpoints, validar regras de negócio, identificar defeitos de integridade/segurança e gerar evidências técnicas rastreáveis por meio de testes automatizados.

---

## 2. Itens de Teste (Escopo)
O objeto de teste compreende os módulos da aplicação backend desenvolvidos em Node.js (Express 5 + Sequelize ORM):
* **Módulo de Saúde (`src/app.js`):** Endpoint de verificação de disponibilidade (`GET /api/health`).
* **Módulo de Autenticação (`src/routes/authRoutes.js`):** Registro de novos usuários (`POST /api/register`) e autenticação (`POST /api/login`).
* **Módulo de Catálogo (`src/routes/productRoutes.js`):** Operações CRUD de Produtos (`/api/products`) e Ofertas (`/api/offers`).
* **Módulo de Checkout e Pedidos (`src/routes/checkoutRoutes.js`):** Processamento de carrinho (`POST /api/checkout`) e consulta de pedidos (`GET /api/orders`, `GET /api/orders/:orderId`).

---

## 3. Funcionalidades a Serem Testadas e Não Testadas

### 3.1 Em Escopo (Testadas)
* Contratos de entrada e saída HTTP (Status Codes, Headers e Schemas JSON).
* Persistência e integridade referencial nos modelos `User`, `Product`, `Offer` e `Order`.
* Criptografia de senhas (`bcryptjs`) e omissão de dados sensíveis nas respostas.
* Tratamento de exceções (campos nulos/ausentes, registros duplicados, recursos inexistentes e tipos inválidos).

### 3.2 Fora de Escopo (Não Testadas nesta etapa)
* Interface gráfica (Frontend) e testes de usabilidade.
* Testes de carga, estresse e performance distribuída (JMeter/k6).
* Integração real com gateways de pagamento externos.

---

## 4. Abordagem e Técnicas de Teste (ISTQB)
* **Nível de Teste:** Teste de Integração de API (Caixa-Preta e Caixa-Cinza).
* **Tipos de Teste:** Funcional, Regressão e Análise Estática (ESLint + Auditoria de Dependências).
* **Técnicas de Modelagem de Casos de Teste:**
  * *Particionamento de Equivalência (EP):* Divisão de entradas em classes válidas e inválidas (ex.: credenciais válidas vs. inválidas; carrinho preenchido vs. vazio).
  * *Análise de Valor Limite (BVA):* Testes nas fronteiras de domínio (ex.: preço `0.00` ou negativo, arrays com 0 itens, IDs inexistentes).
  * *Suposição de Erro (Error Guessing):* Envio de payloads vazios `{}`, tipos incorretos (string em campo numérico) e violação de unicidade (`email` duplicado).
* **Especificação Executável:** Comportamentos descritos em linguagem ubíqua **BDD (Gherkin)** (`Dado / Quando / Então`).

---

## 5. Critérios de Entrada, Suspensão e Saída

### 5.1 Critérios de Entrada
* Ambiente Node.js configurado e dependências instaladas sem erros críticos.
* Banco de dados isolado disponível (SQLite em memória por padrão ou PostgreSQL via `DATABASE_URL_TEST`).
* Análise estática (`npm run lint`) sem erros de sintaxe.

### 5.2 Critérios de Suspensão e Retomada
* **Suspensão:** Falha de conexão com o banco de dados de teste ou erro de inicialização do servidor Express que impeça a execução da suíte.
* **Retomada:** Correção da configuração de ambiente e validação do endpoint `/api/health`.

### 5.3 Critérios de Saída (Aceite)
* 100% dos casos de teste planejados (`CT-FUN-01` a `CT-FUN-24`) implementados e executados.
* 0 defeitos de severidade **Crítica** ou **Alta** em aberto.
* Cobertura de código (`Statements` e `Lines`) superior a **85%** nas rotas e modelos.
* Evidências de execução e relatórios de defeitos (Bug Reports) devidamente documentados.

---

## 6. Ambiente de Testes e Ferramentas
* **Runtime:** Node.js v22+ / v24+
* **Framework de Testes e Asserções:** Jest v30 (`--runInBand` para isolamento transacional)
* **Cliente HTTP para Automação:** Supertest v7
* **Banco de Dados de Teste:** SQLite 3 em memória (`:memory:`) com suporte opcional a PostgreSQL
* **Análise Estática e Segurança:** ESLint v10 e `npm audit --omit=dev` (0 vulnerabilidades em produção após mitigação do `CVE-2026-41907` no `uuid`).

---

## 7. Análise de Riscos e Mitigações

| ID | Risco Identificado | Probabilidade | Impacto | Estratégia de Mitigação |
| :--- | :--- | :---: | :---: | :--- |
| **RSK-01** | Concorrência de escrita/limpeza no banco durante testes paralelos (*Flaky Tests*) | Alta | Alto | Execução sequencial obrigatória via flag `--runInBand` no Jest. |
| **RSK-02** | Contaminar banco de desenvolvimento com `sync({ force: true })` | Média | Crítico | Isolamento em SQLite `:memory:` quando `NODE_ENV=test`. |
| **RSK-03** | Vulnerabilidade transitiva `CVE-2026-41907` (`uuid < 11.1.1` via Sequelize) | Baixa | Moderado | Aplicação de `overrides` para `uuid@^11.1.1` no `package.json`. |
| **RSK-04** | Retorno de HTTP 500 não tratado em entradas malformadas | Alta | Alto | Mapeamento de casos de teste negativos para identificar e corrigir falhas de validação. |
