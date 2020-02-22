import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany} from "typeorm";
import { Factory } from './Factory';

@Entity()
export class Tree {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => Factory, factory => factory.tree)
    factories: Factory[];
}