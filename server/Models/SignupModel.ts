import mongoose, { Model, Schema } from "mongoose";

interface Signup extends Document
{
    name: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    usertype: string;
    actstatus: boolean;
    token: string;
}

const SignupSchema: Schema<Signup> = new Schema<Signup>({ name: { type: String, required: true }, address: { type: String, required: true }, phone: { type: String, required: true }, email: { type: String, required: true, unique: true }, password: { type: String, required: true }, usertype: { type: String, required: true }, actstatus: { type: Boolean, required: true }, token: { type: String, required: true } }, { versionKey: false });

const SignupModel: Model<Signup> = mongoose.model<Signup>("signup", SignupSchema, "signup");

export default SignupModel
