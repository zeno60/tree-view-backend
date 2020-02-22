import 'reflect-metadata';
import config from './config/config';
import app from "./app";
import db from "./db";

/**
 * Error Handler. Provides full stack - remove for production
 */
// app.use(errorHandler());

/**
 * Start the database.
 */
console.log('CONNECTIONG TO DB:', config.database.host);
db.then(() => {
    console.log('DATABASE UP');
}).catch((reason) => {
    console.log('UNABLE TO CONNECT TO DATABASE');
    console.error(reason);
})

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

// const http = require('http').createServer(app);
// const io = require('socket.io')(http);


export default server;