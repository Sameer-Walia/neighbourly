import mongoose, { Schema } from "mongoose";

interface IOtp extends Document 
{
    phone: string;
    otp: string;
    createdAt: Date;
}

const otpSchema: Schema<IOtp> = new Schema({ phone: { type: String, required: true, }, otp: { type: String, required: true, }, createdAt: { type: Date, default: Date.now, expires: 120 } }, { versionKey: false });

const OtpModel = mongoose.model<IOtp>("OtpModel", otpSchema, "OtpModel");

export default OtpModel