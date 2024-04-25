import mongoose from "mongoose";
const { Schema } = mongoose;

const playerSchema = new Schema({
  puuid: String,
  accountId: String,
  summonerLevel: Number,
  profileIconId: Number,
  gameName: String,
  tagLine: String,
});

export default mongoose.model("Player", playerSchema);