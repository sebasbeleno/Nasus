import Nasus from "./src";
import Mongoose from "mongoose";

const moongose = await Mongoose.connect("mongodb://localhost:27017/nasus");

const nasus = new Nasus({
  summonerGameName: "Beleño",
  summonerGameTag: "uwu",
}, moongose);

nasus.stack();
