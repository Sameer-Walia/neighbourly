import { Request, Response } from "express";
import GetTaskModel from "../Models/GetTaskModel";
import NotificationModelForUser from "../Models/NotifyUserModel";
import NotificationModelForTasker from "../Models/NotifyTaskerModel";
import { io } from "../server";


export const dotask = async (req: Request, res: Response) =>
{
    try 
    {
        const existingOffer = await GetTaskModel.findOne({ taskid: req.body.taskid, taskeremail: req.body.taskeremail });
        if (existingOffer)
        {
            return res.send({ statuscode: 0, msg: "You have already submitted an offer for this task.", })
        }

        const currentDateUTC = new Date();
        const ISTOffset = 5.5 * 60 * 60 * 1000;
        const Indiantime = currentDateUTC.getTime() + ISTOffset

        const newrecord = new GetTaskModel({ taskid: req.body.taskid, taskerid: req.body.taskerid, name: req.body.taskername, taskeremail: req.body.taskeremail, phone: req.body.taskerphone, location: req.body.location, offerprice: req.body.offerprice, message: req.body.message, status: "pending", Applied_on: Indiantime })

        const record = await newrecord.save();
        if (record) 
        {
            const newnotification = new NotificationModelForUser({ userid: req.body.userid, taskerid: req.body.taskerid, timestamp: Indiantime, taskid: req.body.taskid })

            const result = await newnotification.save();
            if (result)
            {
                io.to(req.body.userid).emit("notify_user");
                res.send({ statuscode: 1, msg: "Task Details and Notification Send Successfully" })
            }
            else
            {
                res.send({ statuscode: 0, msg: "Task Details and Notification not Send successfully" })
            }
        }
        else 
        {
            res.send({ statuscode: 0, msg: "Task Details Not Send successfull" })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const appliedtasks = async (req: Request, res: Response) =>
{
    try
    {
        const result = await GetTaskModel.find({ taskeremail: req.params.taskeremail }).populate('taskid');
        if (result.length === 0) 
        {
            res.send({ statuscode: 0 });
        }
        else 
        {
            res.send({ statuscode: 1, appliedtasks: result });
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const del_tasker_task = async (req: Request, res: Response) => 
{
    try
    {
        const result = await GetTaskModel.deleteOne({ _id: req.query.id })
        if (result.deletedCount === 1) 
        {
            res.send({ statuscode: 1, msg: "Task Deleted Successfully" })
        }
        else 
        {
            res.send({ statuscode: 0, msg: "Task not Deleted" })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const fetchdetailstaskerassign = async (req: Request, res: Response) =>
{
    try
    {
        const result = await GetTaskModel.findOne({ _id: req.query.id }).populate("taskid")
        if (result === null) 
        {
            res.send({ statuscode: 0 })
        }
        else 
        {
            res.send({ statuscode: 1, detail: result })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const updatemyDetails = async (req: Request, res: Response) => 
{
    try
    {
        const updatepass = await GetTaskModel.updateOne({ _id: req.body.id }, { $set: { offerprice: req.body.offerprice, message: req.body.msg, Applied_on: req.body.Indiantime } })
        if (updatepass.modifiedCount === 1) 
        {
            res.send({ statuscode: 1 })
        }
        else 
        {
            res.send({ statuscode: 0 })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const fetchalltaskers = async (req: Request, res: Response) =>
{
    try
    {
        const result = await GetTaskModel.find({ taskid: req.query.taskid }).populate('taskid');
        if (result.length === 0) 
        {
            res.send({ statuscode: 0 })
        }
        else 
        {
            res.send({ statuscode: 1, alltaskers: result })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const change_status_to_Reject = async (req: Request, res: Response) =>
{
    try
    {
        const result = await GetTaskModel.updateOne({ _id: req.body.id }, { $set: { status: "Rejected" } })
        if (result.modifiedCount === 1) 
        {
            res.send({ statuscode: 1 })
        }
        else 
        {
            res.send({ statuscode: 0 })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const change_status_to_Accepted = async (req: Request, res: Response) =>
{
    try
    {
        const response = await GetTaskModel.updateOne({ _id: req.body.uniqueid }, { $set: { status: "Accepted" } })
        if (response.modifiedCount === 1) 
        {
            const currentDateUTC = new Date();
            const ISTOffset = 5.5 * 60 * 60 * 1000;
            const Indiantime = currentDateUTC.getTime() + ISTOffset

            const newnotification = new NotificationModelForTasker({ userid: req.body.userid, taskerid: req.body.taskerid, timestamp: Indiantime, taskid: req.body.taskid })

            const result = await newnotification.save()
            if (result)
            {
                io.to(req.body.taskerid).emit("notify_tasker");
                res.send({ statuscode: 1, msg: "Notification Send To Tasker Successfully" })
            }
            else
            {
                res.send({ statuscode: 0, msg: "Notification Not Send To Tasker Successfully" })
            }
        }
        else 
        {
            res.send({ statuscode: 0 })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const change_status_to_TaskAssign1 = async (req: Request, res: Response) =>
{
    try
    {
        const result = await GetTaskModel.updateOne({ _id: req.query.uniqueid }, { $set: { status: "Task Assign" } })
        if (result.modifiedCount === 1) 
        {
            res.send({ statuscode: 1 })
        }
        else 
        {
            res.send({ statuscode: 0 })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const change_status_to_Task_Completed1 = async (req: Request, res: Response) =>
{
    try
    {
        const result = await GetTaskModel.updateOne({ _id: req.query.uniqueid }, { $set: { status: "Task Completed" } })
        if (result.modifiedCount === 1) 
        {
            res.send({ statuscode: 1 })
        }
        else 
        {
            res.send({ statuscode: 0 })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}