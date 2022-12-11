import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config;

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

/* This is setting up the cors.(Links allowed to access the API) */
app.use(cors());

/* This is the code that serves the React app. */
app.use(express.static(path.resolve(__dirname, '../../../client/build')));

// ----------------------- All other GET routes --------------------------//

/* This is the code that handles all other GET requests that are not handled before. It returns the
React app. */
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../../client', 'index.html'));
});

// ------------------------------  PORT --------------------------------//

/* This is the port that the server is running on. */
app.listen(port, () => {
  console.log('server is running on port ' + port);
});
