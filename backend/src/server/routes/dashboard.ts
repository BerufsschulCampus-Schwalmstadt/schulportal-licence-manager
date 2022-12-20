import express from 'express';
import {findUserById} from '../../database/database';
import {joyrUser} from '@prisma/client';
export const dashboardRouter = express.Router();

// dashboard home route
dashboardRouter.get('/*', async (req, res) => {
  console.log('access granted');
  let user: joyrUser;
  if (req.user) {
    user = req.user;
  } else {
    user = (await findUserById(req.userIdAndEmail.id)) as joyrUser;
  }
  const responseInfo = {
    userId: user.id,
    userEmail: user.email,
    userRole: user.accountType,
    accessToken: req.accessToken,
  };
  res.send(responseInfo).status(200);
});
