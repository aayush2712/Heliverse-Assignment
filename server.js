const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const path = require('path');
const fileUpload = require('express-fileupload');
const user = require('./routes/user');

dotenv.config({ path: './config.env' });

const app = express();
app.use(express.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'uploads')));

connectDB();

app.use('/user', user);

app.listen(
  process.env.PORT,
  console.log(`Server running on port ${process.env.PORT}`)
);
