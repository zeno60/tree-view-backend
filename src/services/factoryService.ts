import { Factory } from "../models/Factory";
import { CreateFactoryRequest } from "../interfaces/CreateFactoryRequest";
import { getConnection } from "typeorm";
import { Tree } from "../models/Tree";
import { getRandomNumber } from "../utils/randomUtil";

export interface FactoryService {
    addFactoryToTree(tree: Tree, createFactoryRequest: CreateFactoryRequest): Promise<Factory>;
    updateFactory(factory: Factory, updateFactoryRequest: CreateFactoryRequest): Promise<Factory>;
    getFactoryById(factoryId: number): Promise<Factory>;
    deleteFactoryById(factoryId: number): Promise<void>;
}

export class FactoryServiceImpl implements FactoryService {

    public async deleteFactoryById(factoryId: number): Promise<void> {
        const factory = await this.getFactoryById(factoryId);
        const factoryRepository = getConnection().getRepository(Factory);
        await factoryRepository.remove(factory);
    }

    public async getFactoryById(factoryId: number): Promise<Factory> {
        const factoryRepository = getConnection().getRepository(Factory);
        return await factoryRepository.findOne({ where: { id: factoryId }, relations: ["tree"]});
    }

    public async updateFactory(factory: Factory, updateFactoryRequest: CreateFactoryRequest): Promise<Factory> {
        const factoryRepository = getConnection().getRepository(Factory);

        const { min, max, number, name } = updateFactoryRequest;
        const values: number[] = [];

        for(let i = 0; i < number; i++) {
            values.push(getRandomNumber(min, max));
        }

        factory.name = name;
        factory.min = min;
        factory.max = max;
        factory.values = values;

        return factoryRepository.manager.save(factory);
    }

    public async addFactoryToTree(tree: Tree, createFactoryRequest: CreateFactoryRequest): Promise<Factory> {
        const treeRepository = getConnection().getRepository(Tree);
        const factoryRepository = getConnection().getRepository(Factory);
        const { min, max, number, name } = createFactoryRequest;
        const values: number[] = [];

        for(let i = 0; i < number; i++) {
            values.push(getRandomNumber(min, max));
        }

        let factory = new Factory();
        factory.name = name;
        factory.values = values;
        factory.min = min;
        factory.max = max;

        factory = await factoryRepository.manager.save(factory);

        if (!tree.factories) {
            tree.factories = [factory];
        } else {
            tree.factories.push(factory);
        }

        await treeRepository.manager.save(tree);

        return factory;
    }

}