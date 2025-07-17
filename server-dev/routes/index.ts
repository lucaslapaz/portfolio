import {  Router } from "express";
import { postRoute } from "./postRoute";
import { homeRoute } from "./homeRoute";
import { loginRoute } from "./loginRoute";
import { blogRoute } from "./blogRoute";
import { statusRoute } from "./statusRoute";
import { notesRoute } from "./notesRoute";
import { errorRoute } from "./errorRoute";
import { adminRoute } from "./adminRoute";

export const routes = Router();

// Home
routes.use(homeRoute);

// Posts
routes.use(postRoute);

// Login
routes.use(loginRoute);

// Blog
routes.use(blogRoute);

// Server status
routes.use(statusRoute);

// Notes
routes.use(notesRoute);

// Error
routes.use(errorRoute);

// Admin
routes.use(adminRoute);

