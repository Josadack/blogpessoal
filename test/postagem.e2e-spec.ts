import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Testes dos Módulos Usuario e Auth (e2e)', () => {
  let token: any;
  let usuarioId: any;
  let temaId: any;
  let postagemId: any;
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
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
      })
      .expect(201);

    usuarioId = resposta.body.id;
  });

  it('02 - Deve Autenticar o Usuário (Login)', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/logar')
      .send({
        usuario: 'root@root.com',
        senha: 'rootroot',
      })
      .expect(200);

    token = resposta.body.token;
  });

  //Preciso criar um tema, para criar uma postagem
  it('03 - Deve cadastrar um novo Tema ', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/temas')
      .set('Authorization', `${token}`)
      .send({
        descricao: 'Descrição Root',
        nome: 'Tema Root',
      })
      .expect(201);

    console.log('Resposta do tema:', resposta.body);
    temaId = resposta.body.id;
  });

  it('04 - Deve Cadastrar uma nova Postagem ', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/postagens')
      .set('Authorization', `${token}`)
      .send({
        titulo: 'Titulo Root',
        texto: 'Texto Root',
        data: '2025-01-01',
        tema: temaId,
        usuario: usuarioId,
      })
      .expect(201);

    console.log('Resposta da postagem:', resposta.body);
    postagemId = resposta.body.id;
  });

  it('05 - Deve Listar todas as Postagens', async () => {
    return request(app.getHttpServer())
      .get('/postagens')
      .set('Authorization', `${token}`)
      .send({})
      .expect(200);
  });

  it('06 - Deve Listar uma Postagens Por ID', async () => {
    return request(app.getHttpServer())
      .get('/postagens/1')
      .set('Authorization', `${token}`)
      .send({})
      .expect(200);
  });

  it('07 - Deve Atualizar uma Postagem', async () => {
    return request(app.getHttpServer())
      .put('/postagens')
      .set('Authorization', `${token}`)
      .send({
        id: postagemId,
        titulo: 'Titulo Root - Atualizado',
        texto: 'Texto Root  - Atualizado',
        data: '2025-01-01',
        tema: temaId,
        usuario: usuarioId,
      })
      .expect(200)
      .then((resposta) => {
        expect('Titulo Root - Atualizado').toEqual(resposta.body.titulo);
      });
  });

  it('08 - Deve Deletar uma Postagens', async () => {
    return request(app.getHttpServer())
      .delete('/postagens/1')
      .set('Authorization', `${token}`)
      .send({})
      .expect(204);
  });

  //Método especial pesquisar por titulo
  it('09 - Deve Buscar Titulo pelo nome', async () => {
    return request(app.getHttpServer())
    .get('/postagens/titulo/root')
    .set('Authorization', `${token}`)
    .send({})
    .expect(200)
  })

});
