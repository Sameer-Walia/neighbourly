import mongoose, { Model, Schema } from "mongoose";

interface IChat extends Document
{
    taskerid: mongoose.Types.ObjectId;
    userid: mongoose.Types.ObjectId;
    messages: IMessage[];
}

interface IMessage
{
    sender: mongoose.Types.ObjectId;
    text: string;
    timestamp: Date;
}

const messageSchema = new Schema<IMessage>({ sender: { type: mongoose.Schema.Types.ObjectId, ref: 'signup', required: true }, text: { type: String, required: true }, timestamp: { type: Date, default: Date.now } });

const chatSchema = new Schema<IChat>({ taskerid: { type: mongoose.Schema.Types.ObjectId, ref: "signup", required: true }, userid: { type: mongoose.Schema.Types.ObjectId, ref: 'signup', required: true }, messages: [messageSchema] }, { versionKey: false });

const ChatModel: Model<IChat> = mongoose.model<IChat>('Chat', chatSchema, 'Chat');

export default ChatModel