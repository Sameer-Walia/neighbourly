import mongoose, { Model, Schema } from "mongoose";

interface INotificationForTasker extends Document
{
    userid: mongoose.Types.ObjectId;
    taskerid: mongoose.Types.ObjectId;
    timestamp: Date;
    taskid: mongoose.Types.ObjectId;
}

const NotificationSchemaForTasker: Schema<INotificationForTasker> = new Schema({ userid: { type: mongoose.Schema.Types.ObjectId, ref: "signup", required: true }, taskerid: { type: mongoose.Schema.Types.ObjectId, ref: "signup", required: true }, timestamp: { type: Date }, taskid: { type: mongoose.Schema.Types.ObjectId, ref: "PostTask", required: true } }, { versionKey: false });

const NotificationModelForTasker: Model<INotificationForTasker> = mongoose.model<INotificationForTasker>("NotificationTasker", NotificationSchemaForTasker, "NotificationTasker");

export default NotificationModelForTasker