import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tema } from "../entities/tema.entity";
import { DeleteResult, ILike, Repository } from "typeorm";


@Injectable()
export class TemaService{

    constructor(
        @InjectRepository(Tema)
        private temaRepository: Repository<Tema>
    ){}

    async findAll(): Promise<Tema[]>{
        return this.temaRepository.find({
            relations: {
                postagem: true
            }
        }
        );
    }

  async findById(id:number):Promise<Tema>{
          //SELECT * FROM tb_postagem WHERE id = ?;
          const postagem = await this.temaRepository.findOne({
              where: {
                  id
              },
              relations: {
                postagem: true
            }
          })
  
          if(!postagem)
              throw new HttpException('Tema não encontrada', HttpStatus.NOT_FOUND)
  
          return postagem;
      }


    async findByDescricao(descricao: string): Promise<Tema[]>{
        return this.temaRepository.find({
            where: {
                descricao: ILike(`%${descricao}%`)
            },
            relations: {
                postagem: true
            }
        });
    }

    async create(tema: Tema): Promise<Tema>{
        return await  this.temaRepository.save(tema);

    }

    async upDate(tema: Tema): Promise<Tema>{

        await this.findById(tema.id)//Acessando o método findbyid

        //UPDATE tb_tema SET descricao = tema.descricap,
        //data = CURRENT_TIMESTAMP() where id = tema.id
        return await this.temaRepository.save(tema);
    }


    async delete(id: number): Promise<DeleteResult>{

        await this.findById(id)
        //DELETE tb_temas where id = ?
        return await this.temaRepository.delete(id);
    }
}