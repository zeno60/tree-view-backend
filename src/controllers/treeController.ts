import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { TreeService } from "../services/treeService";
import { CreateTreeRequest } from "../interfaces/CreateTreeRequest";
import { isValidCreateTreeRequest } from "../utils/randomUtil";
import { SocketService } from "../services/socketService";

@injectable()
export class TreeController {

    public constructor(
        @inject('TreeService') private treeService: TreeService,
        @inject('SocketService') private socketService: SocketService,
    ) { }

    public getTrees = async (request: Request, response: Response): Promise<void> => {
        const trees = await this.treeService.getAllTrees();

        response.status(200);
        response.send(trees);
    }

    public createTree = async (request: Request, response: Response): Promise<void> => {
        const createTreeRequest: CreateTreeRequest = request.body;

        if (!isValidCreateTreeRequest(createTreeRequest)) {
            response.status(400);
            response.send('Invalid request body');
        } else {
            const tree = await this.treeService.createTree(createTreeRequest);

            this.socketService.sendMessage({
                type: 'ADD_TREE',
                data: tree,
            });

            response.status(201);
            response.send(tree);
        }
    }
}