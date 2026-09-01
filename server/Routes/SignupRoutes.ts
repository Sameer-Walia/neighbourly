import express from "express";
import { activateuseraccount, changepassword, fetchoneuserdata, google_login, login, logout, resendmail, signup, updateuserprofile } from "../Controllers/SignupController";
import { verifyjsontoken } from "../utils/auth";
const router = express.Router();

router.post("/signup", signup)
router.post("/resendmail", resendmail)
router.put("/activateuseraccount", activateuseraccount)
router.post("/login", login)
router.post("/logout", logout)
router.post("/google_login", google_login)
router.put("/changepassword", verifyjsontoken, changepassword)
router.put("/updateuserprofile", verifyjsontoken, updateuserprofile)
router.get("/fetchoneuserdata/:useremail", verifyjsontoken, fetchoneuserdata)

export default router;
