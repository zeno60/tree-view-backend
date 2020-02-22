import { CreateFactoryRequest } from "./CreateFactoryRequest";

export interface CreateTreeRequest {
    name: string;
    factories: CreateFactoryRequest[];
};