import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import {PuppeteerObject, generateCSVFile, login} from './api';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config;
import {PrismaClient} from '@prisma/client';
import {authRouter} from './routes/auth';
export const prisma = new PrismaClient();

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
app.use(express.static(path.resolve(__dirname, '../../../frontend/build')));

/* This is the route that handles the GET request to the root api route. */
app.get('/api', (req, res) => {
  res.send('Welcome to the server');
});

let loginObject: PuppeteerObject;

// ----------------------------  POST (Login) -------------------------------//

/* Importing the auth.ts file and using it as a middleware.
all routes starting with /api/auth will use this file*/
app.use('/api/auth', authRouter);

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
  res.sendFile(
    path.resolve(__dirname, '../../../frontend/build', 'index.html')
  );
});

// ------------------------------  PORT --------------------------------//

/* This is the port that the server is running on. */
app.listen(port, () => {
  console.log('server is running on port ' + port);
});
