import express from "express";
import mongoose from "mongoose";
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";


const router = express.Router();
// send all recipes in the DB to UI
router.get("/", async (req, res) => {
    try {
        const response = await RecipeModel.find({});
        res.json(response);
    } catch (err) {
        res.json(err);
    }
});
// create new Recipe
router.post("/", verifyToken, async (req, res) => {
    // create an instance of new recipe
    const newRecipe = new RecipeModel(req.body);
    try {
        // save the new recipe
        const response = await newRecipe.save();
        // await newRecipe.save();
        res.json(response); 
    } catch (err) {
        res.json(err);
    }
});

// To saveRecipe 
router.put("/", verifyToken, async (req, res) => {
    // collect id of recipe and user from request
    const recipe = await RecipeModel.findById(req.body.recipeID);
    const user = await UserModel.findById(req.body.userID);
    try {
        // push recipe to the user's savedRecipe array
        user.savedRecipes.push(recipe);
        await user.save();
        res.json({ savedRecipes: user.savedRecipes }); 
    } catch (err) {
        res.json(err);
    }
});

// loads in saved-recipe page
router.get("/savedRecipes/ids/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        res.json({ savedRecipes: user.savedRecipes }); 
    } catch (err) {
        res.json(err);
    }
});

router.get("/savedRecipes/:userID", async (req, res) => {

    try {
        const user = await UserModel.findById(req.params.userID);
        // find recipe ids which is in user'ssavedRecipe.
        const savedRecipes = await RecipeModel.find({
            _id: { $in: user.savedRecipes },
        });
        res.json({ savedRecipes }); 
    } catch (err) {
        res.json(err);
    }
});

export { router as recipesRouter };