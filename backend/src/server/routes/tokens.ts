import express, {Request, Response, NextFunction} from 'express';
import jwt, {Secret} from 'jsonwebtoken';
import {pushRefreshToken} from '../../database/database';
import * as dotenv from 'dotenv';
import {joyrUser} from '@prisma/client';
export const tokenRefreshRouter = express.Router();
dotenv.config();

//-------------------generator functions---------------------//

export function generateAccessToken(user: joyrUser) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as Secret, {
    expiresIn: '15s',
  });
}

export function generateRefreshToken(user: joyrUser) {
  const refreshToken = jwt.sign(
    user,
    process.env.REFRESH_TOKEN_SECRET as Secret,
    {expiresIn: '1d'}
  );
  pushRefreshToken(refreshToken, user.id); // done in the background (not awaited)
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

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user as joyrUser;
    next();
  });
}

//--------------------- route controller ---------------------//

// export async function handleRefreshTokens(req: Request, res: Response) {
//   const refreshToken = req.body.refreshToken;
//   if (!refreshToken) return res.sendStatus(401);
//   console.log(refreshToken);

//   const foundUser = (await findUserByRefreshToken(refreshToken))?.joyrUser;
//   if (!foundUser) return res.sendStatus(403);

//   jwt.verify(
//     refreshToken as string,
//     process.env.REFRESH_TOKEN_SECRET as Secret,
//     (err, user) => {
//       if (err || (user as joyrUser).id !== foundUser.id) {
//         return res.sendStatus(403);
//       }
//       res.send(generateAccessToken(user as joyrUser)).status(200);
//     }
//   );
// }

// //--------------------- refresh token route ------------------------//

// tokenRefreshRouter.get('/', handleRefreshTokens);
