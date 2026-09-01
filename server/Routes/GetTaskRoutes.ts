import express from "express"
import { appliedtasks, change_status_to_Accepted, change_status_to_Reject, change_status_to_Task_Completed1, change_status_to_TaskAssign1, del_tasker_task, dotask, fetchalltaskers, fetchdetailstaskerassign, updatemyDetails } from "../Controllers/GetTaskController";
import { verifyjsontoken, verifyTaskBrowser } from "../utils/auth";
const router = express.Router();

router.post("/dotask", dotask)
router.get("/appliedtasks/:taskeremail", verifyjsontoken, verifyTaskBrowser, appliedtasks)
router.post("/del_tasker_task", del_tasker_task)
router.get("/fetchdetailstaskerassign", fetchdetailstaskerassign)
router.put("/updatemyDetails", updatemyDetails)
router.get("/fetchalltaskers", fetchalltaskers)
router.put("/change_status_to_Reject", change_status_to_Reject)
router.put("/change_status_to_Accepted", change_status_to_Accepted)
router.put("/change_status_to_TaskAssign1", change_status_to_TaskAssign1)
router.put("/change_status_to_Task_Completed1", change_status_to_Task_Completed1)



export default router;