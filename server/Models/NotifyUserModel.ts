import mongoose, { Schema } from "mongoose";

interface INotificationForUser extends Document
{
    userid: mongoose.Types.ObjectId;
    taskerid: mongoose.Types.ObjectId;
    timestamp: Date;
    taskid: mongoose.Types.ObjectId;
}

const NotificationSchemaForUser: Schema<INotificationForUser> = new Schema({ userid: { type: mongoose.Schema.Types.ObjectId, ref: "signup", required: true }, taskerid: { type: mongoose.Schema.Types.ObjectId, ref: "signup", required: true }, timestamp: { type: Date }, taskid: { type: mongoose.Schema.Types.ObjectId, ref: "PostTask", required: true } }, { versionKey: false });

const NotificationModelForUser = mongoose.model<INotificationForUser>("NotificationUser", NotificationSchemaForUser, "NotificationUser");

export default NotificationModelForUser