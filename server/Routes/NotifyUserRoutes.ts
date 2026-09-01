import express from "express"
import { deletenotification, getusernotifications } from "../Controllers/NotifyUserController";
const router = express.Router();

router.get("/getusernotifications/:userid", getusernotifications)
router.get("/deletenotification/:id", deletenotification)

export default router;