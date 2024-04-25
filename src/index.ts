import {
  getMatch,
  getSummoner,
  getSummonerMatchesIds,
} from "./services/LeagueOfLegends";
import { getAccountWithPuuid, getAccountWithRiotID } from "./services/Riot";
import Player from "./models/Player";
import Match from "./models/Match";
import Mongoose from "mongoose";

class Nasus {
  firstSummonerGameName: string;
  firstSummonerGameTag: string;
  moongose: typeof Mongoose;

  /**
   *
   * @param param0 Initial summoner data
   */
  constructor(
    {
      summonerGameName,
      summonerGameTag,
    }: {
      summonerGameName: string;
      summonerGameTag: string;
    },
    moongose: typeof Mongoose
  ) {
    console.log("Nasus is ready to stack");
    this.firstSummonerGameName = summonerGameName;
    this.firstSummonerGameTag = summonerGameTag;
    this.moongose = moongose;
  }

  async stack(puuid?: string) {
    puuid = await this.savePlayerIfNotExists(puuid);

    let matchsIds = await getSummonerMatchesIds(puuid);
    let randomSummonerPuuid = undefined;

    for (let matchId of matchsIds) {
      randomSummonerPuuid = await this.saveMatchIfNotExists(matchId);
    }

    this.stack(randomSummonerPuuid);
  }

  async savePlayerIfNotExists(puuid?: string) {
    if (!puuid) {

      let account = await getAccountWithRiotID({
        name: this.firstSummonerGameName,
        tagLine: this.firstSummonerGameTag,
      });

      const playerFromDb = await Player.findOne({ puuid: account.puuid });

      if (playerFromDb) {
        return account.puuid;
      }
      puuid = account.puuid;
      let summoner = await getSummoner(account.puuid);

      const player = new Player({
        puuid: account.puuid,
        accountId: account.gameName,
        summonerLevel: summoner.summonerLevel,
        profileIconId: summoner.profileIconId,
        gameName: account.gameName,
        tagLine: account.tagLine,
      });

      player.save();

      return puuid;
    }

    const player = await Player.findOne({ puuid });

    if (!player) {
      let account = await getAccountWithPuuid(puuid);
      let summoner = await getSummoner(account.puuid);

      const player = new Player({
        puuid: account.puuid,
        accountId: account.gameName,
        summonerLevel: summoner.summonerLevel,
        profileIconId: summoner.profileIconId,
        gameName: account.gameName,
        tagLine: account.tagLine,
      });

      player.save();
    }

    return puuid;
  }

  async saveMatchIfNotExists(matchId: string) {
    const _matchFromDB = await Match.findOne({ metadata: { matchId } });

    if (!_matchFromDB) {
      const match = await getMatch(matchId);
      const match_model = new Match(match);

      await this.savePlayersFromMatch(match.info.participants.map((p) => p.puuid));
      await match_model.save();

      return  match.info.participants[Math.floor(Math.random() * 10)].puuid;
    } else {
      console.log("Match already exists");
    }
  }

  async savePlayersFromMatch(participants: string[]) {
    for (let puuid of participants) {
      await this.savePlayerIfNotExists(puuid);
    }
  }
}

export default Nasus;