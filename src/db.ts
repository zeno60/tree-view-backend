import {createConnection, Connection} from "typeorm";
import config from './config/config';

const db = createConnection({
    type: 'postgres',
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    entities: [
        __dirname + "/models/*.js"
    ],
    synchronize: true,
});

export default db;