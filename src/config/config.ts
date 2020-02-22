import convict from 'convict';
import path from 'path';

const config = convict({
    cors: {
        appUrl: {
            doc: 'The origin url for cors',
            format: 'url',
            default: 'http://localhost:3001',
            env: 'ORIGIN_URL',
        }
    },
    port: {
        doc: 'The port to run on',
        format: 'int',
        default: 3000
    },
    env: {
        doc: 'The application environment.',
        format: ['production', 'local'],
        default: 'local',
        env: 'NODE_ENV'
    },
    database: {
        host: {
            doc: 'The db host.',
            format: '*',
            default: 'localhost',
            env: 'DB_HOST',
        },
        port: {
            format: 'port',
            default: 5432,
        },
        username: {
            format: '*',
            default: 'postgres'
        },
        password: {
            format: '*',
            default: 'changeme',
            env: 'DB_PASSWORD',
        },
        database: {
            format: '*',
            default: 'postgres',
        }
    }
});

const env = config.get('env');
config.loadFile(path.join(__dirname, env + '.json'));

config.validate({allowed: 'strict'});

export default config.getProperties();