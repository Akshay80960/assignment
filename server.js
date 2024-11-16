
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(3000, () => console.log('Server running on port 3000')))
  .catch((err) => console.error(err));
