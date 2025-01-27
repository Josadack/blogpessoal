import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Postagem } from "../../postagem/entities/postagem.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: "tb_temas"})
export class Tema{

    @PrimaryGeneratedColumn()
    @ApiProperty() 
    id: number;

    @Transform(({ value }: TransformFnParams) => value?.trim())//remover os espaço em branco
    @IsNotEmpty() //validação dados do objetos
    @Column({length: 300, nullable:false})
    @ApiProperty() 
    descricao: string;

    @ApiProperty() 
    @OneToMany(() => Postagem, (postagem) => postagem.tema)
    postagem: Postagem[];
    
}