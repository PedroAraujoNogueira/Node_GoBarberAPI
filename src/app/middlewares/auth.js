import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, resp, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return resp.status(401).json({ error: 'Token not provided.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    /* jwt.verify(token, secret, function (err, payload) {
    if (err) {
           console.error('token inválido');
    } else {
       console.log(payload);
    }
    }); */
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (error) {
    return resp.status(401).json({ error: 'Token inválid.' });
  }
};
