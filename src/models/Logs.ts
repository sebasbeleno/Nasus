import mongoose from "mongoose";
const { Schema } = mongoose;

const logsSchema = new Schema({
  message: String,
  level: String,
  timestamp: Date,
  label: String,
  meta: Object,
  rateLimit: Object
});

export default mongoose.model("Logs", logsSchema);