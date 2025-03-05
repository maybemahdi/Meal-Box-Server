import { model, Schema } from "mongoose";
import { IContact } from "./contact.interface";

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"] },
    subject: { type: String, required: [true, "Subject is required"] },
    message: { type: String, required: [true, "Message is required"] },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const Contact = model<IContact>("Contact", ContactSchema);
