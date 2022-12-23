import express from 'express';
import bcrypt from 'bcrypt';
import {
  deleteRefreshToken,
  findUserByEmail,
  newUser,
} from '../../database/database';
import * as dotenv from 'dotenv';
import {generateAccessToken, generateRefreshToken, IdAndEmail} from './tokens';
dotenv.config();
export const authRouter = express.Router();

//------------------auth password handling--------------------//

async function encryptPassword(password: string) {
  // create a 10 character random string to fortify password
  const encryptionSalt = await bcrypt.genSalt(10);
  // create 1 way hash of password with the added salt
  return bcrypt.hash(password, encryptionSalt);
}

async function verifyPassword(password: string, encryptedPassword: string) {
  // compare password to encrypted hash in the database
  return await bcrypt.compare(password, encryptedPassword);
}

//--------------------- route controllers -------------------//

/* This is a post request to the signup route.
It takes the email and password from the request
body and encrypts the password. It is then creats
a new user with the email and encrypted password.
Lastly it sends the created user and a status of
200 to the requestor. */
authRouter.post('/signup', async (req, res) => {
  const reqEmail = req.body.email;
  const reqPassword = await encryptPassword(req.body.password);

  console.log(reqEmail);
  console.log(reqPassword);

  const userAlreadyExists = await findUserByEmail(reqEmail);
  if (userAlreadyExists) {
    console.log('user already exists');
    return res.status(409).send({authenticated: false});
  } else {
    const createdUser = await newUser(reqEmail, reqPassword);
    const userIdAndEmail: IdAndEmail = {
      id: createdUser.id,
      email: createdUser.email,
    };
    // create tokens
    const accessToken = generateAccessToken(userIdAndEmail);
    const refreshToken = await generateRefreshToken(userIdAndEmail); // this adds it to database
    const responseInfo = {
      authenticated: true,
      userId: createdUser.id,
      userEmail: createdUser.email,
      userRole: createdUser.accountType,
      accessToken: accessToken,
    };
    console.log(responseInfo);
    // send refreshtoken as a cookie and the rest as a json
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, //3days
    });
    res.status(200).send(responseInfo);
    console.log('user created successfully');
  }
});

/* This is a post request to the login route.
It takes the email and password from the request body and
compares it to the email and password in the database.
If the email and password match, it sends the user and
a status of 200 to the requestor. If the email and password
do not match, it sends a status of 401 to the requestor. */
authRouter.post('/login', async (req, res) => {
  const reqEmail = req.body.email;
  const reqPassword = req.body.password;

  console.log(reqEmail);
  console.log(reqPassword);

  const userToLogin = await findUserByEmail(reqEmail);

  if (!userToLogin) {
    console.log('user not found');
    return res.status(404).send({authenticated: false});
  } else {
    const databasePassword = userToLogin.password;
    const isCorrectCredentials = await verifyPassword(
      reqPassword,
      databasePassword
    );
    if (isCorrectCredentials) {
      const userIdAndEmail: IdAndEmail = {
        id: userToLogin.id,
        email: userToLogin.email,
      };
      // sign token
      const accessToken = generateAccessToken(userIdAndEmail);
      const refreshToken = await generateRefreshToken(userIdAndEmail);
      const responseInfo = {
        authenticated: true,
        userId: userToLogin.id,
        userEmail: userToLogin.email,
        userRole: userToLogin.accountType,
        accessToken: accessToken,
      };

      // send refreshtoken as a cookie and the rest as a json
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000, //3days
      });
      console.log('user logged in successfully');
      return res.send(responseInfo).sendStatus(200);
    } else {
      console.log('wrong credentials');
      return res.status(401).send({authenticated: false});
    }
  }
});

authRouter.delete('/logout', (req, res) => {
  deleteRefreshToken(req.cookies.refreshToken);
  console.log('successfully loged out');
  return res.status(204).send({authenticated: false});
});
