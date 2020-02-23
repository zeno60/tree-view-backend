import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { TreeService } from "../services/treeService";
import { FactoryService } from "../services/factoryService";
import { CreateFactoryRequest } from "../interfaces/CreateFactoryRequest";
import { SocketService } from "../services/socketService";
import { isNumeric, isValidIdentifier, isValidCreateFactoryRequest } from "../utils/randomUtil";

@injectable()
export class FactoryController {

    public constructor(
        @inject('FactoryService') private factoryService: FactoryService,
        @inject('TreeService') private treeService: TreeService,
        @inject('SocketService') private socketService: SocketService,
        ) { }

    public addFactoryToTree = async (request: Request, response: Response): Promise<void> => {
        const { treeId } = request.params;
        const createFactoryRequest: CreateFactoryRequest = request.body;

        if (!isValidIdentifier(treeId)) {
            response.status(400);
            response.send(`${treeId} is not a valid tree id`);
        } else if (!isValidCreateFactoryRequest(createFactoryRequest)) {
            response.status(400);
            response.send(`Invalid request body`);
        } else {
            const tree = await this.treeService.getTreeById(+treeId);

            if (!tree) {
                response.status(404);
                response.send(`tree with id ${treeId} not found`);
            } else {
                const factory = await this.factoryService.addFactoryToTree(tree, createFactoryRequest);

                this.socketService.sendMessage({
                    type: 'ADD_FACTORY',
                    data: {
                        treeId: tree.id,
                        factory,
                    },
                });

                response.status(201);
                response.send(factory);
            }
        }
    }

    public updateFactory = async (request: Request, response: Response): Promise<void> => {
        const { factoryId } = request.params;
        const updateFactoryRequest: CreateFactoryRequest = request.body;

        if (!isValidIdentifier(factoryId)) {
            response.status(400);
            response.send(`${factoryId} is not a valid factory id`);
        } else if (!isValidCreateFactoryRequest(updateFactoryRequest)) {
            response.status(400);
            response.send(`Invalid request body`);
        } else {
            const factory = await this.factoryService.getFactoryById(+factoryId);

            if (!factory) {
                response.status(404);
                response.send(`factory with id ${factoryId} not found`);
            } else {
                const updatedFactory = await this.factoryService.updateFactory(factory, updateFactoryRequest);

                this.socketService.sendMessage({
                    type: 'UPDATE_FACTORY',
                    data: {
                        treeId: updatedFactory.tree.id,
                        factory: updatedFactory,
                    },
                });

                response.status(200);
                response.send(updatedFactory);
            }
        }
    }

    public deleteFactory = async (request: Request, response: Response): Promise<void> => {
        const { factoryId } = request.params;

        if (!isValidIdentifier(factoryId)) {
            response.status(400);
            response.send(`${factoryId} is not a valid factory id`);
        } else {
            const factory = await this.factoryService.getFactoryById(+factoryId);

            if (!factory) {
                response.status(404);
                response.send(`factory with id ${factoryId} not found`);
            } else {
                await this.factoryService.deleteFactoryById(+factoryId);

                this.socketService.sendMessage({
                    type: 'DELETE_FACTORY',
                    data: {
                        treeId: factory.tree.id,
                        factoryId: +factoryId,
                    },
                });

                response.status(204);
                response.send();
            }
        }
    }
}