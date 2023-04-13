import { NextFunction, Request, Response } from 'express';
const ObjectID = require("mongoose").Types.ObjectId;
import UserSchema from "../../types/Objects/UserSchema";
import { BadRequestException, NotFoundException } from '../../utils/exceptions';
import WidgetSchema from '../../types/Objects/WidgetSchema';

interface WidgetBody {
    widgetId?: number;
    name?: string;
    nbrPosts?: number;
}

export class Service {
    async getServices(req: Request, res: Response) {
        try {
            const users = await UserSchema.find().select("service");
            if (users.length > 0) {
                return res.status(200).json(users);
            }
        } catch (error) {
            return res.status(404).json({ message: 'No users found' });
        }
    }
    async createWidgets(req: Request, res: Response) {
        try {
            const user = await UserSchema.findById(req.params.id);
            //verifier la liste awant d'ajouter dans la db
            // on va envoyer la liste de la db et on va comparer avec la liste qu'on a recu
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const { WidgetName, params } = req.body;
            const widgets = { WidgetName, params };
            user.service.push(widgets);
            await user.save();
            return res.status(200).json({ message: 'Widget created !' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal error' });
        }
    }
    async getAllWidgets(req: Request, res: Response) {
        try {
            const user = await UserSchema.findById(req.params.id).select("-createAd -updateAd -__v");
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (user.service.length === 0) {
                return res.status(404).json({ message: 'No widgets were found' });
            }
            return res.status(200).json({message: 'Widgets send !', widgets: user.service });
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal error' });
        }
    }
    async editWidget(req: Request, body: WidgetBody, res: Response) {
        const userId = req.params.id;
        const widgetId = body.widgetId;
        const newName = req.body.params.name;
        const newNbrPosts = req.body.params.nbrPosts;
        try {
            const user = await UserSchema.findById(userId).select("-createAd -updateAd -__v -password -email -firstname -lastname -role");;
            if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }
            const widget = user.service.find(widget => widget._id == widgetId);
            if (!widget) {
                return res.status(404).json({ message: 'No widgets were found' })
            }
            const params = widget.params;
            params.forEach((param) => {
                param.name = newName;
                param.nbrPosts = newNbrPosts;
              }
            );
            await user.save();
            return res.status(200).json({ message: 'Widget updated !' });
        }catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal error' });
        }
    }
    async deleteWidget(req: Request, body: WidgetBody, res: Response) {
        const widgetId = body.widgetId;
        const userId = req.params.id;
        try {
            const user = await UserSchema.findById(userId).select("-createAd -updateAd -__v -password -email -firstname -lastname -role");
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            user.service.pull({ _id: widgetId});
            await user.save();
            return res.status(200).json({ message: 'Widget deleted !'});
        }
        catch {
            return res.status(500).json({ message: 'Internal error' });
        }
    }
    async getAllWidgetsID(req: Request, res: Response) {
        try {
            const user = await UserSchema.findById(req.params.id).select("-createAd -updateAd -__v -password -email -firstname -lastname -role");
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (user.service.length === 0) {
                return res.status(404).json({ message: 'No widgets were found' });
            }
            return res.status(200).json({message: 'Widgets ID send !', widgets: user.service });
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal error' });
        }
    }
}
