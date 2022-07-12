import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { readdirSync } from "fs";
import colors from 'colors';


const morgan = require('morgan');
require('dotenv').config();

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"]
    },
})

//DB
mongoose.connect(process.env.MONGOURI)
    .then(() => console.log("DB CONNCECTED".green.bold))
    .catch(err => console.log("DB CONNECTION ERROR=>", err));

//MIDDLEWARES
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors({
    origin: [process.env.CLIENT_URL],
}));

//AUTOLOAD ROUTES
readdirSync('./routes').map(r => app.use('/api', require(`./routes/${r}`)));


//SOCKET.IO
io.on('connect', socket => {
    socket.on("new-post", newPost => {
        socket.broadcast.emit("new-post", newPost);
    })
});

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT ${PORT}`.yellow.bold));