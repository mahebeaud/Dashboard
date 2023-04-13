import { Router, Request, Response } from 'express';
import { BadRequestException } from '../../utils/exceptions';
import { Service } from './service.service';
import { AuthentificationHandler } from '../../middlewares/auth.handler';

const ServiceController = Router();
const service = new Service();

ServiceController.get('/all', AuthentificationHandler, (req: Request, res: Response) => {
  if (!req.body) {
    throw new BadRequestException('Missing body');
  }
  return service.getServices(req, res);
});

ServiceController.post('/widgets/:id', (req: Request, res: Response) => {
  if (!req.body || !req.params.id) {
    throw new BadRequestException('Missing body and/or id');
  }
  return service.createWidgets(req, res);
});

ServiceController.get('/widgets/all/:id', AuthentificationHandler, (req: Request, res: Response) => {
  if (!req.body || !req.params.id) {
    throw new BadRequestException('Missing body and/or id');
  }
  return service.getAllWidgets(req, res);
});

ServiceController.put('/widgets/:id', (req: Request, res: Response) => {
  if (!req.body || !req.params.id) {
    throw new BadRequestException('Missing body and/or id');
  }
  return service.editWidget(req, req.body, res);
});

ServiceController.delete('/widgets/:id', (req: Request, res: Response) => {
  if (!req.params.id) {
    throw new BadRequestException('Missing body and/or id');
  }
  return service.deleteWidget(req, req.body, res);
});

ServiceController.get('/current/widgets/:id', (req: Request, res: Response) => {
  if (!req.params.id) {
    throw new BadRequestException('Missing body and/or id');
  }
  return service.getAllWidgetsID(req, res);
});


export { ServiceController };
