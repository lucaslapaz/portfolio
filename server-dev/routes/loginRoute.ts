import { Router } from "express"
import AuthService from "../services/AuthService";
import { AuthApiController } from "../controllers/api/AuthApiController";
import { AuthViewController } from "../controllers/view/AuthViewController";
import UserService from "../services/UserService";
import UserRepository from "../repositories/UserRepository";
import MySQL from "../database/MySQL";


// Inicizalização do singleton
const dbInstance = MySQL.getInstance();
const pool = dbInstance.getPool();

// User
const userRepository = new UserRepository(pool);
const userService: UserService = new UserService(userRepository);

// Login
const authService = new AuthService(userRepository);
const authApiController = new AuthApiController(authService);
const authViewController = new AuthViewController(authService);

export const loginRoute = Router();

loginRoute.get("/login", authViewController.getLoginPage);

loginRoute.post("/api/login", authApiController.postLogin);

loginRoute.get("/logout", authViewController.getLogoutPage);

