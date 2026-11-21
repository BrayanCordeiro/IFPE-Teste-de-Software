# Nexus API — Projeto de Teste de Software (IFPE)

API RESTful de E-commerce desenvolvida em Node.js (Express 5 + Sequelize), submetida ao processo completo de Garantia da Qualidade de Software (QA) baseado na norma **IEEE 829**, **ISTQB** e **BDD**.

## Documentação de QA (Norma IEEE 829)
* [01 - Plano de Testes (IEEE 829)](docs/01-plano-de-testes-ieee829.md)
* [02 - Especificação de Casos de Teste e Matriz de Rastreabilidade](docs/02-especificacao-casos-de-teste.md)
* [03 - Cenários de Comportamento BDD (Gherkin)](docs/03-cenarios-bdd.feature)
* [04 - Relatório de Incidentes e Defeitos (Bug Report)](docs/04-relatorio-defeitos-ieee829.md)
* [05 - Relatório Sumário de Encerramento e Evidências](docs/05-relatorio-encerramento-ieee829.md)

## Como Executar os Testes Automatizados

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Execute a suíte completa de testes (25 casos de teste automatizados em banco isolado):
   ```bash
   npm test
   ```
3. Gere o relatório de cobertura de código:
   ```bash
   npm run test:coverage
   ```
