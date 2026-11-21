# ==============================================================================
# DOCUMENTO DE ESPECIFICAÇÃO DE TESTES (BDD) - PADRÃO ISO/IEC/IEEE 29119-3
# ==============================================================================
# ID do Documento : TS-NEXUS-API-001
# Versão          : 2.0
# Data            : 21/11/2026
# Autor           : Equipe de Qualidade de Software (QA)
# Sistema/Módulo  : Nexus API (E-commerce Core)
# Stack de Teste  : Node.js, Jest, Supertest (jest-cucumber)
# Rastreabilidade : REQ-01 (Auth), REQ-02 (Catálogo), REQ-03 (Ofertas), REQ-04 (Checkout)
# Pré-condições   : Ambiente de testes isolado; banco de dados resetado antes da suíte;
#                   variável de ambiente NODE_ENV=test configurada.
# Critério Saída  : 100% dos cenários @critico e @positivo aprovados; cobertura >= 80%.
# ==============================================================================
# language: pt

@nexus-api @regressao
Funcionalidade: Nexus API - Operações de E-commerce
  Como um cliente ou administrador da plataforma Nexus
  Eu quero gerenciar usuários, catálogo de produtos, ofertas e realizar pedidos
  Para garantir o funcionamento íntegro, seguro e resiliente do fluxo de compras

  # ============================================================================
  # MÓDULO 1: SAÚDE E AUTENTICAÇÃO (REQ-01)
  # ============================================================================

  @health @smoke @critico @CT-FUN-00
  Cenário: Verificar disponibilidade da API
    Dado que o servidor da Nexus API está inicializado
    Quando eu envio uma requisição GET para "/api/health"
    Então o status da resposta deve ser 200
    E o corpo da resposta deve conter o atributo "status" com valor "UP"

  @auth @positivo @critico @CT-FUN-01
  Cenário: Cadastrar novo usuário com dados válidos
    Dado que não existe usuário cadastrado com o e-mail "usuario@email.com"
    Quando eu envio uma requisição POST para "/api/register" com o payload:
      """json
      {
        "name": "Usuario Teste",
        "email": "usuario@email.com",
        "password": "Senha@123"
      }
      """
    Então o status da resposta deve ser 201
    E o corpo da resposta deve conter a mensagem "Usuário cadastrado com sucesso"
    E o corpo da resposta não deve expor a propriedade "password"

  @auth @negativo @CT-FUN-02 @CT-FUN-06
  Esquema do Cenário: Rejeitar cadastro de usuário com dados inválidos ou duplicados
    Dado que já existe um usuário cadastrado com o e-mail "existente@email.com"
    Quando eu envio uma requisição POST para "/api/register" com nome "<nome>", e-mail "<email>" e senha "<senha>"
    Então o status da resposta deve ser 400
    E o corpo da resposta deve conter o erro "<mensagem_erro>"

    Exemplos:

      | nome   | email               | senha     | mensagem_erro                    |
      |        |                     |           | Todos os campos são obrigatórios |
      | Carlos |                     | Senha@123 | Todos os campos são obrigatórios |
      | Carlos | email-invalido      | Senha@123 | Formato de e-mail inválido       |
      | Carlos | existente@email.com | Senha@123 | E-mail já cadastrado             |

  @auth @critico @CT-FUN-03 @CT-FUN-04 @CT-FUN-05
  Esquema do Cenário: Autenticação de usuário na plataforma
    Dado que existe um usuário cadastrado com e-mail "usuarioauth@email.com" e senha "Senha@123"
    Quando eu envio uma requisição POST para "/api/login" com e-mail "<email>" e senha "<senha>"
    Então o status da resposta deve ser <status>
    E o corpo da resposta deve conter "<mensagem>"

    Exemplos:

      | email                 | senha          | status | mensagem              |
      | usuarioauth@email.com | Senha@123      | 200    | Login realizado       |
      | naoexiste@email.com   | Senha@123      | 401    | Credenciais inválidas |
      | usuarioauth@email.com | wrong-pass-123 | 401    | Credenciais inválidas |

  # ============================================================================
  # MÓDULO 2: CATÁLOGO DE PRODUTOS (REQ-02) - CENÁRIOS DESACOPLADOS E AVL
  # ============================================================================

  @products @positivo @critico @CT-FUN-08
  Cenário: Cadastrar um novo produto com dados válidos
    Dado que estou autenticado com perfil de administrador
    Quando eu envio uma requisição POST para "/api/products" com nome "Monitor Gamer 27", preço 1499.90 e categoria "Monitores"
    Então o status da resposta deve ser 201
    E o corpo da resposta deve retornar o "id" gerado para o produto

  @products @negativo @limite @CT-FUN-09
  Esquema do Cenário: Validar regras de obrigatoriedade e valor limite no cadastro de produto
    Dado que estou autenticado com perfil de administrador
    Quando eu envio uma requisição POST para "/api/products" com nome "<nome>", preço <preco> e categoria "<categoria>"
    Então o status da resposta deve ser <status>
    E o corpo da resposta deve conter "<mensagem>"

    Exemplos:

      | nome             | preco  | categoria | status | mensagem                         |
      | Teclado Mecânico | 0.01   | Periféricos | 201  | Produto cadastrado com sucesso   |
      | Teclado Mecânico | 0.00   | Periféricos | 400  | O preço deve ser maior que zero  |
      | Teclado Mecânico | -10.00 | Periféricos | 400  | O preço deve ser maior que zero  |
      | Monitor Gamer 27 | null   |           | 400    | Todos os campos são obrigatórios |

  @products @positivo @CT-FUN-10
  Cenário: Listar todos os produtos cadastrados
    Dado que existem produtos cadastrados no catálogo
    Quando eu envio uma requisição GET para "/api/products"
    Então o status da resposta deve ser 200
    E o corpo da resposta deve ser uma lista não vazia de produtos

  @products @positivo @CT-FUN-11
  Cenário: Consultar um produto específico pelo ID
    Dado que existe o produto "Monitor Gamer 27" cadastrado com ID "prod-01"
    Quando eu envio uma requisição GET para "/api/products/prod-01"
    Então o status da resposta deve ser 200
    E o atributo "name" da resposta deve ser "Monitor Gamer 27"

  @products @negativo @CT-FUN-12
  Cenário: Retornar erro 404 ao buscar produto inexistente
    Quando eu envio uma requisição GET para "/api/products/9999"
    Então o status da resposta deve ser 404
    E o corpo da resposta deve conter o erro "Produto não encontrado"

  @products @positivo @CT-FUN-13
  Cenário: Atualizar o preço de um produto existente
    Dado que estou autenticado com perfil de administrador
    E existe o produto "Monitor Gamer 27" cadastrado com ID "prod-01" e preço 1499.90
    Quando eu envio uma requisição PUT para "/api/products/prod-01" com preço 1299.90
    Então o status da resposta deve ser 200
    E o atributo "price" da resposta deve ser 1299.90

  @products @positivo @CT-FUN-14
  Cenário: Remover um produto existente pelo ID
    Dado que estou autenticado com perfil de administrador
    E existe o produto "Monitor Gamer 27" cadastrado com ID "prod-01"
    Quando eu envio uma requisição DELETE para "/api/products/prod-01"
    Então o status da resposta deve ser 200
    E uma nova requisição GET para "/api/products/prod-01" deve retornar status 404

  # ============================================================================
  # MÓDULO 3: OFERTAS PROMOCIONAIS (REQ-03) - CENÁRIOS DESACOPLADOS E AVL
  # ============================================================================

  @offers @positivo @CT-FUN-15
  Cenário: Criar oferta promocional válida
    Dado que estou autenticado com perfil de administrador
    Quando eu envio uma requisição POST para "/api/offers" para "Headset Wireless" de 500.00 por 350.00 com desconto "-30%" na categoria "Áudio"
    Então o status da resposta deve ser 201
    E o corpo da resposta deve retornar o "id" da oferta criada

  @offers @negativo @limite @CT-FUN-16
  Esquema do Cenário: Validar limites de desconto na criação de oferta
    Dado que estou autenticado com perfil de administrador
    Quando eu envio uma requisição POST para "/api/offers" com preço original 500.00 e desconto "<desconto>"
    Então o status da resposta deve ser <status>

    Exemplos:

      | desconto | status |
      | -1%      | 201    |
      | -99%     | 201    |
      | 0%       | 400    |
      | -100%    | 400    |
      | -101%    | 400    |

  @offers @positivo @CT-FUN-17 @CT-FUN-18
  Cenário: Atualizar percentual de desconto de uma oferta existente
    Dado que estou autenticado com perfil de administrador
    E existe uma oferta cadastrada com ID "offer-01" e desconto "-30%"
    Quando eu envio uma requisição PUT para "/api/offers/offer-01" com desconto "-40%"
    Então o status da resposta deve ser 200
    E o atributo "discount" da resposta deve ser "-40%"

  @offers @positivo @CT-FUN-19
  Cenário: Remover uma oferta promocional existente
    Dado que estou autenticado com perfil de administrador
    E existe uma oferta cadastrada com ID "offer-01"
    Quando eu envio uma requisição DELETE para "/api/offers/offer-01"
    Então o status da resposta deve ser 200

  # ============================================================================
  # MÓDULO 4: CHECKOUT, PEDIDOS E SEGURANÇA (REQ-04)
  # ============================================================================

  @checkout @positivo @critico @CT-FUN-20
  Cenário: Finalizar compra com carrinho válido e pagamento via PIX
    Dado que estou autenticado como cliente
    E possuo um carrinho ativo com 2 itens válidos
    Quando eu envio uma requisição POST para "/api/checkout" com método de pagamento "PIX"
    Então o status da resposta deve ser 201
    E o atributo "orderId" da resposta deve corresponder ao padrão "^NX-"

  @checkout @negativo @CT-FUN-21
  Cenário: Rejeitar checkout quando o carrinho estiver vazio
    Dado que estou autenticado como cliente
    E possuo um carrinho vazio
    Quando eu envio uma requisição POST para "/api/checkout" com método de pagamento "PIX"
