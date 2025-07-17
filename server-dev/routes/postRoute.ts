import { Router } from "express"
import PostRepository from "../repositories/PostRepository";
import PostService from "../services/PostService";
import { PostApiController } from "../controllers/api/PostApiController";
import { PostViewController } from "../controllers/view/PostViewController";
import MySQL from "../database/MySQL";
import checkPermissionMiddlewareFactory from "../middlewares/checkPermissionMiddleware";
import UserRepository from "../repositories/UserRepository";
import UserService from "../services/UserService";


// Inicizalização do singleton
const dbInstance = MySQL.getInstance();
const pool = dbInstance.getPool();

// User
const userRepository = new UserRepository(pool);
const userService: UserService = new UserService(userRepository);

// Checar permissões do usuário logado
const checkPermissionMiddleware: Function = checkPermissionMiddlewareFactory(userService);

// Post
const postRepository = new PostRepository(pool);
const postService = new PostService(postRepository);
const postApiController = new PostApiController(postService);
const postViewController = new PostViewController(postService);

export const postRoute = Router();

postRoute.post("/api/post", checkPermissionMiddleware(10), postApiController.postCreatePost);

postRoute.get("/post/new", checkPermissionMiddleware(10), postViewController.getCreatePostPage);

postRoute.get("/post/:postId", postViewController.getPostByIdPage);

postRoute.get("/post/:postId/edit", checkPermissionMiddleware(10), postViewController.getEditPostByIdPage);

postRoute.patch("/api/post/:postId", postApiController.patchPostById);

