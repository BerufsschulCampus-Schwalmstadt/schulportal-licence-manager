import express from 'express';
import bcrypt from 'bcrypt';
import {findUserByEmail, newUser} from '../../database/database';
export const authRouter = express.Router();

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

authRouter.post('/signup', async (req, res) => {
  const reqEmail = req.body.email;
  const reqPassword = await encryptPassword(req.body.password);

  console.log(reqEmail);
  console.log(reqPassword);

  const createdUser = await newUser(reqEmail, reqPassword);

  res.send(createdUser).status(200);
});

authRouter.post('/login', async (req, res) => {
  const reqEmail = req.body.email;
  const reqPassword = req.body.password;

  console.log(reqEmail);
  console.log(reqPassword);

  const userToLogin = await findUserByEmail(reqEmail);

  if (!userToLogin) {
    res.sendStatus(404);
  } else {
    const databasePassword = userToLogin.password;
    const isCorrectCredentials = await verifyPassword(
      reqPassword,
      databasePassword
    );
    if (isCorrectCredentials) {
      res.send(userToLogin).status(200);
    } else {
      res.sendStatus(401);
    }
  }
});
