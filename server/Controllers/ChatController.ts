import { Request, Response } from "express";
import ChatModel from "../Models/ChatModel";
import { io } from "../server";


export const chat_send = async (req: Request, res: Response) =>
{
    const { sender, receiver, text } = req.body;

    let chat = await ChatModel.findOne({
        $or: [
            { userid: sender, taskerid: receiver },
            { userid: receiver, taskerid: sender }
        ]
    });

    const newMsg = { sender, text, timestamp: new Date() };

    if (!chat)
    {
        chat = new ChatModel({
            userid: sender,
            taskerid: receiver,
            messages: [newMsg]
        });
    }
    else
    {
        chat.messages.push(newMsg);
    }

    const saved = await chat.save();

    if (saved)
    {
        const roomId = `${chat.userid}_${chat.taskerid}`;

        // real-time emit
        io.to(roomId).emit("receive_message", newMsg);
        // io.emit("chat_unread", { receiver, sender, text });
        io.to(receiver).emit("chat_unread", { receiver, sender, text });
        return res.status(200).json({ statuscode: 1, msg: newMsg });
    }

    res.status(200).json({ statuscode: 0 });
}

export const chat_history = async (req: Request, res: Response) =>
{
    const { userid, taskerid } = req.query;

    const chat = await ChatModel.findOne({
        $or: [
            { userid: userid, taskerid: taskerid },
            { userid: taskerid, taskerid: userid }
        ]
    });

    res.json(chat ? chat.messages : []);
}


export const user_chat_with_all_tasker = async (req: Request, res: Response) =>
{
    try
    {
        const result = await ChatModel.find({ $or: [{ userid: req.query.userid }, { taskerid: req.query.userid }] }).populate("taskerid");;
        if (result.length === 0)
        {
            res.send({ statuscode: 0 })
        }
        else
        {
            res.send({ statuscode: 1, alluserchat: result })
        }

    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const tasker_chat_with_all_user = async (req: Request, res: Response) =>
{
    try
    {
        const result = await ChatModel.find({ $or: [{ taskerid: req.query.taskerid }, { userid: req.query.taskerid }] }).populate("userid");;
        if (result.length === 0)
        {
            res.send({ statuscode: 0 })
        }
        else
        {
            res.send({ statuscode: 1, alltaskerchat: result })
        }

    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}