import mongoose, { Model, Schema } from "mongoose";

interface ResetPassword extends Document
{
    email: string;
    exptime: Date;
    token: string;
}

const ResetPassSchema: Schema<ResetPassword> = new Schema({ email: { type: String, required: true }, exptime: { type: Date, required: true }, token: { type: String, required: true }, }, { versionKey: false });

const restPassModel: Model<ResetPassword> = mongoose.model<ResetPassword>("resetpass", ResetPassSchema, "resetpass");

export default restPassModel