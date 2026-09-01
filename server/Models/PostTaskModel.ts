import mongoose, { Model, Schema } from "mongoose";

interface PostTask extends Document
{
    email: string;
    userid: mongoose.Types.ObjectId;
    name: string;
    category: string;
    descp: string;
    datetype: string;
    date: string;
    locations: string;
    budget: string;
    additionalValues: object
    status: string;
    currentdate: string;
    Assigned_to: string;
    phone: string;
}

const PostTaskSchema: Schema<PostTask> = new Schema<PostTask>({ email: { type: String, required: true }, userid: { type: mongoose.Schema.Types.ObjectId, ref: "signup", required: true }, name: { type: String, required: true }, category: { type: String, required: true }, descp: { type: String, required: true }, datetype: { type: String, required: true }, date: { type: String, required: true }, locations: { type: String, required: true }, budget: { type: String, required: true }, additionalValues: { type: Object }, status: { type: String }, currentdate: { type: String }, Assigned_to: { type: String }, phone: { type: String, required: true } }, { versionKey: false });

const PostTaskModel: Model<PostTask> = mongoose.model<PostTask>("PostTask", PostTaskSchema, "PostTask");

export default PostTaskModel;