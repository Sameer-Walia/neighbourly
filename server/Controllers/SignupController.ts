import SignupModel from "../Models/SignupModel";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { sendMail } from "../utils/mailer";
import jwt, { JwtPayload } from "jsonwebtoken";

export const signup = async (req: Request, res: Response) =>
{
    const acttoken: string = uuidv4()
    const encryp_pass: string = bcrypt.hashSync(req.body.pass, 10);

    try
    {
        const newrecord = new SignupModel({ name: req.body.name, address: req.body.address, role: req.body.role, phone: req.body.phone, email: req.body.email, password: encryp_pass, usertype: req.body.role, actstatus: false, token: acttoken })

        const result = await newrecord.save();
        if (result) 
        {
            const mailOptions = {
                from: 'waliasam13@gmail.com', // transporter username email
                to: req.body.email,             // user's email id
                subject: 'Activation Mail from Neighbourly.com',
                html: `Dear ${req.body.name}<br/><br/>Thanks for signing up on our website.<br/><br/>Click on the following link to activate your account.<br/><br/><a href='http://localhost:5173/activateaccount?code=${acttoken}'>Activate Account<a/>`
            };

            const mailresp = await sendMail(mailOptions);
            if (mailresp === true)
            {
                res.send({ statuscode: 1 })
            }
            else
            {
                res.send({ statuscode: 2 })
            }

        }
        else
        {
            res.send({ statuscode: 0, msg: "Signup not successfull" })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)

    }
}


export const resendmail = async (req: Request, res: Response) =>
{
    try 
    {
        const user = await SignupModel.findOne({ email: req.body.email });
        console.log(user)
        if (user === null) 
        {
            res.send({ statuscode: 0, msg: "User not found with given email" });
        }
        else
        {
            const updateresult = await SignupModel.updateOne({ email: req.body.email }, { $set: { actstatus: false } });
            if (updateresult.modifiedCount === 1)
            {
                const mailOptions = {
                    from: 'sameerwalia13@gmail.com',
                    to: req.body.email,
                    subject: 'Activation Mail from Neighbourly.com',
                    html: `Dear ${user.name}<br/><br/>Thanks for signing up on our website.<br/><br/>Click on the following link to activate your account.<br/><br/><a href='http://localhost:5173/activateaccount?code=${user.token}'>Activate Account<a/>`
                };

                const mailresp = await sendMail(mailOptions);
                if (mailresp === true)
                {
                    res.send({ statuscode: 1 })
                }
                else
                {
                    res.send({ statuscode: 2 })
                }
            }
            else
            {
                const mailOptions = {
                    from: 'sameerwalia13@gmail.com',
                    to: req.body.email,
                    subject: 'Activation Mail from Neighbourly.com',
                    html: `Dear ${user.name}<br/><br/>Thanks for signing up on our website.<br/><br/>Click on the following link to activate your account.<br/><br/><a href='http://localhost:5173/activateaccount?code=${user.token}'>Activate Account<a/>`
                };

                const mailresp = await sendMail(mailOptions);
                if (mailresp === true)
                {
                    res.send({ statuscode: 1 })
                }
                else
                {
                    res.send({ statuscode: 2 })
                }
            }
        }
    }
    catch (e: any) 
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}


export const activateuseraccount = async (req: Request, res: Response) =>
{
    try
    {
        const updateresult = await SignupModel.updateOne({ token: req.body.code }, { $set: { actstatus: true } });
        if (updateresult.modifiedCount === 1)
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


export const login = async (req: Request, res: Response) => 
{
    try 
    {
        const result = await SignupModel.findOne({ email: req.body.email })
        console.log(result)
        if (result === null)
        {
            res.send({ statuscode: 0 })
        }
        else
        {
            if (bcrypt.compareSync(req.body.pass, result.password))
            {

                const jsontoken = jwt.sign({ id: result._id, role: result.usertype }, process.env.JWT_SKEY as string, { expiresIn: "15m" })
                const refreshjsontoken = jwt.sign({ id: result._id, role: result.usertype }, process.env.JWT_REFRESH_SKEY as string, { expiresIn: "7d" })

                res.cookie("authToken", jsontoken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 15 * 60 * 1000,
                });

                res.cookie("refreshToken", refreshjsontoken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });

                const respdata = { _id: result._id, name: result.name, address: result.address, phone: result.phone, email: result.email, usertype: result.usertype, actstatus: result.actstatus }

                res.send({ statuscode: 1, userdata: respdata })

            }
            else
            {
                res.send({ statuscode: 0 })
            }
        }
    }
    catch (e: any) 
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const logout = async (req: Request, res: Response) => 
{
    try 
    {
        res.clearCookie("authToken");
        res.clearCookie("refreshToken");
        res.clearCookie("staysignin");
        res.send({ statuscode: 1 })
    }
    catch (e: any) 
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const google_login = async (req: Request, res: Response) => 
{
    try
    {
        const { email, name, googleId } = req.body;

        let user = await SignupModel.findOne({ email: email });

        if (user === null)
        {
            // create new Google user
            const newrecord = new SignupModel({ name, phone: "", email, password: "", usertype: "normal", actstatus: true, token: "", googleId: googleId });

            user = await newrecord.save();
        }


        const respdata = { _id: user._id, name: user.name, address: user.address, phone: user.phone, email: user.email, usertype: user.usertype, actstatus: user.actstatus }

        res.send({ statuscode: 1, userdata: respdata });

    }
    catch (e: any)
    {
        console.log(e);
        res.send({ statuscode: -1 });
    }
}

export const changepassword = async (req: Request, res: Response) => 
{
    try
    {
        const result = await SignupModel.findOne({ email: req.body.uname })
        console.log(result)
        if (result === null)
        {
            res.send({ statuscode: 0 })
        }
        else
        {
            if (bcrypt.compareSync(req.body.currpass, result.password))
            {
                const encryp_newpass = bcrypt.hashSync(req.body.newpass, 10)
                const updatepass = await SignupModel.updateOne({ email: req.body.uname }, { $set: { password: encryp_newpass } })
                if (updatepass.modifiedCount === 1) 
                {
                    res.clearCookie("authToken");
                    res.clearCookie("refreshToken");
                    res.send({ statuscode: 1 })
                }
                else 
                {
                    res.send({ statuscode: 0 })
                }
            }
            else
            {
                res.send({ statuscode: 0 })
            }
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}

export const updateuserprofile = async (req: Request, res: Response) =>
{
    try
    {
        const updateresult = await SignupModel.updateOne({ email: req.body.email }, { $set: { name: req.body.name, phone: req.body.phone, address: req.body.address } });

        if (updateresult.modifiedCount === 1) 
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

export const fetchoneuserdata = async (req: Request, res: Response) =>
{
    try
    {
        const result = await SignupModel.findOne({ email: req.params.useremail })
        if (result === null) 
        {
            res.send({ statuscode: 0 })
        }
        else 
        {
            res.send({ statuscode: 1, oneuserdata: result })
        }
    }
    catch (e: any)
    {
        res.send({ statuscode: -1 })
        console.log(e.message)
    }
}