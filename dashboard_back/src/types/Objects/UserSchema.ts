import * as mongoose from 'mongoose';
import IUser from './User';
import widgetSchema from './WidgetSchema';

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  service: {type: [widgetSchema] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', UserSchema);

export default User;