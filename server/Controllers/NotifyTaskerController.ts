import { Request, Response } from "express";
import NotificationModelForTasker from "../Models/NotifyTaskerModel";


export const gettaskernotifications = async (req: Request, res: Response) =>
{
    try 
    {
        const result = await NotificationModelForTasker.find({ taskerid: req.params.taskerid }).sort({ timestamp: -1 }).populate("taskerid").populate("taskid").populate("userid");
        if (result.length === 0)
        {
            res.send({ statuscode: 0 })
        }
        else 
        {
            res.send({ statuscode: 1, taskernotify: result })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const deletenotification_from_tasker = async (req: Request, res: Response) =>
{
    try
    {
        const result = await NotificationModelForTasker.deleteOne({ _id: req.params.id });
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