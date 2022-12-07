import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import {closeBrowser, generateCSVFile, login} from './exportFunctions';

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

// teaser :)
app.get('/', (req, res) => {
  res.send('Welcome to the server');
});

// Route that handles credentials input logic
app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log(username);
  console.log(password);

  // login to government sms (Spectrum Management System)
  const loginObject = await login(username, password);

  if (!loginObject.response) {
    // if login unsuccessfull send back 401 error code
    res.send(401);
  } else {
    // if login successfull send 200 success code
    res.send(200);

    // generate csv file
    const csvFilePath = await generateCSVFile(loginObject);

    // download file then delete it
    res.download(csvFilePath, err => {
      if (err) console.log(err);
      fs.unlinkSync(csvFilePath);
    });

    closeBrowser(loginObject);
  }
});

app.listen(port, () => {
  console.log('server is running on port 3001');
});
