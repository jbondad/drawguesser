/*
* Server Code
*
*
*/


require('dotenv').config('globalvar.env');
console.log(process.env.MONGO_URI)

const port = process.env.PORT;
console.log(port);

// set up  server
const express = require('express'); 
const cors = require('cors');
const app = express(); // Creating the express application, the app object denotes the express application
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } }); // socket 
const socketlogicmodule = require('./socket/socketlogic');
const mongoconn = require('./database/mongoconn');
const socketlogic = socketlogicmodule.socketapp;


// database connection
mongoconn();

// Routers
const userRouter = require('./User/UserRouter');

// middlewares
app.use(cors());
app.use(express.json());


io.on('connection', (socket) => {
    socketlogic(io, socket);
});

const URL = `http://localhost:${port}/`;

server.listen(port, () => {
    console.log('Listening on: ' + URL);
});


app.use('/user', userRouter);