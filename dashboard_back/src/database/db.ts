import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`)
  .then(() => {
    console.log('Connexion à la database mongo db réussie.');
  }).catch((err: Error) => {
    console.log('Erreur lors de la connexion à la base de données:' + err.stack);
  });