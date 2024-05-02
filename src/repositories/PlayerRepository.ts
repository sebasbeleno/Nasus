import type { SummonerLeagueDto } from "twisted/dist/models-dto";
import Player from "../models/Player";

class PlayerRepository {
  public savePlayer({
    puuid,
    summonerLevel,
    accountId,
    platformId,
    profileIconId,
    leagues,
    tagLine,
    gameName,
  }: {
    puuid: string;
    summonerLevel: number;
    accountId: string;
    profileIconId: number;
    gameName: string;
    tagLine: string;
    leagues: SummonerLeagueDto[];
    platformId: string;
  }) {
    const newPlayer = new Player({
      accountId,
      gameName,
      leagues,
      platformId,
      profileIconId,
      puuid,
      summonerLevel,
      tagLine,
    });

    return newPlayer.save()
  }

  public async checkIfPlayerExists(puuid: string) {
    const playerFromDb = await Player.findOne({ puuid: puuid });

    if (!playerFromDb) {
        return null
    }

    return {
        puuid: playerFromDb.puuid,
        id: playerFromDb.id
    }
  }

  public async getRandomPlayerPuuid() {
    const _randomPlayer = await Player.aggregate([
        { $sample: { size: 1 } },
      ]);

      return _randomPlayer[0].puuid
  }
}

export default new PlayerRepository();
