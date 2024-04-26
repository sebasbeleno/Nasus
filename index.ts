import Nasus from "./src";
import Mongoose from "mongoose";
import type { EnvironmentPlatformId, EnvironmentRegion } from "./src/types";
import config from "./config";

declare module "bun" {
  interface Env {
    MONGO_URI: string;
    RIOT_API_KEY: string;
    REGION: EnvironmentRegion;
    PLATFORM_ID: EnvironmentPlatformId;
  }
}

const moongose = await Mongoose.connect(Bun.env.MONGO_URI);
const defaultSummoner = config.defaultSummonersByPlatformId[Bun.env.PLATFORM_ID];

const nasus = new Nasus({
  summonerGameName: defaultSummoner.gameName,
  summonerGameTag: defaultSummoner.tagLine,
}, moongose);

nasus.stack();
