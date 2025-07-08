import { ErrorRequestHandler, RequestHandler, Router } from "express";
import PostController from "../controllers/PostController";
import HomeController from "../controllers/HomeController";
import BlogController from "../controllers/BlogController";
import ErrorController from "../controllers/ErrorController";
import AuthController from "../controllers/AuthController";
import StatusController from "../controllers/StatusController";

export default function createRoutes(
    errorHandlerMiddleware: ErrorRequestHandler,
    notFoundMiddleware: RequestHandler,
    checkPermissionMiddleware: Function,
    postController: PostController,
    homeController: HomeController,
    blogController: BlogController,
    errorController: ErrorController,
    authController: AuthController,
    statusController: StatusController
) {
    const router = Router();

    router.get("/", homeController.getHomePage);

    router.get("/home", homeController.getHomePage);

    router.get("/login", authController.getLoginPage);

    router.post("/login", authController.postLogin);
    
    router.get("/logout", authController.getLogoutPage);

    router.get("/blog", blogController.getBlogPage);

    router.post("/post", checkPermissionMiddleware(10), postController.postCreatePost);
    
    router.get("/post/new", checkPermissionMiddleware(10), postController.getCreatePostPage);

    router.get("/post/:postId", postController.getPostByIdPage);

    router.get("/post/:postId/edit", checkPermissionMiddleware(10), postController.getEditPostByIdPage);

    router.patch("/post/:postId", postController.patchPostById);

    router.get("/status", statusController.getServerStatus);


    router.get("/unauthorized", errorController.getUnauthorizedPage);
    
    // Error
    router.use(errorHandlerMiddleware);

    // 404
    router.use(notFoundMiddleware);


    return router;
}