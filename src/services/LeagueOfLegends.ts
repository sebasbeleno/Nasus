import { LolApi, Constants } from "twisted";

const api = new LolApi();

export async function getSummoner(puuid: string) {
  return (await api.Summoner.getByPUUID(puuid, Constants.Regions.LAT_NORTH)).response;
}

export const getSummonerMatchesIds = async (puuid: string) => {
  return (await api.MatchV5.list(puuid, Constants.RegionGroups.AMERICAS)).response;
}

export const getMatch = async (matchId: string) => {
  return (await api.MatchV5.get(matchId, Constants.RegionGroups.AMERICAS)).response;
}