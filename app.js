import route from './route.js';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload'
dotenv.config();

const app = express();
app.use(express.json());
app.use(fileUpload());

app.use(cors({
  origin: '*'
}));
app.use('/fileUpload', route)

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Port listening on ${PORT}`)
})