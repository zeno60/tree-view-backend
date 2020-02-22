import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import { Tree } from './Tree';

@Entity()
export class Factory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    min: number;

    @Column()
    max: number;

    @Column("simple-array")
    values: number[];

    @ManyToOne(type => Tree, tree => tree.factories)
    tree: Tree;
}