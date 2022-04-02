/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import { getStorage } from 'firebase-admin/storage';

const routes = Router();

routes.get('/audio/:fileName', async (req, res) => {
  const { fileName } = req.params;

  const file = getStorage().bucket().file(fileName);

  const [fileExist] = await file.exists();

  if (!fileExist) {
    return res.status(400).send({ error: `O audio ${fileName} não existe` });
  }

  res.writeHead(200, {
    'Content-Type': 'audio/mpeg',
    'Content-Length': file.metadata.size,
  });

  return file.createReadStream().pipe(res);
});

routes.delete('/delete', async (req, res) => {
  const reqAudioName = req.body.audioName.replace(/\s/g, '');

  try {
    await getStorage().bucket().file(reqAudioName).delete();
    return res.status(204).send();
  } catch (err) {
    return res.status(400).send({ error: 'O audio não existe ou já foi excluido' });
  }
});

routes.get('/getAudios', async (_req, res) => {
  const [files] = await getStorage().bucket().getFiles();
  const fileNames = files.map(({ name }) => name);
  return res.send({ audios: fileNames });
});

routes.post('/upload', (req, res) => {
  const { file } = req.files;
  const filename = file.name.replace(/\s/g, '');

  getStorage().bucket().file(filename).save(file.data)
    .then(() => res.status(200).send({ message: 'File Uploaded' }))
    .catch((err) => res.status(500).send({ message: 'File upload failed', error: err.message }));
});

export default routes;
