import express from 'express';
import bodyParser, {json} from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import {PuppeteerObject, generateCSVFile, login} from './exportCSV';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config;

// ---------------------------  initialize ------------------------------//

/* This is setting up the server. */
const app = express();
const port = process.env.PORT || 3001;

/* This is setting up the body parser and cors. */
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

// root :)
app.get('/', (req, res) => {
  res.send('Welcome to the server');
});

let loginObject: PuppeteerObject;

// ----------------------------  POST (Login) -------------------------------//

/* This is the route that handles the login request. It takes the username and password from the
request body and passes it to the login function. If the login is successful, it returns a 200
status code, otherwise it returns a 401 status code. */
app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log(username);
  console.log(password);

  // login to government sms (Spectrum Management System)
  loginObject = await login(username, password);

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
});

// ---------------------------  GET (Export) ------------------------------//

/* This is the route that handles the export request. It takes the loginObject from the previous login
request and passes it to the generateCSVFile function. It then downloads the file and deletes it. */
app.get('/CSVExport', async (req, res) => {
  // generate csv file
  const csvFilePath = await generateCSVFile(loginObject);

  // download file then delete it
  res.download(csvFilePath, err => {
    if (err) console.log(err);
    fs.unlinkSync(csvFilePath);
  });

  loginObject.kill;
});

// ------------------------------  PORT --------------------------------//

/* This is the port that the server is running on. */
app.listen(port, () => {
  console.log('server is running on port 3001');
});
