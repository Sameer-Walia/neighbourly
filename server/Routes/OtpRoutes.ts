import express from "express"
import { send_otp, verify_otp } from "../Controllers/OtpController";
const router = express.Router();

router.post("/send_otp", send_otp)
router.post("/verify_otp", verify_otp)

export default router;