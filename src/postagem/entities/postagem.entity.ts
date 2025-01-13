import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "tb_postagens"})
export class Postagem{

    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty() //validação dados do objetos
    @Column({length: 100, nullable:false})
    titulo: string;
    
    @IsNotEmpty() //validação dados do objetos
    @Column({length: 1000, nullable:false})
    texto: string;

    @UpdateDateColumn()
    data: Date;
}