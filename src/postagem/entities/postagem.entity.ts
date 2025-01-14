import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "tb_postagens"})
export class Postagem{

    @PrimaryGeneratedColumn()
    id: number;

    @Transform(({ value }: TransformFnParams) => value?.trim())//remover os espaço em branco
    @IsNotEmpty() //validação dados do objetos
    @Column({length: 100, nullable:false})
    titulo: string;
    
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty() //validação dados do objetos
    @Column({length: 1000, nullable:false})
    texto: string;

    @UpdateDateColumn()
    data: Date;
}