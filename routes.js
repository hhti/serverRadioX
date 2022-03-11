import { Router } from 'express';
import fs, { existsSync, mkdirSync, readdirSync } from 'fs';
import path from 'path';
import getStat from 'util';

const routes = Router();

routes.get('/audio/:fileName', async (req, res) => {
  const { fileName } = req.params;

  const highWaterMark = 16;

  const statPromisify = getStat.promisify(fs.stat);
  const filePath = `./audios/${fileName}`;
  console.log(filePath);

  const stat = await statPromisify(filePath);

  res.writeHead(200, {
    'Content-Type': 'audio/mpeg',
    'Content-Length': stat.size,
  });

  try {
    const stream = fs.createReadStream(filePath, { highWaterMark, flag: '--unhandled-rejections=strict' });

    stream.on('end', () => {
      stream.pause();
      stream.close();
      stream.destroy();
      console.log('acabou');
    });

    stream.on('error', () => {});
    stream.pipe(res);
  } catch (ex) {
    if (ex instanceof TypeError) {
      Promise.resolve();
    }
  }
});

routes.delete('/delete', (req, res) => {
  const reqAudioName = req.body.audioName.replace(/\s/g, '');
  const audioName = `./audios/${reqAudioName}`;

  const errors = [];

  [audioName].forEach((path) => {
    try {
      fs.rmSync(path);
    } catch (err) {
      errors.push(err);
    }
  });

  if (!errors.length) {
    return res.send(`Arquivo ${reqAudioName} excluído com sucesso.`);
  }

  return res.status(404).send({ error: `Arquivo ${reqAudioName}  já excluído ou inexistente.` });
});

routes.get('/getAudios', (_req, res) => {
  try {
    const audios = readdirSync('audios');
    return res.send({ audios });
  } catch (err) {
    return res.send({ audios: [] });
  }
});

routes.post('/upload', async (req, res) => {
  const __dirname = path.resolve(path.dirname(''));

  const newpath = `${__dirname}/audios/`;
  const { file } = req.files;
  const filename = file.name.replace(/\s/g, '');

  if (!existsSync(newpath)) {
    mkdirSync(newpath);
  }

  await file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      return res.status(500).send({ message: 'File upload failed', error: err.message });
    }
    return res.status(200).send({ message: 'File Uploaded' });
  });
});

export default routes;
