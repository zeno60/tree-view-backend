import 'reflect-metadata';
import config from './config/config';
import app from "./app";
import { createConnection } from 'typeorm';

/**
 * Error Handler. Provides full stack - remove for production
 */
// app.use(errorHandler());

const dbConnection = async () => {
    console.log('CONNECTING TO DB:', config.database.host);

    try {
        await createConnection({
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

        console.log('CONNECTED TO DATABASE', config.database.host)
    } catch (error) {
        console.log('UNABLE TO CONNECT TO DATABASE');
        console.error(error);

        // try connecting again in 3 sec intervals
        setTimeout(dbConnection, 3000);
    }
}

// connect to db
dbConnection();

/**
 * Start Express server.
 */
const server = app.listen(config.port, () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        config.port,
        config.env
    );
    console.log("  Press CTRL-C to stop\n");
});

export default server;