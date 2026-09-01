import express from "express"
import { checktoken, forgotpassword, resetpassword } from "../Controllers/ResetPassController";
const router = express.Router();

router.get("/forgotpassword" , forgotpassword)
router.get("/checktoken" , checktoken)
router.put("/resetpassword" , resetpassword)


export default router;
