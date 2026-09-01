import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose, { Model, Schema } from "mongoose";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);


app.use(express.json());

const port = 5555

// mongoose.connect('mongodb://127.0.0.1:27017/airtaskerdb_typescript').then(() => console.log('Connected to MongoDB'));
mongoose.connect(process.env.MONGO_URL!).then(() => console.log('Connected to MongoDB'));

import cookieParser from "cookie-parser"
app.use(cookieParser());


import http from "http";
import { Server, Socket } from "socket.io";
const server = http.createServer(app);

interface TypingPayload
{
    roomId: string;
    sender: string;
}


export const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on("connection", (socket: Socket) =>    
{
    console.log("🔌 Socket connected:", socket.id);

    socket.on("join_room", (roomId) =>
    {
        socket.join(roomId);
        console.log("📌 Joined room:", roomId);
    });

    socket.on("typing", ({ roomId, sender }: TypingPayload) =>
    {
        socket.to(roomId).emit("typing", { sender });
    });

    socket.on("Tasker_id", (Tasker_id) =>
    {
        socket.join(Tasker_id);
        console.log("📌 Tasker Id :", Tasker_id);
    });

    socket.on("User_id", (User_id) =>
    {
        socket.join(User_id);
        console.log("📌 User Id :", User_id);
    });

});

import Razorpay from "razorpay"

const razorpay = new Razorpay({
    key_id: 'rzp_test_Ryh9suGdlNeYvN',
    key_secret: 'QV1rmsA2wMUh0z2ITtx9iQsg',
});

app.post("/api/create_order", async (req: Request, res: Response) =>
{
    try
    {
        const options = {
            amount: req.body.amount, // in paise
            currency: "INR",
            receipt: "receipt#1",
        };
        const order = await razorpay.orders.create(options);
        res.json({ order });
    }
    catch (err: any)
    {
        console.log(err);
        res.status(500).send("Order creation failed");
    }
});


import SignupRoutes from "./Routes/SignupRoutes";
import ResetPassRoutes from "./Routes/ResetPassRoutes";
import PostTaskRoutes from "./Routes/PostTaskRoutes";
import GetTaskRoutes from "./Routes/GetTaskRoutes";
import NotifyUserRoutes from "./Routes/NotifyUserRoutes";
import NotifyTaskerRoutes from "./Routes/NotifyTaskerRoutes";
import ChatRoutes from "./Routes/ChatRoutes";
import OtpRoutes from "./Routes/OtpRoutes";

app.use("/api", SignupRoutes)
app.use("/api", ResetPassRoutes)
app.use("/api", PostTaskRoutes)
app.use("/api", GetTaskRoutes)
app.use("/api", NotifyUserRoutes)
app.use("/api", NotifyTaskerRoutes)
app.use("/api", ChatRoutes)
app.use("/api", OtpRoutes)



server.listen(port, () =>
{
    console.log(`Server is running on port ${port}`)
})

