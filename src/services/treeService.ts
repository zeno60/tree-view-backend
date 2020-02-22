import { CreateTreeRequest } from "../interfaces/CreateTreeRequest";
import { Tree } from "../models/Tree";
import { getConnection } from "typeorm";
import { Factory } from "../models/Factory";
import { injectable, inject } from "tsyringe";
import { FactoryService } from "./factoryService";

export interface TreeService {
    getTreeById(treeId: number): Promise<Tree>;
    getAllTrees(): Promise<Tree[]>;
    createTree(request: CreateTreeRequest): Promise<Tree>;
}

@injectable()
export class TreeServiceImpl implements TreeService {

    public constructor(
        @inject('FactoryService') private factoryService: FactoryService,
    ) { }

    public async getTreeById(treeId: number): Promise<Tree> {
        const treeRepository = getConnection().getRepository(Tree);
        return await treeRepository.findOne({ where: { id: treeId }, relations: ["factories"]});
    }

    public async getAllTrees(): Promise<Tree[]> {
        const treeRepository = getConnection().getRepository(Tree);
        return await getConnection().getRepository(Tree)
              .createQueryBuilder('tree')
              .leftJoinAndSelect(
                "tree.factories",
                "factories",
              )
              .orderBy("factories.id", "ASC")
              .getMany();
    }

    public async createTree(request: CreateTreeRequest): Promise<Tree> {
        const treeRepository = getConnection().getRepository(Tree);

        const tree = new Tree();
        tree.name = request.name;

        await treeRepository.manager.save(tree);

        await Promise.all(request.factories.map(factoryRequest => this.factoryService.addFactoryToTree(tree, factoryRequest)));

        return tree;
    }

}