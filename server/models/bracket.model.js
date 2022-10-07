import mongoose from "mongoose";

const bracketSchema = mongoose.Schema({
  name: { type: String, required: true },
  type: { type: Number, required: true },
  id: { type: String },
  length: { type: Number, required: true },
  password: { type: String, required: true },
  upperBracket: [
    {
      ParticipantOne: { type: String },
      ParticipantTwo: { type: String },
      matchId: { type: Number },
      result: { type: Number },
    },
  ],
  lowerBracket: [
    {
      ParticipantOne: { type: String },
      ParticipantTwo: { type: String },
      matchId: { type: Number },
      result: { type: Number },
    },
  ],
});

export default mongoose.model("Bracket", bracketSchema);
