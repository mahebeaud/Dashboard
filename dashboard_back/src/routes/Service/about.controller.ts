import { Router, Request, Response } from 'express';
import { BadRequestException } from '../../utils/exceptions';
import { AboutService } from './about.service';

const AboutController = Router();
const About = new AboutService();

AboutController.get('/', (req: Request, res: Response) => {
  if (!req.body) {
    throw new BadRequestException('Missing body');
  }
  return About.getAbout(req, res);
});

export { AboutController };
