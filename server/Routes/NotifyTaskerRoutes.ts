import express from "express"
import { deletenotification_from_tasker, gettaskernotifications } from "../Controllers/NotifyTaskerController";

const router = express.Router();

router.get("/gettaskernotifications/:taskerid", gettaskernotifications)
router.get("/deletenotification_from_tasker/:id", deletenotification_from_tasker)



export default router;



