import express, {Request, Response, NextFunction} from 'express';
import jwt, {Secret} from 'jsonwebtoken';
import {findUserByRefreshToken, pushRefreshToken} from '../database/database';
import * as dotenv from 'dotenv';
export const tokenRefreshRouter = express.Router();
dotenv.config();

export type IdAndEmail = {
  id: string;
  email: string;
};

//-------------------generator functions---------------------//

export function generateAccessToken(userIdAndEmail: IdAndEmail) {
  return jwt.sign(userIdAndEmail, process.env.ACCESS_TOKEN_SECRET as Secret, {
    expiresIn: '20s',
  });
}

export async function generateRefreshToken(userIdAndEmail: IdAndEmail) {
  const refreshToken = jwt.sign(
    userIdAndEmail,
    process.env.REFRESH_TOKEN_SECRET as Secret
  );
  await pushRefreshToken(refreshToken, userIdAndEmail.id);
  return refreshToken;
}

// ------------------------  middleware  -------------------------//

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as Secret,
    (err, userIdAndEmail) => {
      if (err) return res.sendStatus(403);
      req.userIdAndEmail = userIdAndEmail;
      next();
    }
  );
}

//------------------ refresh route controller ---------------------//

tokenRefreshRouter.post('/', async (req, res) => {
  const refreshToken: string = req.body.token;
  if (!refreshToken) return res.sendStatus(401);
  const refreshTokenUser = (await findUserByRefreshToken(refreshToken))
    ?.joyrUser;
  if (!refreshTokenUser) return res.sendStatus(403);
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as Secret,
    (err, decodedElement) => {
      if (err) return res.sendStatus(403);
      const decodedElementObject = JSON.parse(JSON.stringify(decodedElement));
      const userIdAndEmail: IdAndEmail = {
        id: decodedElementObject.id,
        email: decodedElementObject.id,
      };
      const newAccessToken = generateAccessToken(userIdAndEmail);
      res.send({accessToken: newAccessToken});
    }
  );
});
