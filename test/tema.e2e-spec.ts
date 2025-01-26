import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Testes dos Módulos Usuario e Auth (e2e)', () => {
  let token: any;
  let temaId: any;
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

  it('03 - Deve cadastrar um novo Tema ', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/temas')
      .set('Authorization', `${token}`)
      .send({
        descricao: 'Descrição Root',
      })
      .expect(201);

    temaId = resposta.body.id;
  });

  it('04 - Deve Listar todos os Temas', async () => {
    return request(app.getHttpServer())
      .get('/temas')
      .set('Authorization', `${token}`)
      .send({})
      .expect(200);
  });

  it('05 - Deve Listar Tema Por ID', async () => {
    return request(app.getHttpServer())
      .get('/temas/1')
      .set('Authorization', `${token}`)
      .send({})
      .expect(200);
  });

  it('06 - Deve Atualizar um Tema', async () => {
    return request(app.getHttpServer())
      .put('/temas')
      .set('Authorization', `${token}`)
      .send({
        id: temaId,
        descricao: 'Descrição Root - Atualizada',
      })
      .expect(200)
      .then((resposta) => {
        expect('Descrição Root - Atualizada').toEqual(resposta.body.descricao);
      });
  });

  it('07 - Deve Deletar um Tema', async () => {
    return request(app.getHttpServer())
      .delete('/temas/1')
      .set('Authorization', `${token}`)
      .send({})
      .expect(204);
  });

  //Método especial
  it('08 - Deve Listar um Tema Pela Descrição', async () => {
    return request(app.getHttpServer())
      .get('/temas/descricao/root')
      .set('Authorization', `${token}`)
      .send({})
      .expect(200);
  });
});
