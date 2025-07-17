import { Router } from "express"
import { HomeViewController } from "../controllers/view/HomeViewController";

// Home
const homeViewController = new HomeViewController();

export const homeRoute = Router();

homeRoute.get("/", homeViewController.getHomePage);

homeRoute.get("/home", homeViewController.getHomePage);

homeRoute.get("/home-old", homeViewController.getOldHomePage);

