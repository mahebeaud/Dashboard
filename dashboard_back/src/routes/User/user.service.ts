import { NextFunction, Request, Response } from 'express';
const ObjectID = require("mongoose").Types.ObjectId;
import UserSchema from "../../types/Objects/UserSchema";
import { BadRequestException, NotFoundException } from '../../utils/exceptions';

interface UserBody {
  role?: string;
};

export class UserService {
  async getUsers(res: Response) {
    try {
        const users = await UserSchema.find().select("firstname lastname email role");
        if (users.length > 0) {
            return res.status(200).json(users);
        }
    } catch (error) {
        return res.status(404).json({ message: 'No users found' });
    }
  }
  async getUser(id: string, res: Response) {
    if (!ObjectID.isValid(id))
        return new BadRequestException("ID unknown : " + id);
    try {
      const user = await UserSchema.findById(id).select("firstname lastname email role");
      res.send(user);
    } catch (err) {
      console.log("ID unknown : " + err);
    }
  }
  async updateUser(id: string, body: UserBody, res: Response) {
    if (!id) {
      return res.status(400).json({ message: 'Missing id' });
    }
    const user = await UserSchema.findOneAndUpdate(
      { _id: new ObjectID(id) },
      { $set: { role: body.role} }
    );
    if (user) {
      return res.status(200).json({ message: 'User role updated !' });
    }
    return res.status(404).json({ message: 'User not found' });
  }
  async deleteUser(id: string, res: Response) {
    if (!id) {
      return res.status(400).json({ message: 'Missing id' });
    }
    const user = await UserSchema.findOneAndDelete({ _id: new ObjectID(id) });
    if (user) {
      return res.status(200).json({ message: 'User deleted' });
    }
    return res.status(404).json({ message: 'User not found' });
  }
}
