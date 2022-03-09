import cors from 'cors';
import express from 'express';
import routes from './routes.js';
import fileupload from "express-fileupload";


const port = 3005;

const app = express();
app.use(express.json());
app.use(cors());
app.use(fileupload());
app.use(express.static("audios"));
app.use(routes);


// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.log(err);
  res.status(500).send('Ocorreu um erro interno no servidor');
});

app.listen(port, () => {
  console.log(`API Started at ${port}`);
});
