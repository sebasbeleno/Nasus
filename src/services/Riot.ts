import { RiotApi } from "twisted";
import { getRegion } from "../utils";

const api = new RiotApi({
  debug: {
    logUrls: true,
    logTime: true,
  }
});

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
      getRegion()
    )
  ).response;
}

export async function getAccountWithPuuid(puuid: string) {
  return (
    await api.Account.getByPUUID(puuid, getRegion())
  ).response;
}
