import mongoose from "mongoose";

const ConvSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  convID: { type: String, required: true, unique: true },
  dialogues: [
    {
      speaker: { type: String, required: true },
      speech: { type: String, required: true },
      sidenote: String,
    },
  ],
});

export const convModel = mongoose.model("conv", ConvSchema);
