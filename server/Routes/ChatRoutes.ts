import express from "express"
import { chat_history, chat_send, tasker_chat_with_all_user, user_chat_with_all_tasker } from "../Controllers/ChatController";
const router = express.Router();

router.post("/chat/send", chat_send)
router.get("/chat/history", chat_history)
router.get("/chat/user_chat_with_all_tasker", user_chat_with_all_tasker)
router.get("/chat/tasker_chat_with_all_user", tasker_chat_with_all_user)

export default router;