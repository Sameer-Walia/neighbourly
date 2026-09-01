import { Request, Response } from "express";
import NotificationModelForUser from "../Models/NotifyUserModel";

export const getusernotifications = async (req: Request, res: Response) =>
{
    try 
    {
        const result = await NotificationModelForUser.find({ userid: req.params.userid }).sort({ timestamp: -1 }).populate("taskerid").populate("taskid");
        if (result.length === 0)
        {
            res.send({ statuscode: 0 })
        }
        else 
        {
            res.send({ statuscode: 1, usernotify: result })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const deletenotification = async (req: Request, res: Response) =>
{
    try
    {
        const result = await NotificationModelForUser.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 1) 
        {
            res.send({ statuscode: 1, msg: "Notification deleted successfully" })
        }
        else 
        {
            res.send({ statuscode: 0, msg: "Notification not deleted" })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}