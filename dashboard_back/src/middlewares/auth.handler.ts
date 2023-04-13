import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedException, NotFoundException } from '../utils/exceptions';
import config from '../env/envParser';

export const AuthentificationHandler = async (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.header('Authorization') as string;
  try {
    const decoded: string | JwtPayload = jwt.verify(authToken, config.JWT_SECRET);
    if (!authToken) {
      return res.status(401).json(new UnauthorizedException('Missing token'));
    }
    if (typeof decoded === 'string') {
      return res.status(401).json(new UnauthorizedException('Invalid token'));
    }
    next();
  } catch (err) {
    return res.status(401).json(new UnauthorizedException('Invalid token after catch'));
  }
};
