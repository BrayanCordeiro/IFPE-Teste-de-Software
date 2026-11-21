# Relatório de Defeitos — Incident Reports (Norma IEEE 829)

**Identificador do Documento:** IR-NEXUS-2026-01  
**Projeto:** Nexus API  
**Referência:** Plano de Testes `PT-NEXUS-2026-01`  

---

## Resumo dos Incidentes Encontrados

| ID do Defeito | Caso de Teste | Módulo | Severidade | Prioridade | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **BUG-001** | `CT-FUN-22` | Checkout (`POST /api/checkout`) | Alta | Alta | Resolvido |

---

## Detalhamento do Incidente — BUG-001

* **Identificador:** `BUG-001`
* **Título:** Requisição `POST /api/checkout` sem método de pagamento (`method`) retorna HTTP 500 em vez de HTTP 400
* **Caso de Teste Relacionado:** `CT-FUN-22` (`src/tests/checkout.test.js`)
* **Severidade:** Alta (Exposição de erro interno de banco de dados e quebra de contrato REST)
* **Prioridade:** Alta
* **Ambiente:** Node.js / Express 5 / Sequelize 6 / SQLite & PostgreSQL

### Descrição
Ao enviar uma requisição `POST` para `/api/checkout` contendo um carrinho válido, porém omitindo o campo obrigatório `method` (método de pagamento), a API não realiza validação prévia na camada de rota. O payload é repassado diretamente para `Order.create()`, gerando uma exceção não tratada de restrição `NOT NULL` do Sequelize (`Order.method cannot be null`) e respondendo com status HTTP `500 Internal Server Error`.

### Passos para Reproduzir
1. Enviar requisição `POST /api/checkout` com o cabeçalho `Content-Type: application/json`.
2. Utilizar o corpo: `{"cart": [{"id": 1, "name": "Teclado", "price": 200, "qty": 1}]}`.
3. Observar o código de status e o corpo da resposta HTTP.

### Resultado Obtido (Antes da Correção)
* **Status HTTP:** `500 Internal Server Error`
* **Corpo:** `{"error": "Erro ao processar o pedido", "details": "notNull Violation: Order.method cannot be null"}`

### Resultado Esperado
* **Status HTTP:** `400 Bad Request`
* **Corpo:** `{"error": "O método de pagamento é obrigatório"}`

### Causa Raiz e Solução Aplicada
* **Arquivo afetado:** `src/routes/checkoutRoutes.js` (linhas 6–10).
* **Correção:** Adicionada cláusula de guarda validando `!method || typeof method !== 'string' || method.trim() === ''` antes da chamada a `Order.create()`, retornando HTTP `400` com mensagem semântica.
* **Teste de Regressão:** Reexecução do `CT-FUN-22` confirmando HTTP `400` e aprovação de toda a suíte (25/25 testes passando).
