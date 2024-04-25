import Nasus from "./src";
import Mongoose from "mongoose";

declare module "bun" {
  interface Env {
    MONGO_URI: string;
    RIOT_API_KEY: string;
  }
}

const moongose = await Mongoose.connect(Bun.env.MONGO_URI);

const nasus = new Nasus({
  summonerGameName: "Beleño",
  summonerGameTag: "uwu",
}, moongose);

nasus.stack();
