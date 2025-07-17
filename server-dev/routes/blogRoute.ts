import { Router } from "express"
import { BlogViewController } from "../controllers/view/BlogViewController";
import BlogService from "../services/BlogService";
import PostRepository from "../repositories/PostRepository";
import PostService from "../services/PostService";
import MySQL from "../database/MySQL";


// Inicizalização do singleton
const dbInstance = MySQL.getInstance();
const pool = dbInstance.getPool();

// Post
const postRepository = new PostRepository(pool);

// Blog
const blogService = new BlogService(postRepository);
const blogViewController = new BlogViewController(blogService);

export const blogRoute = Router();

blogRoute.get("/blog", blogViewController.getBlogPage);
