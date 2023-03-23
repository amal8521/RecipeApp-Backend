import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import { userRouter } from './routes/users.js';
import { recipesRouter } from './routes/recipes.js';

const app = express();

app.use(express.json());
app.use(cors());
// authentication takes place in userRouter
// therefore "/auth"
app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

mongoose.connect("mongodb+srv://amalramachandran25:Kichu333@recipes.0f1mqiq.mongodb.net/recipes?retryWrites=true&w=majority")

app.listen(3001, () => console.log("SERVER STARTED"));