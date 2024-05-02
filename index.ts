import Nasus from "./src";
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

const defaultSummoner =
  config.defaultSummonersByPlatformId[Bun.env.PLATFORM_ID];

const nasus = new Nasus({
  summonerGameName: defaultSummoner.gameName,
  summonerGameTag: defaultSummoner.tagLine,
});

nasus.ConnectDB().then(() => {
  nasus.stack();
});
