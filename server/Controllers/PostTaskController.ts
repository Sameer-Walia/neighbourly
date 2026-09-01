import { Request, Response } from "express";
import PostTaskModel from "../Models/PostTaskModel";

export const posttask = async (req: Request, res: Response) =>
{
    try
    {
        const newrecord = new PostTaskModel({ email: req.body.email, userid: req.body.userid, name: req.body.name, category: req.body.selectedCategory, descp: req.body.descp, datetype: req.body.datetype, date: req.body.date, locations: req.body.loc, budget: req.body.budget, additionalValues: req.body.additionalValues, status: "Open", currentdate: req.body.currentdate, Assigned_to: "No assigned", phone: req.body.phone })

        const result = await newrecord.save();
        if (result)
        {
            res.send({ statuscode: 1, msg: "Task Posted Successfully" })
        }
        else
        {
            res.send({ statuscode: 0, msg: "Task not Posted successfully" })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}


export const fetchusertasks = async (req: Request, res: Response) =>
{
    try
    {
        const result = await PostTaskModel.find({ email: req.params.useremail })
        if (result.length === 0) 
        {
            res.send({ statuscode: 0 })
        }
        else 
        {
            res.send({ statuscode: 1, alltasks: result })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const fetchonservice = async (req: Request, res: Response) =>
{
    try
    {
        const result = await PostTaskModel.findOne({ _id: req.query.id })
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

export const deltask = async (req: Request, res: Response) =>
{
    try
    {
        const result = await PostTaskModel.deleteOne({ _id: req.query.id });
        if (result.deletedCount === 1) 
        {
            res.send({ statuscode: 1, msg: "Task deleted successfully" })
        }
        else 
        {
            res.send({ statuscode: 0, msg: "Task not deleted" })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const updatetask = async (req: Request, res: Response) => 
{
    try
    {
        const updatepass = await PostTaskModel.updateOne({ _id: req.body.id }, { $set: { descp: req.body.descp, datetype: req.body.datetype, date: req.body.date, location: req.body.loc, budget: req.body.budget, currentdate: req.body.cdate, additionalValues: req.body.additionalValues } })
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

export const fetchalltasks = async (req: Request, res: Response) =>
{
    try
    {
        const result = await PostTaskModel.find({ status: "Open" })
        if (result.length === 0) 
        {
            res.status(200).send({ statuscode: 0 })
        }
        else 
        {
            res.status(200).send({ statuscode: 1, tasks: result })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const change_status_to_TaskAssign2 = async (req: Request, res: Response) =>
{
    try
    {
        const response = await PostTaskModel.updateOne({ _id: req.query.uniqueid }, { $set: { status: "Task Assign" } })
        if (response.modifiedCount === 1) 
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

export const change_status_to_Task_Completed2 = async (req: Request, res: Response) =>
{
    try
    {
        const result = await PostTaskModel.updateOne({ _id: req.query.uniqueid }, { $set: { status: "Task Completed" } })
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