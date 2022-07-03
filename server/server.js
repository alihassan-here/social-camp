import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { readdirSync } from "fs";

const morgan = require('morgan');
require('dotenv').config();

const app = express();

//DB
mongoose.connect(process.env.MONGOURI)
    .then(() => console.log("DB CONNCECTED"))
    .catch(err => console.log("DB CONNECTION ERROR=>", err));

//MIDDLEWARES
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
// app.use(morgan('tiny'));
app.use(cors({
    origin: ["http://localhost:3000"],
}));

//AUTOLOAD ROUTES
readdirSync('./routes').map(r => app.use('/api', require(`./routes/${r}`)));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT ${PORT}`));