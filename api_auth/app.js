const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dontenv = require('dotenv');
const app = express();

//Import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
 
//ENV config
dontenv.config();

//DB Connection
mongoose.connect(process.env.DB_CONNECT, 
        { useNewUrlParser: true, useUnifiedTopology: true  } , 
        () => console.log('connected to db'));




//Middleware
app.use(express.json());
//Route Middleware
app.use('/api/user/', authRoute);
app.use('/api/posts', postRoute);


app.listen(3000, () => console.log('Server started on 3000'));
