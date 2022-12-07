import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import {generateCSVString, getDate} from './generateCSVString';

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

  // get file content and path
  const csvString = await generateCSVString(username, password);
  const filePath = path.join(
    'temp_exports',
    'Active_Licences_Export_' + getDate() + '.csv'
  );

  // write temp file
  fs.writeFileSync(filePath, csvString);

  // download temp file then delete it
  res.download(filePath, err => {
    if (err) console.log(err);
    fs.unlinkSync(filePath);
  });
});

app.listen(port, () => {
  console.log('server is running on port 3001');
});
