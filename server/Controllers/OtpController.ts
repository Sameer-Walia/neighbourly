import { Request, Response } from "express";
import OtpModel from "../Models/OtpModel";

import twilio from "twilio"
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const send_otp = async (req: Request, res: Response) =>
{
    const phone = req.body.phone;
    const otp = Math.floor(100000 + Math.random() * 900000);

    try 
    {
        // client.messages.create() This is the Twilio API call that tells Twilio: “Send an SMS now”
        await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+91${phone}`, // include country code
        });

        // Store OTP in DB or in-memory
        const newrecord = new OtpModel({ phone, otp });
        const record = await newrecord.save();
        if (record)
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

export const verify_otp = async (req: Request, res: Response) =>
{
    try
    {
        const { phone, otp } = req.body;
        const record = await OtpModel.findOne({ phone, otp });
        if (record === null)
        {
            res.send({ statuscode: 0 })
        }
        else
        {
            res.send({ statuscode: 1 });
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}