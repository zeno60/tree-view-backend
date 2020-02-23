import { injectable, inject } from "tsyringe";
import { Factory } from "../models/Factory";
import { Tree } from "../models/Tree";

export type MessageType = 'DELETE_FACTORY' | 'UPDATE_FACTORY' | 'ADD_FACTORY' | 'ADD_TREE';

export interface SocketMessage {
    type: MessageType;
    data: number | Factory | Tree | { treeId: number, factory: Factory } | { treeId: number, factoryId: number };
}

export interface SocketService {
    sendMessage(message: SocketMessage): Promise<void>;
}

@injectable()
export class SocketServiceImpl implements SocketService {

    public constructor(
        @inject('io') private io: SocketIO.Server,
    ) { }

    public async sendMessage(message: SocketMessage): Promise<void> {
        this.io.emit(message.type, message.data);
    }

}