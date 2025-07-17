import { Router } from "express"
import NotesRepository from "../repositories/NotesRepository";
import NotesService from "../services/NotesService";
import { NotesApiController } from "../controllers/api/NotesApiController";
import { NotesViewController } from "../controllers/view/NotesViewController";

// Página de anotações
const notesRepository: NotesRepository = new NotesRepository();
const notesService: NotesService = new NotesService(notesRepository);
const notesApiController: NotesApiController = new NotesApiController(notesService);
const notesViewController: NotesViewController = new NotesViewController(notesService);

export const notesRoute = Router();

notesRoute.get("/notes", notesViewController.getNotesPage);

notesRoute.get("/api/notes/metadata-list", notesApiController.getMetadaList);

notesRoute.get("/api/notes/file-content", notesApiController.getFileContent);
