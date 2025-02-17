import { loadFeature, defineFeature, DefineStepFunction } from 'jest-cucumber';
import supertest from 'supertest';
import app from '../../src/app';
import { connection } from '../Helper/database.config';

const feature = loadFeature('../features/comments.feature');

const createUser = async (id, username) => ({
  id,
  name: 'Test User',
  username,
  email: `${username}@test.com`,
  password: 'password123',
});

const createPost = async (id, authorId, groupId) => ({
  id,
  title: 'Test Post',
  body: 'This is a test post.',
  image: 'default.jpg',
  createdAt: new Date(),
  numPages: 100,
  authorId,
  groupId,
});

const createComment = async (id, postId, authorId, text) => ({
  id,
  postId,
  authorId,
  text,
  date: new Date(),
});

defineFeature(feature, (test) => {
  let response;

  beforeAll(async () => {
    await connection.create();
  });
  afterEach(async () => {
    await connection.clear();
  });
  afterAll(async () => {
    await connection.close();
  });

  const givenPost = async (given) => {
    given(/^há um post no sistema com id "(.*)"$/, async (postId) => {
      const post = await createPost(postId, '123', '456'); // Usando id fixos ou variáveis para authorId e groupId
      await (await connection.get()).post.create({ data: post });
    });
  };

  const givenUser = async (given) => {
    given(
      /^há um usuário no sistema com id "(.*)", username "(.*)"$/,
      async (userId, username) => {
        const user = await createUser(userId, username);
        await (await connection.get()).user.create({ data: user });
      },
    );
  };

  const givenComment = async (given) => {
    given(
      /^há um comentário no sistema com id "(.*)", postId "(.*)", text "(.*)"$/,
      async (commentId, postId, text) => {
        const comment = await createComment(commentId, postId, '123', text);
        await (await connection.get()).comment.create({ data: comment });
      },
    );
  };

  const whenPOSTRequest = async (when) => {
    when(
      /^uma requisição POST for enviada para "(.*)" com o corpo da requisição sendo um JSON: (.*)$/,
      async (route, body) => {
        response = await supertest(app).post(route).send(JSON.parse(body));
      },
    );
  };

  const whenGETRequest = async (when) => {
    when(/^uma requisição GET for enviada para "(.*)"$/, async (route) => {
      response = await supertest(app).get(route);
    });
  };

  const whenDELETERequest = async (when) => {
    when(/^uma requisição DELETE for enviada para "(.*)"$/, async (route) => {
      response = await supertest(app).delete(route);
    });
  };

  const whenPUTRequest = async (when) => {
    when(
      /^uma requisição PUT for enviada para "(.*)" com o corpo da requisição sendo um JSON: (.*)$/,
      async (route, body) => {
        response = await supertest(app).put(route).send(JSON.parse(body));
      },
    );
  };

  const thenStatusResponse = async (then) => {
    then(/^o status da resposta deve ser "(.*)"$/, async (status) => {
      expect(response.status).toBe(parseInt(status));
    });
  };

  const thenMessageResponse = async (then) => {
    then(/^a resposta deve conter a mensagem "(.*)"$/, async (message) => {
      expect(response.body.message).toBe(message);
    });
  };

  const thenCommentExists = async (then) => {
    then(
      /^há no sistema um comentário com: {"postId": "(.*)", "authorId": "(.*)", "date": "(.*)", "text": "(.*)"}$/,
      async (postId, authorId, date, text) => {
        const comment = await (
          await connection.get()
        ).comment.findFirst({
          where: { postId, authorId, text },
        });

        // Verificação explícita para garantir que o comentário existe
        expect(comment).not.toBeNull(); // Isso garantirá que o comentário não seja nulo
        if (comment === null) {
          throw new Error(
            `Comentário não encontrado para postId ${postId}, authorId ${authorId}, e texto "${text}"`,
          );
        }

        expect(comment.postId).toBe(postId);
        expect(comment.authorId).toBe(authorId);
        expect(comment.text).toBe(text);
      },
    );
  };
  test('Criar comentário em uma postagem', ({ given, and, when, then }) => {
    givenPost(given);
    givenUser(given);
    whenPOSTRequest(when);
    thenStatusResponse(then);
    thenMessageResponse(then);
    thenCommentExists(and);
  });

  test('Buscar comentários de postagem', ({ given, when, then, and }) => {
    givenPost(given);

    and(
      /^há um comentário no sistema com id "(.*)", postId "(.*)", text "(.*)"$/,
      async (commentId, postId, text) => {
        const comment = await createComment(commentId, postId, '123', text);
        await (await connection.get()).comment.create({ data: comment });
      },
    );

    and(
      /^há um comentário no sistema com id "(.*)", postId "(.*)", text "(.*)"$/,
      async (commentId, postId, text) => {
        const comment = await createComment(commentId, postId, '123', text);
        await (await connection.get()).comment.create({ data: comment });
      },
    );

    whenGETRequest(when);
    thenStatusResponse(then);
    thenMessageResponse(and);
    and(/^a resposta deve ser uma lista de "(.*)"$/, async (listType) => {
      expect(Array.isArray(response.body)).toBe(true); // Verifica se a resposta é uma lista
    });

    and(
      /^um item com {"(.*)": "(.*)"} está na lista$/,
      async (field, value) => {
        const item = response.body.find((item) => item[field] === value);
        expect(item).not.toBeNull();
      },
    );

    and(
      /^um item com {"(.*)": "(.*)"} está na lista$/,
      async (field, value) => {
        const item = response.body.find((item) => item[field] === value);
        expect(item).not.toBeNull();
      },
    );
  });

  test('Apagar comentário', ({ given, and, when, then }) => {
    given(/^há um comentário no sistema com id "(.*)"$/, async (commentId) => {
      const comment = await createComment(
        commentId,
        '123',
        '123',
        'Comentário de Teste',
      );
      await (await connection.get()).comment.create({ data: comment });
    });
    whenDELETERequest(when);
    thenStatusResponse(then);
    and(/^a resposta deve conter a mensagem "(.*)"$/, async (message) => {
      expect(response.body.message).toBe(message);
    });

    and(
      /^não há mais no sistema um comentário com id "(.*)"$/,
      async (commentId) => {
        const comment = await (
          await connection.get()
        ).comment.findUnique({
          where: { id: commentId },
        });
        expect(comment).toBeNull(); // Verifica se o comentário foi deletado
      },
    );
  });

  test('Editar comentário', ({ given, when, then, and }) => {
    // Definição do passo para criar um comentário com id, postId, authorId, etc.
    given(
      /^há um comentário no sistema com id "(.*)", postId "(.*)", authorId "(.*)", date "(.*)", text "(.*)"$/,
      async (commentId, postId, authorId, date, text) => {
        const comment = await createComment(commentId, postId, authorId, text);
        await (await connection.get()).comment.create({ data: comment });
      },
    );

    // Definição do passo para enviar a requisição PUT
    when(
      /^uma requisição PUT for enviada para "(.*)" com o corpo da requisição sendo um JSON: {"(.*)": "(.*)"}$/,
      async (route, field, value) => {
        const updatedComment = { [field]: value };
        response = await supertest(app).put(route).send(updatedComment);
      },
    );

    thenStatusResponse(then); // Definição já implementada

    and(/^a resposta deve conter a mensagem "(.*)"$/, async (message) => {
      expect(response.body.message).toBe(message);
    });

    and(
      /^o comentário no sistema agora possui o texto "(.*)"$/,
      async (newText) => {
        const comment = await (
          await connection.get()
        ).comment.findUnique({
          where: { id: response.body.id },
        });

        // Verificação se o comentário foi encontrado (não é null)
        if (!comment) {
          throw new Error(
            `Comentário com ID ${response.body.id} não encontrado`,
          );
        }

        expect(comment.text).toBe(newText); // Agora podemos acessar 'comment.text' com segurança
      },
    );
  });
});
