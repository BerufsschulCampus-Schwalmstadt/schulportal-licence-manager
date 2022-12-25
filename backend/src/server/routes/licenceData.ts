import express from 'express';
import {
  PuppeteerObject,
  generateLicenceTableObject,
  login,
} from '../features/licenceDataFunctions';
export const licenceDataRouter = express.Router();

// dashboard home route
licenceDataRouter.get('/', async (req, res) => {
  console.log('access granted, getting data');
  const loginObject: PuppeteerObject = await login(
    'Rogers_TCS',
    'Sf16}2dDA$)p'
  );
  console.log('sms login successfull');
  const data = await generateLicenceTableObject(loginObject);
  loginObject.kill();
  console.log(data);
  return res.status(200).send(data);
});
