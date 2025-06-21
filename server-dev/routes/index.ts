import { NextFunction, Request, Response, Router } from "express";
import PostController from "../controllers/PostController";
import HomeController from "../controllers/HomeController";
import BlogController from "../controllers/BlogController";
import ErrorController from "../controllers/ErrorController";
import AuthController from "../controllers/AuthController";

export default function createRoutes(
    checkPermissionMiddleware: Function,
    postController: PostController,
    homeController: HomeController,
    blogController: BlogController,
    errorController: ErrorController,
    authController: AuthController
) {
    const router = Router();

    router.get("/", homeController.getHomePage);

    router.get("/home", homeController.getHomePage);

    router.get("/login", authController.getLoginPage);

    router.get("/logout", authController.getLogoutPage);

    router.post("/login", authController.postLogin);

    router.get("/blog", blogController.getBlogPage);

    router.post("/post", checkPermissionMiddleware(10), postController.createPost);
    
    router.get("/post/new", checkPermissionMiddleware(10), postController.getCreatePostPage);

    router.get("/post/:postId", postController.getPostByIdPage);

    router.get("/post/:postId/edit", checkPermissionMiddleware(10), postController.getEditPostByIdPage);

    router.patch("/post/:postId", postController.patchPostById);

    router.get("/unauthorized", errorController.getUnauthorizedPage);

    // 404
    router.use(errorController.getNotFoundPage);


    return router;
}