import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import {PuppeteerObject, generateCSVFile, login} from './exportCSV';
import dotenv from 'dotenv';
dotenv.config;

/**
 * If the current path includes any of the allowed paths, return the first allowed path that matches.
 * Otherwise, return the first allowed path.
 * @param {string[]} allowedPaths - An array of paths that the user is allowed to access.
 * @param {string} currentPath - The current path of the user.
 * @returns The first path that is included in the current path.
 */
function getRedirectPath(allowedPaths: string[], currentPath: string) {
  for (let i = 0; i < allowedPaths.length; i++) {
    const allowedPath = allowedPaths[i];
    if (allowedPath.includes(currentPath)) {
      return allowedPath;
    }
  }
  return allowedPaths[0];
}

// ---------------------------  Server Setup ------------------------------//

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

const corsAllowedList = [
  'https://spectrum-downloader.vercel.app',
  'http://localhost:3000',
];

/* This is setting up the cors.(Links allowed to access the API) */
app.use(
  cors({
    origin: corsAllowedList,
  })
);

/* This is the route that handles the GET request to the / route. It returns a message saying
"Welcome to the server". */
app.get('/api', (req, res) => {
  res.send('Welcome to the server');
});

// ------------------- Initialize Web scrapping object ----------------------//

let loginObject: PuppeteerObject;

// -------------------------  POST Route (Login) ---------------------------//

/* This is the route that handles the login request. It takes the username and password from the
request body and passes it to the login function. If the login is successful, it returns a 200
status code, otherwise it returns a 401 status code. */
app.post('/api/login', async (req, res) => {
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

// ------------------------  GET Route (Export) --------------------------//

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

// ----------------------- All other GET routes --------------------------//

/* This is the code that handles all other GET requests that are not handled before. It returns the
React app. */
app.get('*', (req, res) => {
  if (req.hostname === 'localhost') {
    res.redirect(corsAllowedList[1]);
  } else {
    const url = req.protocol + '://' + req.hostname;
    const redirectUrl = getRedirectPath(corsAllowedList, url);
    console.log(url);
    res.redirect(redirectUrl);
  }
});

// ------------------------------  PORT --------------------------------//

/* This is the port that the server is running on. */
app.listen(port, () => {
  console.log('server is running on port ' + port);
});
