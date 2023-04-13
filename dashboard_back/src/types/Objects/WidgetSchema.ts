import mongoose from 'mongoose';

const widgetSchema = new mongoose.Schema({
  WidgetName: { type: String, trim: true },
    params: [{
      name: { type: String, trim: true },
      id: { type: Number, trim: true },
      nbrPosts: { type: Number, trim: true, required: false },
    }],
    },
    {
      timestamps: true,
    }
);

export default widgetSchema;