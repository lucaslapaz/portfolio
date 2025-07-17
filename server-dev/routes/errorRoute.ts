import { Router } from "express"
import { ErrorViewController } from "../controllers/view/ErrorViewController";

// Trata páginas de erro
const errorViewController = new ErrorViewController();

export const errorRoute = Router();

errorRoute.get("/unauthorized", errorViewController.getUnauthorizedPage);
