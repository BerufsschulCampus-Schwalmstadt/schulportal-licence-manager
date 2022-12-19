import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import {
  PuppeteerObject,
  generateCSVFile,
} from './api-features/licenceDataExport';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config;
import {PrismaClient} from '@prisma/client';
import {authRouter} from './routes/auth';
import {dashboardRouter} from './routes/dashboard';
import {authenticateToken, tokenRefreshRouter} from './tokens';
import cookieParser from 'cookie-parser';
export const prisma = new PrismaClient();

// clear database on each server launch (for testing purposes)
prisma.refreshToken
  .deleteMany()
  .then(count => console.log(count))
  .then(() => prisma.joyrUser.deleteMany().then(count => console.log(count)));

// ---------------------------  initialize ------------------------------//

// initialize server
const app = express();
const port = Number(process.env.PORT) || 3001;

// handle json type data
app.use(bodyParser.json());

// handle urlencoded type data
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// handle cookie type data
app.use(cookieParser());

// enable cors (origin acccess control)
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next();
// });

// code that serves static app
app.use(express.static(path.resolve(__dirname, '../../../frontend/build')));

let loginObject: PuppeteerObject;

// --------------------------root-------------------------------//

/* This is the route that handles the GET request to the root api route. */
app.get('/api', (req, res) => {
  res.send('Welcome to the server');
});

// ---------------------------  POST (Auth) -------------------------------//

/* This is setting up the routes for the auth and refresh tokens. */
app.use('/api/auth', authRouter);
app.use('/api/refresh', tokenRefreshRouter);

// --------------------- Auth Barrier middleware -------------------------//

app.use(authenticateToken);
// everything after this will need to be authenticated to be accessed

// ------------------------  GET (dashboard/home) -------------------------//

app.use('/api/dashboard', dashboardRouter);

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
