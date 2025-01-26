import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { send } from 'process';

describe('Testes dos Módulos Usuario e Auth (e2e)', () => {
  let token: any;
  let usuarioId: any;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + './../src/**/entities/*.entity.ts'],
          synchronize: true,
          dropSchema: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('01 - Deve cadastrar um novo usuario ', async () => {
    // Indica que executará um teste
    const resposta = await request(app.getHttpServer()) // Receberá o método request
      .post('/usuarios/cadastrar') // enviará a requisição pelo endPoint
      .send({
        // definie os dados do objeto usuario, que serão enviado
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
      })
      .expect(201); //Atrves  desse método para checar se a resposta HTTP

    usuarioId = resposta.body.id;
  });

  it('02 - Não Deve Cadastrar um Usuário Duplicado', async () => {
    await request(app.getHttpServer()) // cria uma requisição para o servidor de aplicação.
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
      })
      .expect(400); //  Esse comando define o que o teste espera como resposta do servidor.
  });

  it('03 - Deve Autenticar o Usuário (Login)', async () => {
    const resposta = await request(app.getHttpServer()) // Esse comando cria uma requisição para o servidor de aplicação e armazena a resposta em uma variável chamada resposta.
      .post('/usuarios/logar') // o endpoint para login de usuário.
      .send({
        // Esse comando envia as credenciais do usuário para serem autenticadas. Nesse caso, o usuário tem as seguintes
        usuario: 'root@root.com',
        senha: 'rootroot',
      })
      .expect(200);

    token = resposta.body.token; //Esse comando armazena o token de autenticação retornado pelo servidor na variável token. Esse token será usado em testes subsequentes para autenticar o usuário.
  });

  it('04 - Deve Listar todos os Usuarios', async () => {
    return request(app.getHttpServer())
      .get('/usuarios/all')
      .set('Authorization', `${token}`) //Adiciona um cabeçalho de autorização à requisição com o token de autenticação.
      .send({}) // Não é necessário enviar nenhum dado no corpo da requisição, pois é uma requisição GET
      .expect(200);
  });

  it('05 - Deve Atualizar um Usuário', async () => {
    return request(app.getHttpServer())
      .put('/usuarios/atualizar')
      .set('Authorization', `${token}`)
      .send({
        id: usuarioId,
        nome: 'Root Atualizado',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
      })
      .expect(200)
      .then((resposta) => {
        //.then, é possível acessar a resposta da requisição e verificar se o nome do usuário foi atualizado corretamente.
        expect('Root Atualizado').toEqual(resposta.body.nome);
      });
  });


  it('06 - Deve Listar Usuário Por ID', async () =>{
    return request(app.getHttpServer())
    .get('/usuarios/1')
    .set('Authorization', `${token}`)
    .send({})
    .expect(200)
  })
});
