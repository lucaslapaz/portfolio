import { ErrorRequestHandler, RequestHandler, Router } from "express";
import PostController from "../controllers/PostController";
import HomeController from "../controllers/HomeController";
import BlogController from "../controllers/BlogController";
import ErrorController from "../controllers/ErrorController";
import AuthController from "../controllers/AuthController";
import StatusController from "../controllers/StatusController";
import NotesController from "../controllers/NotesController";

export default function createRoutes(
    checkPermissionMiddleware: Function,
    postController: PostController,
    homeController: HomeController,
    blogController: BlogController,
    errorController: ErrorController,
    authController: AuthController,
    statusController: StatusController,
    notesController:NotesController
) {
    const router = Router();

    router.get("/", homeController.getHomePage);

    router.get("/home", homeController.getHomePage);
    
    router.get("/home-old", homeController.getOldHomePage);

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

    router.get("/notes", notesController.getNotesPage);

    router.get("/notes/metadata-list", notesController.getMetadaList);

    router.get("/notes/file-content", notesController.getFileContent);

    router.get("/unauthorized", errorController.getUnauthorizedPage);

    return router;
}