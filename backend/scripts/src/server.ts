import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import {PuppeteerObject, generateCSVFile, login} from './exportCSV';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config;
import {PrismaClient} from '@prisma/client';
export const prisma = new PrismaClient();
import {newUser} from './databaseScripts';

// ---------------------------  initialize ------------------------------//

/* This is setting up the server. */
const app = express();
const port = Number(process.env.PORT) || 3001;

/* This is setting up the body parser and cors. */
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

/* This is the code that serves the React app. */
app.use(express.static(path.resolve(__dirname, '../../../client/build')));

/* This is the route that handles the GET request to the / route. It returns a message saying
"Welcome to the server". */
app.get('/api', (req, res) => {
  res.send('Welcome to the server');
});

let loginObject: PuppeteerObject;
const testSession = false;

// ----------------------------  POST (Login) -------------------------------//

/* This is the route that handles the POST request to the /api/login route. It takes the username and
password from the request body and passes it to the login function. It then checks if the login was
successful. If it was, it returns a 200 status code, otherwise it returns a 401 status code.
testing username and login were alos added to produce a successfull auth response*/

app.post('/api/login', async (req, res) => {
  const testingUsername = 'test';
  const testingPassword = 'test';

  const requestUsername = req.body.username;
  const requestPassword = req.body.password;

  console.log(requestUsername);
  console.log(requestPassword);

  if (
    requestUsername === testingUsername &&
    requestPassword === testingPassword
  ) {
    res.sendStatus(200);
    console.log('testing session initiated');
  } else {
    // login to government sms (Spectrum Management System)
    loginObject = await login(requestUsername, requestPassword);

    /* This is checking if the login was successful. If it was, it returns a 200 status code, otherwise it
    returns a 401 status code. */
    if (!loginObject.response) {
      res.sendStatus(401);
      console.log('auth failed');
      loginObject.kill;
    } else {
      res.sendStatus(200);
      console.log('auth succeeded');
    }
  }
});

// ---------------------------  GET (Export) ------------------------------//

/* This is the route that handles the export request. It takes the loginObject from the previous login
request and passes it to the generateCSVFile function. It then downloads the file and deletes it. */

app.get('/api/CSVExport', async (req, res) => {
  // generate csv file
  const csvFilePath = await generateCSVFile(loginObject);

  // download file then delete it
  res.download(csvFilePath, err => {
    if (err) console.log(err);
    fs.unlinkSync(csvFilePath);
  });

  loginObject.kill;
});

// ------------------------- Frontend React App --------------------------//

/* This is the code that handles all other GET requests that are not handled before. It returns the
React app. */

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../../client/build', 'index.html'));
});

// ------------------------------  PORT --------------------------------//

/* This is the port that the server is running on. */
app.listen(port, () => {
  console.log('server is running on port ' + port);
});
