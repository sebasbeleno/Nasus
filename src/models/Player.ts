import mongoose from "mongoose";
const { Schema } = mongoose;

const playerSchema = new Schema({
  puuid: String,
  accountId: String,
  summonerLevel: Number,
  profileIconId: Number,
  gameName: String,
  tagLine: String,
  leagues: [{
    queueType: String,
    hotStreak: Boolean,
    wins: Number,
    veteran: Boolean,
    losses: Number,
    rank: String,
    leagueId: String,
    inactive: Boolean,
    freshBlood: Boolean,
    tier: String,
    leaguePoints: Number
  }]
});

export default mongoose.model("Player", playerSchema);