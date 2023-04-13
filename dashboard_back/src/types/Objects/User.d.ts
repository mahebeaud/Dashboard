import widgetSchema from "./WidgetSchema";

interface IUser  {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string | 'user' | 'admin';
  widgtes: any;
  created_at: Date;
  updated_at: Date;
}

export default IUser;