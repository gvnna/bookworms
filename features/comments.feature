Feature: Gerenciamento de comentários em postagens
  As a usuário do Bookworms
  I want to comentar e visualizar comentários em postagens
  So that eu possa interagir com outros leitores



  #Services Scenarios:

  #----------Sucessfull Scenários----------------:
  
  Scenario: Criar comentário em uma postagem
    Given há um post no sistema com id "123"
    And há um usuário no sistema com id "123", username "gio"
    When uma requisição POST for enviada para "/comments" com o corpo da requisição sendo um JSON: {"postId": "123", "authorId": "123", "date": "2025-02-13", "text": "Gostei muito desse livro!"}
    Then o status da resposta deve ser "201"
    And a resposta deve conter a mensagem "Comentário criado com sucesso!"
    And há no sistema um comentário com: {"postId": "123", "authorId": "123", "date": "2025-02-13", "text": "Gostei muito desse livro!"}



  Scenario: Buscar comentários de postagem
    Given há um post no sistema com id "xyz"
    And há um comentário no sistema com id "CMT1", postId "xyz", text "Gostei muito"
    And há um comentário no sistema com id "CMT2", postId "xyz", text "Muito bom!"
    When uma requisição GET for enviada para "/posts/xyz/comments"
    Then o status da resposta deve ser "200"
    And a resposta deve conter a mensagem "Comentários encontrados"
    And a resposta deve ser uma lista de "comments"
    And um item com {"id": "CMT1"} está na lista
    And um item com {"id": "CMT2"} está na lista


  Scenario: Apagar comentário
    Given há um comentário no sistema com id "CMT1"
    When uma requisição DELETE for enviada para "/comments/CMT1"
    Then o status da resposta deve ser "200"
    And a resposta deve conter a mensagem "Comentário deletado com sucesso"
    And não há mais no sistema um comentário com id "CMT1"


  Scenario: Editar comentário
    Given há um comentário no sistema com id "CMT1", postId "xyz", authorId "123", date "2025-02-13", text "Gostei muito desse livro!"
    When uma requisição PUT for enviada para "/comments/CMT1" com o corpo da requisição sendo um JSON: {"text": "Amei esse livro, recomendo a todos!"}
    Then o status da resposta deve ser "200"
    And a resposta deve conter a mensagem "Comentário atualizado com sucesso"
    And o comentário no sistema agora possui o texto "Amei esse livro, recomendo a todos!"


  






  # Scenario: Adicionar um comentário em uma postagem
  #   Given Estou autenticada no sistema com o e-mail "giovanna@gmail.com" e a senha "p@ssword"
  #   And Faço parte do grupo de código "RZT123"
  #   And Acesso uma postagem do usuário "brunaveiga"
  #   When Insiro o texto "Adorei a recomendação deste livro!" como comentário na postagem
  #   Then O comentário "Adorei a recomendação deste livro!" deve ser associado à postagem
  #   And Deve exibir meu nome de usuário "gvnna", a data "15/12/2024" e a hora "14:30" no comentário

  # Scenario: Tentar enviar um comentário vazio
  #   Given Estou autenticada no sistema com o e-mail "giovanna@gmail.com" e a senha "p@ssword123"
  #   And Faço parte do grupo de código "RZT123"
  #   And Acesso uma postagem com o título "Inspirador"
  #   When Tento enviar um comentário sem nenhum texto
  #   Then O sistema deve exibir uma mensagem de erro indicando "O comentário não pode estar vazio"
  #   And O comentário não deve ser associado à postagem

  # Scenario: Visualizar comentários de uma postagem
  #   Given Estou logada no aplicativo com o e-mail “giovanna@gmail.com” e a senha “p@ssword”
  #   And Participo do grupo de código "ZRT123"
  #   And Estou visualizando uma postagem com o título “O melhor livro de 2024”
  #   When A página exibe os comentários da postagem
  #   Then Devem ser exibidos todos os comentários existentes, ordenados pelos mais recentes
  #   And Cada comentário deve exibir o nome de usuário, a mensagem do comentário e a data e hora da publicação
  #   And Reações com emojis como 👍 (gostei), ❤️ (amei) e 😂 (engraçado) devem estar visíveis com a contagem de reações ao lado de cada emoji

  # Scenario: Editar meu comentário
  #   Given Estou logada no aplicativo com o e-mail “giovanna@gmail.com” e a senha “p@ssword”
  #   And Participo do grupo de código "TTT123"
  #   And Publiquei um comentário na postagem
  #   When Atualizo o comentário para “Amei a escolha do livro e já comprei um exemplar!”
  #   Then O comentário deve ser atualizado para “Amei a escolha do livro e já comprei um exemplar!”
  #   And O sistema deve registrar que o comentário foi editado, incluindo a data e hora da atualização
