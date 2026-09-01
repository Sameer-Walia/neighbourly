import express from "express"
import { change_status_to_Task_Completed2, change_status_to_TaskAssign2, deltask, fetchalltasks, fetchonservice, fetchusertasks, posttask, updatetask } from "../Controllers/PostTaskController";
import { verifyjsontoken, verifyTaskPoster } from "../utils/auth";
const router = express.Router();

router.post("/posttask", verifyjsontoken, verifyTaskPoster, posttask)
router.get("/fetchusertasks/:useremail", verifyjsontoken, verifyTaskPoster, fetchusertasks)
router.get("/fetchonservice", fetchonservice)
router.get("/fetchonservice", fetchonservice)
router.delete("/deltask", deltask)
router.put("/updatetask", updatetask)
router.get("/fetchalltasks", fetchalltasks)
router.put("/change_status_to_TaskAssign2", change_status_to_TaskAssign2)
router.put("/change_status_to_Task_Completed2", change_status_to_Task_Completed2)


export default router;
