/* eslint-disable import/no-unresolved */
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import fileupload from 'express-fileupload';
import { initializeApp, cert } from 'firebase-admin/app';
import routes from './routes.js';

initializeApp({
  credential: cert({
    project_id: process.env.project_id,
    client_email: process.env.client_email,
    private_key: JSON.parse(process.env.private_key)[0],
  }),
  storageBucket: process.env.storageBucket,
});

const port = process.env.PORT || 3005;

const app = express();
app.use(express.json());
app.use(cors());
app.use(fileupload());
app.use(express.static('audios'));
app.use(routes);

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.log(err);
  res.status(500).send('Ocorreu um erro interno no servidor');
});

app.listen(port, () => {
  console.log(`API Started at ${port}`);
});
