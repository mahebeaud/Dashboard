import { BadRequestException, NotFoundException, UnauthorizedException } from "../../utils/exceptions";
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../env/envParser';
import { Logger } from "node-colorful-logger";
import User from '../../types/Objects/UserSchema';

const log = new Logger();

interface AuthBody {
  email?: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  token?: string;
}

export class AuthService {
  async register(body: AuthBody, res: Response) {
    if (!body.email || !body.password || !body.firstname || !body.lastname) {
      return res.status(400).json(new BadRequestException('Email, Fistname, Lastname and Password are required'));
    }
    try {
      const isUser = await User.findOne({ email: body.email });
      if (isUser) {
        return res.status(401).json(new BadRequestException('Email already exists'));
      }
      const pwd: string = body.password as string;
      const hash: string = await bcrypt.hash(pwd, 10);

      const newUser = new User({
        email: body.email,
        firstname: body.firstname,
        lastname: body.lastname,
        password: hash
      });
      await newUser.save();
      log.info(`User ${body.email} registered`);
      return res.status(200).json({ message: 'User registered successfuly' });

    } catch (error) {
      console.error(error);
      return res.status(500).json(new BadRequestException('Something went wrong'));
    }
  }
  async login(body: AuthBody, res: Response, req: Request) {
    if (!body.email || !body.password) {
      return res.status(400).json(new BadRequestException('Email and password are required'));
    }
    try {
      const isUser = await User.findOne({ email: body.email });
      if (!isUser) {
        return res.status(404).json(new NotFoundException('User not found'));
      }
      const pwd: string = body.password as string;
      const hash: string = isUser.password;
      const role: string = isUser.role;
      const match: boolean = await bcrypt.compare(pwd, hash);
      if (match) {
        const token = jwt.sign({id: isUser.id}, config.JWT_SECRET as string, {expiresIn: '24h'});
        return res.status(200).json({token: token, userId: isUser.id, role: role});
      } else {
        return res.status(401).json(new UnauthorizedException('Wrong password'));
      }
    } catch (error) {
      console.error(error);
      return res.status(400).json(new BadRequestException('Something went wrong'));
    }
  }
};
