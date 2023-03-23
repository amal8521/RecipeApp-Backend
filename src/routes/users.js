// import { Express } from "express";
import express from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from "../models/Users.js";
const router = express.Router();

router.post("/register", async (req, res) => {
    const{ username, password } = req.body;
    // find one user with same username from UserModel collection
    const user = await UserModel.findOne({ username });

    if (user) {
        res.json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();

    res.json("User Registered Successfully!!!");
});
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    if (!user) {
        res.json({ message: "User not Registered" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        res.json({ message: "Username or Password Incorrect" });
    }
    const token = jwt.sign({ id:user._id }, "secret");
    res.json({ token, userID: user._id });
});

export { router as userRouter }; 

// middleware to verify token
export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        // check if current token has the secret we passed
        jwt.verify(token, "secret", (err) => {
            if (err) return res.sendStatus(403);
            next();
        });
    } else {
        res.sendStatus(401);
    }
}