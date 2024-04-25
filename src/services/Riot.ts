import { RiotApi, Constants as TwistedConstants } from "twisted";

const api = new RiotApi();

export async function getAccountWithRiotID({
  name,
  tagLine,
}: {
  name: string;
  tagLine: string;
}) {
  // Recommended to use the nearest routing value to your server: americas, asia, europe
  return (
    await api.Account.getByRiotId(
      name,
      tagLine,
      TwistedConstants.RegionGroups.AMERICAS
    )
  ).response;
}

export async function getAccountWithPuuid(puuid: string) {
  return (
    await api.Account.getByPUUID(puuid, TwistedConstants.RegionGroups.AMERICAS)
  ).response;
}
