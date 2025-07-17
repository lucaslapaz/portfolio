import { Router } from "express"
import StatusService from "../services/StatusService";
import { StatusApiController } from "../controllers/api/StatusApiController";

// Server Status
const statusService: StatusService = new StatusService();
const statusApiController: StatusApiController = new StatusApiController(statusService);

export const statusRoute = Router();

statusRoute.get("/status", statusApiController.getServerStatus);

