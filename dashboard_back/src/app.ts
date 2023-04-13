import cors from 'cors';
import express from 'express';
import { UnknownRoutesHandler } from './middlewares/unknowRoute.handler';
import { ExceptionsHandler } from '../src/middlewares/exceptions.handler';

//import routes here
import { AuthController } from './routes/Auth/auth.controller';
import { UserController } from './routes/User/user.controller';
import { AboutController } from './routes/Service/about.controller';
import { ServiceController } from './routes/Service/service.controller';
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('Dashboard Epitech - ALL OK')) // Home route
app.use('/api/auth', AuthController) // Auth routes
app.use('/api/user', UserController) // User routes
app.use('/api/service', ServiceController) // Service routes
app.use('/api/auth/google', ServiceController) // Google auth routes
app.use('/about.json', AboutController); // About routes
app.all('*', UnknownRoutesHandler) // Unknow routes
app.use(ExceptionsHandler) // Exceptions handler

export default app;
