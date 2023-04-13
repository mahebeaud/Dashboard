export {};
import IUser  from '../Objects/User';

declare global {
  namespace Express {
    interface Request {
      userId: number;
      user?: IUser;
    }
  }
}
