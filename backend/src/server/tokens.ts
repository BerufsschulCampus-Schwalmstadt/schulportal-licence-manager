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

/**
 * It takes in a user's id and email, and returns a signed JWT
 * @param {IdAndEmail} userIdAndEmail - This is the payload that we want to sign.
 * @returns A string
 */
export function generateAccessToken(userIdAndEmail: IdAndEmail) {
  return jwt.sign(userIdAndEmail, process.env.ACCESS_TOKEN_SECRET as Secret, {
    expiresIn: '3s',
  });
}

/**
 * It creates a refresh token, pushes it to the database, and returns it
 * @param {IdAndEmail} userIdAndEmail - This is the object that contains the user's id and email.
 * @returns A refresh token
 */
export async function generateRefreshToken(userIdAndEmail: IdAndEmail) {
  const refreshToken = jwt.sign(
    userIdAndEmail,
    process.env.REFRESH_TOKEN_SECRET as Secret,
    {expiresIn: '1d'} // for testing
  );
  await pushRefreshToken(refreshToken, userIdAndEmail.id);
  return refreshToken;
}

// ------------------------  middleware  -------------------------//

/**
 * If the token is valid, the userId and email are added to the request object
 * @param {Request} req - Request - The request object.
 * @param {Response} res - Response - this is the response object that we will use to send a response
 * to the client.
 * @param {NextFunction} next - This is a function that we call when we want to move on to the next
 * middleware.
 * @returns The userId and email of the user.
 */
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log('testing auth');

  const accessToken = req.headers['authorization'];
  if (!accessToken) return res.sendStatus(401);

  console.log('got token');

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET as Secret,
    async (err, userIdAndEmail) => {
      if (err) {
        console.log('current token expired');
        refreshAccess(req, res, next);
      } else {
        req.userIdAndEmail = userIdAndEmail;
        req.accessToken = accessToken;
        next();
      }
    }
  );
}

export async function refreshAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log('attempting to refresh');

  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(401);
  const refreshToken: string = cookies.refreshToken;
  const refreshTokenUser = (await findUserByRefreshToken(refreshToken))
    ?.joyrUser;
  if (!refreshTokenUser) {
    console.log('refresh token not associated to a user');
    return res.sendStatus(403);
  }
  console.log('attempting to refresh');
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as Secret,
    (err, decodedElement) => {
      if (err) {
        console.log(
          'Invalid refresh token - please login (token may be expired)'
        );
        return res.sendStatus(403);
      }
      const decodedElementObject = JSON.parse(JSON.stringify(decodedElement));
      if (decodedElementObject.id !== refreshTokenUser.id) return 403;
      const userIdAndEmail: IdAndEmail = {
        id: decodedElementObject.id,
        email: decodedElementObject.email,
      };
      const newAccessToken = generateAccessToken(userIdAndEmail);
      console.log('refresh successful');
      req.user = refreshTokenUser;
      req.accessToken = newAccessToken;
      next();
    }
  );
}

//------------------ refresh route controller ---------------------//

/* A route that takes in a refresh token, and returns a new access token. */
tokenRefreshRouter.get('/', async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(401);
  const refreshToken: string = cookies.refreshToken;
  const refreshTokenUser = (await findUserByRefreshToken(refreshToken))
    ?.joyrUser;
  if (!refreshTokenUser) return res.sendStatus(403);
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as Secret,
    (err, decodedElement) => {
      if (err) return res.sendStatus(403);
      const decodedElementObject = JSON.parse(JSON.stringify(decodedElement));
      if (decodedElementObject.id !== refreshTokenUser.id) return 403;
      const userIdAndEmail: IdAndEmail = {
        id: decodedElementObject.id,
        email: decodedElementObject.email,
      };
      const newAccessToken = generateAccessToken(userIdAndEmail);
      const responseInfo = {
        userId: refreshTokenUser.id,
        userEmail: refreshTokenUser.email,
        userRole: refreshTokenUser.accountType,
        accessToken: newAccessToken,
      };
      res.send(responseInfo);
      console.log('new access token generated');
    }
  );
});
