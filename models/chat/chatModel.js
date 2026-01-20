import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  fileName: String,
  uploadedAt: { type: Date, default: Date.now },
  graphData: [
    {
      date: String,
      activeUsers: Number,
      newUsers: Number,
    },
  ],
  active4DaysUsers: [String],
});

const chat = mongoose.model("Chat", ChatSchema);

module.exports = chat;
