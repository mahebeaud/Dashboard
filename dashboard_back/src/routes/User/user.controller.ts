import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';
import { BadRequestException, UnauthorizedException, NotFoundException } from '../../utils/exceptions';
import { UserService } from './user.service';
import { AuthentificationHandler } from '../../middlewares/auth.handler';

const UserController: Router = Router();
const user = new UserService();

UserController.get('/all', AuthentificationHandler, (req: Request, res: Response, next: NextFunction) => {
  //if (req.body.role !== 'admin') {
  //  throw new UnauthorizedException('You are not allowed to do this');
  //}
  return user.getUsers(res);
});

UserController.get('/:id', AuthentificationHandler, (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id || req.params.id === 'undefined') {
    throw new BadRequestException('Missing id');
  }
  //if (req.userId !== parseInt(req.params.id)) {
  //  throw new UnauthorizedException('You are not allowed to do this');
  //}
  return user.getUser(req.params.id, res);
});

 UserController.put('/:id', AuthentificationHandler, (req: Request, res: Response, next: NextFunction) => {
   if (!req.params.id || req.params.id === 'undefined') {
     throw new BadRequestException('Missing id');
   }
   if (!req.body) {
     throw new BadRequestException('Missing body');
   }
   //if (req.user?.role !== 'admin' && req.userId !== parseInt(req.params.id)) {
   //  throw new UnauthorizedException('You are not allowed to do this');
   //}
   return user.updateUser(req.params.id, req.body, res);
 });

UserController.delete('/:id', AuthentificationHandler, (req: Request, res: Response, next: NextFunction) => {
   if (!req.params.id || req.params.id === 'undefined') {
     throw new BadRequestException('Missing id');
   }
   //if (req.user?.role !== 'admin' && req.userId !== parseInt(req.params.id)) {
   //  throw new UnauthorizedException('You are not allowed to do this');
   //}
   return user.deleteUser(req.params.id, res);
 });

export { UserController };
