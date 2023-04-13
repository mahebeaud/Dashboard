import app from './app';
import { Logger } from 'node-colorful-logger';
import Config from './env/envParser';
const logger = new Logger();
require('./database/db');

const port: number = Config.APP_PORT ? Config.APP_PORT : 8080;

app.listen(port, () => logger.info(`Server started on port ${port}`));
