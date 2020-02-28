// O JSON não suporta upload de arquivos.

// Para conseguirmos fazer uploads de arquivos precisamos usar uma biblioteca que aceita o
// formato multipart-form-data, que é o unico formato que suporta o envio de arquivos fisicos.
// O multer será a biblioteca que usaremos para lidar com esse formato multipart-form-data.

// Nesse arquivo teremos toda a configuração da parte de uploads de arquivos.

import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

// O storage vai dizer como o multer vai guardar nossos arquivos de imagem. Nele poderiamos
// usar varios storages que o multer tem, como por exemplo, poderiamos guardar nossos arquivos
// de imagem dentro de um CDN(content delivery network) que sao servidores online feitos para
// armazenamento de arquivos fisicos(amazonS3 por exemplo).

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, callBack) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return callBack(err);

        return callBack(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
