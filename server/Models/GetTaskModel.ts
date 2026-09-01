import mongoose, { Model, Schema } from "mongoose";

interface IGetTask extends Document
{
    taskid: mongoose.Types.ObjectId;
    taskerid: mongoose.Types.ObjectId;
    name: string;
    taskeremail: string;
    phone: string;
    address: string;
    offerprice: number;
    message: string;
    status: string;
    Applied_on: Date;
}

const GetTaskSchema: Schema<IGetTask> = new Schema({ taskid: { type: mongoose.Schema.Types.ObjectId, ref: "PostTask", required: true }, taskerid: { type: mongoose.Schema.Types.ObjectId, ref: "signup", required: true, }, name: { type: String, required: true, trim: true, }, taskeremail: { type: String, required: true, lowercase: true, }, phone: { type: String, required: true, }, location: { type: String, required: true, }, offerprice: { type: Number, required: true, }, message: { type: String, default: "", }, status: { type: String, default: "pending", }, Applied_on: { type: Date, required: true, }, }, { versionKey: false, });

const GetTaskModel: Model<IGetTask> = mongoose.model<IGetTask>("GetTask", GetTaskSchema, "GetTask");

export default GetTaskModel