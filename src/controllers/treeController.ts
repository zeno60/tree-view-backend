import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { TreeService } from "../services/treeService";
import { CreateTreeRequest } from "../interfaces/CreateTreeRequest";
import { isValidCreateTreeRequest } from "../utils/randomUtil";

@injectable()
export class TreeController {

    public constructor(@inject('TreeService') private treeService: TreeService) { }

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

            response.status(201);
            response.send(tree);
        }
    }
}