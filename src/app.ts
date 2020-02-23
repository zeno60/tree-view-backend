import express from 'express';
import bodyParser from 'body-parser';
import config from './config/config';
import cors from 'cors';
import {container} from "tsyringe";
import helmet from 'helmet';

const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

container.register('io', {
    useValue: io
});

// express config
app.set("port", config.port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

// options for cors midddleware
const options:cors.CorsOptions = {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: config.cors.appUrl,
    preflightContinue: false
};

// use cors middleware
app.use(cors(options));

// tree-view stuff
import { TreeController } from "./controllers/treeController";
import { TreeServiceImpl } from "./services/treeService";
import { FactoryServiceImpl } from './services/factoryService';
import { FactoryController } from './controllers/factoryController';
import { SocketServiceImpl } from './services/socketService';

container.register('SocketService', {
    useClass: SocketServiceImpl
});

container.register('TreeService', {
    useClass: TreeServiceImpl
});

container.register('FactoryService', {
    useClass: FactoryServiceImpl
});

const treeController: TreeController = container.resolve(TreeController);
const factoryController: FactoryController = container.resolve(FactoryController);

app.get('/tree', treeController.getTrees);
app.post('/tree', treeController.createTree);
app.post('/tree/:treeId/factory', factoryController.addFactoryToTree);
app.put('/factory/:factoryId', factoryController.updateFactory);
app.delete('/factory/:factoryId', factoryController.deleteFactory);

//enable pre-flight
app.options("*", cors(options));

export default http;