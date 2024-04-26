import { LolApi } from "twisted";
import { getPlatformId, getRegion } from "../utils";

const api = new LolApi({
  debug: {
    logUrls: true,
    logTime: true,
  }
});

export async function getSummoner(puuid: string) {
  return (await api.Summoner.getByPUUID(puuid, getPlatformId())).response;
}

export const getSummonerMatchesIds = async (puuid: string) => {
  return (await api.MatchV5.list(puuid, getRegion())).response;
}

export const getMatch = async (matchId: string) => {
  return (await api.MatchV5.get(matchId, getRegion())).response;
}

export const getLeague = async (encryptedSummonerId: string) => {
  return (await api.League.bySummoner(encryptedSummonerId, getPlatformId())).response;
}
