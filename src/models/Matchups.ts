import mongoose from "mongoose";
const { Schema } = mongoose;

const MatchupsSchemma = new Schema({
  champion1: {
    championid: String,
    teamPosition: String,
    teamId: Number, // 100 is red team and 200 is blue team??? TODO: Check this

    // More data like damage deal and so on
  },
  champion2: {
    championid: String,
    teamPosition: String,
    teamId: Number, // 100 is red team and 200 is blue team??? TODO: Check this
    // More data like damage deal and so on
    // TODO: Add more data
  },
  winerChampionid: String,
  gameMode: String,
  gameType: String,
  leagueTier: String,
  leagueQueueType: String,
  lane: String,
});

export default mongoose.model("Matchups", MatchupsSchemma);
