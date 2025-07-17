import { Router } from "express"
import { AdminViewController } from "../controllers/view/AdminViewController";
import MySQL from "../database/MySQL";
import UserRepository from "../repositories/UserRepository";
import UserService from "../services/UserService";
import checkPermissionMiddlewareFactory from "../middlewares/checkPermissionMiddleware";

// Admin
const adminViewController:AdminViewController = new AdminViewController();

// Inicizalização do singleton
const dbInstance = MySQL.getInstance();
const pool = dbInstance.getPool();

// User
const userRepository = new UserRepository(pool);
const userService: UserService = new UserService(userRepository);

// Checar permissões do usuário logado
const checkPermissionMiddleware: Function = checkPermissionMiddlewareFactory(userService);

export const adminRoute = Router();

adminRoute.get("/admin", checkPermissionMiddleware(10), adminViewController.getAdminPage);
