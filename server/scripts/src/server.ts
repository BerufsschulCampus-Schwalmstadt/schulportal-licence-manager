import express from 'express';
import bodyParser, {json} from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import {PuppeteerObject, generateCSVFile, login} from './exportCSV';

// initialise server params
const app = express();
const port = 3001;
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

// Route that handles authentication
app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log(username);
  console.log(password);

  // login to government sms (Spectrum Management System)
  loginObject = await login(username, password);

  if (!loginObject.response) {
    // if login unsuccessfull send back 401 error code
    res.sendStatus(401);
    loginObject.kill;
  } else {
    // if login successfull send 200 success code
    res.sendStatus(200);
  }
});

// Route that handles csv export
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

app.listen(port, () => {
  console.log('server is running on port 3001');
});
