import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import getStat from 'util';

const routes = Router();

routes.get('/audio/:fileName', async (req, res) => {
  const fileName = req.params.fileName;

  const highWaterMark =  16;

  const statPromisify = getStat.promisify(fs.stat);
  const filePath = './audios/'+fileName;
  console.log(filePath)

  const stat = await statPromisify(filePath);

  res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size
  });

  try {
    const stream = fs.createReadStream(filePath, { highWaterMark,  flag: '--unhandled-rejections=strict' });

    stream.on('end', () => {
      stream.pause();
      stream.close();
      stream.destroy();
      console.log('acabou')
  
    });
  
    stream.on("error", err => reject(err));
    stream.pipe(res);

   } catch (ex) {

    if (ex instanceof TypeError) {
     Promise.resolve();
     return;
    }
   }

});

routes.delete('/delete', (req, res) => {
  const reqAudioName = req.body.audioName.replace(/\s/g, '');
  const audioName = './audios/'+reqAudioName;

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
  const testFolder = './audios/';

  function readDir(dir) {
    const struct = {};

    fs
      .readdirSync(dir)
      .sort((a) => fs.statSync(`${dir}/${a}`).mtime.getTime())
      .forEach((file) => {
        if (fs.lstatSync(`${dir}/${file}`).isFile()) {
          struct[file.replace('-', '_')] = null;
        } else if (fs.lstatSync(`${dir}/${file}`).isDirectory()) {
          struct[file.replace('-', '_')] = readDir(`${dir}/${file}`);
        }
      });

    return struct;
  }

  res.send(readDir(testFolder));
});

routes.post('/upload', async (req, res) => {
    const __dirname = path.resolve(path.dirname(''));

    const newpath = __dirname + "/audios/";
    const file = req.files.file;
    const filename = file.name.replace(/\s/g, '');
  
    await file.mv(`${newpath}${filename}`, (err) => {
      if (err) {
        res.status(500).send({ message: "File upload failed", code: 200 });
      }
      res.status(200).send({ message: "File Uploaded", code: 200 });
    });
});

export default routes;
