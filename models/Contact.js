import { Schema, model } from "mongoose";
import { handlerSaveError, setUpdateSettings } from "./hooks.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: [true, "Set email for contact"],
    },
    phone: {
      type: String,
      required: [true, "Set phone for contauct"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);
contactSchema.pre("findOneAndUpdate", setUpdateSettings);
contactSchema.post("save", handlerSaveError);
contactSchema.post("findOneAndUpdate", handlerSaveError);

const Contact = model("contact", contactSchema);
export default Contact;
