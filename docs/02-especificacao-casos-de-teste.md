# Especificação de Casos de Teste e Matriz de Rastreabilidade (IEEE 829)

**Identificador do Documento:** ECT-NEXUS-2026-01  
**Referência:** Plano de Testes `PT-NEXUS-2026-01`  

---

## 1. Matriz de Rastreabilidade (Requisitos x BDD x Casos de Teste)

| Req. ID | Funcionalidade / Endpoint | Cenário BDD | Casos de Teste Vinculados |
| :--- | :--- | :--- | :--- |
| **REQ-00** | Disponibilidade da API (`GET /api/health`) | `BDD-00` | `CT-FUN-00` |
| **REQ-01** | Cadastro de Usuário (`POST /api/register`) | `BDD-01` a `BDD-03` | `CT-FUN-01`, `CT-FUN-02`, `CT-FUN-06` |
| **REQ-02** | Autenticação de Usuário (`POST /api/login`) | `BDD-04` a `BDD-06` | `CT-FUN-03`, `CT-FUN-04`, `CT-FUN-05`, `CT-FUN-07` |
| **REQ-03** | Gestão de Produtos (`CRUD /api/products`) | `BDD-07` a `BDD-12` | `CT-FUN-08` a `CT-FUN-14` |
| **REQ-04** | Gestão de Ofertas (`CRUD /api/offers`) | `BDD-13` a `BDD-17` | `CT-FUN-15` a `CT-FUN-19` |
| **REQ-05** | Checkout e Pedidos (`/api/checkout`, `/api/orders`) | `BDD-18` a `BDD-22` | `CT-FUN-20` a `CT-FUN-24` |

---

## 2. Catálogo de Casos de Teste Funcionais

### 2.1 Módulo de Infraestrutura e Autenticação

| ID | Título do Caso de Teste | Técnica ISTQB | Pré-condição | Entrada (Payload / Rota) | Resultado Esperado | Prioridade |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **CT-FUN-00** | Verificar status de saúde da API | Caminho Feliz | Servidor inicializado | `GET /api/health` | HTTP `200`, `{ status: 'UP' }` | Alta |
| **CT-FUN-01** | Cadastrar usuário com dados válidos | Part. Equivalência (Válida) | E-mail não cadastrado | `POST /api/register` `{ name, email, password }` | HTTP `201`, `success: true`, usuário retornado sem `password` | Crítica |
| **CT-FUN-02** | Rejeitar cadastro com campos nulos | Part. Equivalência (Inválida) | Nenhuma | `POST /api/register` `{ name: null, email: null, password: null }` | HTTP `400`, `error: 'Todos os campos são obrigatórios'` | Alta |
| **CT-FUN-03** | Autenticar usuário com credenciais válidas | Part. Equivalência (Válida) | Usuário cadastrado no banco | `POST /api/login` `{ email, password }` válido | HTTP `200`, `success: true`, dados do usuário sem senha | Crítica |
| **CT-FUN-04** | Rejeitar autenticação com e-mail inexistente | Part. Equivalência (Inválida) | E-mail não existe no banco | `POST /api/login` `{ email: 'naoexiste@email.com', password }` | HTTP `401`, `error: 'Credenciais inválidas'` | Alta |
| **CT-FUN-05** | Rejeitar autenticação com senha incorreta | Part. Equivalência (Inválida) | Usuário cadastrado no banco | `POST /api/login` `{ email, password: 'wrong' }` | HTTP `401`, `error: 'Credenciais inválidas'` | Crítica |
| **CT-FUN-06** | Rejeitar cadastro com e-mail já existente | Suposição de Erro | E-mail já cadastrado | `POST /api/register` com e-mail duplicado | HTTP `400`, `error: 'E-mail já cadastrado'` | Alta |
| **CT-FUN-07** | Rejeitar login com corpo da requisição vazio | Valor Limite / Erro | Nenhuma | `POST /api/login` `{}` | HTTP `400` ou `401` (nunca HTTP `500`) | Média |

### 2.2 Módulo de Produtos (`/api/products`)

| ID | Título do Caso de Teste | Técnica ISTQB | Pré-condição | Entrada (Payload / Rota) | Resultado Esperado | Prioridade |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **CT-FUN-08** | Criar produto com dados válidos | Part. Equivalência (Válida) | Banco sincronizado | `POST /api/products` `{ name, price, category }` | HTTP `201`, `success: true`, produto com `id` | Crítica |
| **CT-FUN-09** | Rejeitar criação de produto sem campos obrigatórios | Part. Equivalência (Inválida) | Banco sincronizado | `POST /api/products` `{ name: 'Teclado' }` (sem price/category) | HTTP `400`, mensagem de erro de validação | Alta |
| **CT-FUN-10** | Listar todos os produtos cadastrados | Caminho Feliz | >= 1 produto cadastrado | `GET /api/products` | HTTP `200`, array contendo os produtos | Alta |
| **CT-FUN-11** | Buscar produto específico por ID existente | Part. Equivalência (Válida) | Produto ID `1` existe | `GET /api/products/1` | HTTP `200`, objeto do produto correspondente | Alta |
| **CT-FUN-12** | Retornar 404 ao buscar produto inexistente | Valor Limite | ID `9999` não existe | `GET /api/products/9999` | HTTP `404`, `error: 'Produto não encontrado'` | Média |
| **CT-FUN-13** | Atualizar dados de um produto existente | Part. Equivalência (Válida) | Produto ID `1` existe | `PUT /api/products/1` `{ price: 299.90 }` | HTTP `200`, `success: true`, preço atualizado | Alta |
| **CT-FUN-14** | Remover produto existente e validar exclusão | Caminho Feliz | Produto ID `1` existe | `DELETE /api/products/1` | HTTP `200`, `success: true`; `GET` posterior retorna `404` | Alta |

### 2.3 Módulo de Ofertas (`/api/offers`)

| ID | Título do Caso de Teste | Técnica ISTQB | Pré-condição | Entrada (Payload / Rota) | Resultado Esperado | Prioridade |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **CT-FUN-15** | Criar oferta promocional válida | Part. Equivalência (Válida) | Banco sincronizado | `POST /api/offers` `{ name, price, originalPrice, discount, category }` | HTTP `201`, `success: true`, oferta criada | Alta |
| **CT-FUN-16** | Rejeitar criação de oferta sem preço original | Part. Equivalência (Inválida) | Banco sincronizado | `POST /api/offers` sem `originalPrice` | HTTP `400`, `error: 'Erro ao criar oferta'` | Média |
| **CT-FUN-17** | Listar ofertas e buscar oferta por ID | Caminho Feliz | Oferta ID `1` existe | `GET /api/offers` e `GET /api/offers/1` | HTTP `200`, lista e detalhes da oferta | Média |
| **CT-FUN-18** | Atualizar oferta existente | Part. Equivalência (Válida) | Oferta ID `1` existe | `PUT /api/offers/1` `{ discount: '-30%' }` | HTTP `200`, `success: true`, desconto atualizado | Média |
| **CT-FUN-19** | Remover oferta existente e tratar ID inexistente | Valor Limite | Oferta ID `1` existe | `DELETE /api/offers/1` e `DELETE /api/offers/9999` | HTTP `200` para existente e HTTP `404` para inexistente | Média |

### 2.4 Módulo de Checkout e Pedidos (`/api/checkout` e `/api/orders`)

| ID | Título do Caso de Teste | Técnica ISTQB | Pré-condição | Entrada (Payload / Rota) | Resultado Esperado | Prioridade |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **CT-FUN-20** | Processar checkout com carrinho válido | Part. Equivalência (Válida) | Banco sincronizado | `POST /api/checkout` `{ cart: [...], method: 'PIX' }` | HTTP `201`, `success: true`, `orderId` gerado (`NX-...`) | Crítica |
| **CT-FUN-21** | Rejeitar checkout com carrinho vazio | Valor Limite (Fronteira 0) | Nenhuma | `POST /api/checkout` `{ cart: [], method: 'PIX' }` | HTTP `400`, `error: 'O carrinho está vazio'` | Crítica |
| **CT-FUN-22** | Rejeitar checkout sem método de pagamento | Part. Equivalência (Inválida) | Nenhuma | `POST /api/checkout` `{ cart: [{ id: 1, qty: 1 }] }` (sem `method`) | HTTP `400` (validação de entrada) | Alta |
| **CT-FUN-23** | Listar histórico de pedidos ordenados | Caminho Feliz | >= 1 pedido realizado | `GET /api/orders` | HTTP `200`, array de pedidos | Alta |
| **CT-FUN-24** | Consultar pedido por `orderId` válido e inválido | Part. Equivalência | Pedido `NX-123` existe | `GET /api/orders/NX-123` e `GET /api/orders/NX-000000` | HTTP `200` para válido; HTTP `404` para inexistente | Alta |
