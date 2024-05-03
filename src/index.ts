import {
  getLeague,
  getMatch,
  getSummoner,
  getSummonerMatchesIds,
} from "./services/LeagueOfLegends";
import { getAccountWithPuuid, getAccountWithRiotID } from "./services/Riot";
import Mongoose, { Schema } from "mongoose";
import { getPlatformId, getRegion } from "./utils";
import PlayerRepository from "./repositories/PlayerRepository";
import MatchRepository from "./repositories/MatchRepository";
import LogsRepository from "./repositories/LogsRepository";

class Nasus {
  firstSummonerGameName: string;
  firstSummonerGameTag: string;
  platformId: string;
  region: string;

  /**
   *
   * @param param0 Initial summoner data
   */
  constructor({
    summonerGameName,
    summonerGameTag,
  }: {
    summonerGameName: string;
    summonerGameTag: string;
  }) {
    console.log("[NASUS]: Nasus is ready to stack");
    this.firstSummonerGameName = summonerGameName;
    this.firstSummonerGameTag = summonerGameTag;
    this.platformId = getPlatformId();
    this.region = getRegion();
  }

  async ConnectDB() {
    try {
      // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
      await Mongoose.connect(
        Bun.env.DEV_MONGO_URI.replace(
          "<database>",
          Bun.env.PLATFORM_ID.toLowerCase()
        )
      );
      await Mongoose.connection.db.admin().command({ ping: 1 });
      console.log(
        "[NASUS]: Pinged your deployment. You successfully connected to MongoDB!"
      );
    } catch {
      // Ensures that the client will close when you finish/error
      await Mongoose.disconnect();
    }
  }

  async stack(puuid?: string) {
    try {
      const { puuid: newPuuid } = await this.savePlayerIfNotExists(puuid);

      let matchsIds = await getSummonerMatchesIds(newPuuid);
      let randomSummonerPuuid = undefined;

      for (let matchId of matchsIds) {
        randomSummonerPuuid = await this.saveMatchIfNotExists(matchId);
      }

      this.stack(randomSummonerPuuid);
    } catch (error: any) {
      await LogsRepository.saveLog({
        message: error.message,
        level: "error",
        timestamp: new Date(),
        label: error.name,
        rateLimit: error.rateLimit,
        meta: error.body,
      });

      if (error && error.body.status.status_code === 403) {
        console.error(
          "[NASUS]: Request failed with status code 403. Please ensure that your RIOT API Key is valid"
        );
      } else {
        const randomPlayer = await PlayerRepository.getRandomPlayerPuuid();

        this.stack(randomPlayer);
      }
    }
  }

  async savePlayerIfNotExists(puuid?: string): Promise<{
    puuid: string;
    id: Schema.Types.ObjectId;
  }> {
    /**
     * If the puuid its not provided that means that its the first player of the stack.
     * Fetch the data of the first player. This player its set on config.ts
     */
    if (!puuid) {
      let account = await getAccountWithRiotID({
        name: this.firstSummonerGameName,
        tagLine: this.firstSummonerGameTag,
      });

      const playerExists = await PlayerRepository.checkIfPlayerExists(
        account.puuid
      );

      // The player exists
      if (playerExists) {
        return {
          puuid: playerExists.puuid as string,
          id: playerExists.id,
        };
      }
      puuid = account.puuid;

      let summoner = await getSummoner(account.puuid);
      const leagues = await getLeague(summoner.id);

      const newPlayer = await PlayerRepository.savePlayer({
        puuid: account.puuid,
        accountId: account.gameName,
        summonerLevel: summoner.summonerLevel,
        profileIconId: summoner.profileIconId,
        gameName: account.gameName,
        tagLine: account.tagLine,
        leagues: leagues,
        platformId: this.platformId,
      });

      return {
        puuid: account.puuid,
        id: newPlayer.id,
      };
    }

    const playerExists = await PlayerRepository.checkIfPlayerExists(puuid);
    /**
     * If the user its not on the DB, create it
     */
    if (!playerExists) {
      let account = await getAccountWithPuuid(puuid);
      let summoner = await getSummoner(account.puuid);
      const leagues = await getLeague(summoner.id);

      const newPlayer = await PlayerRepository.savePlayer({
        puuid: account.puuid,
        accountId: account.gameName,
        summonerLevel: summoner.summonerLevel,
        profileIconId: summoner.profileIconId,
        gameName: account.gameName,
        tagLine: account.tagLine,
        leagues: leagues,
        platformId: this.platformId,
      });

      return {
        id: newPlayer.id,
        puuid: account.puuid,
      };
    }

    return {
      id: playerExists.id,
      puuid: puuid,
    };
  }

  async saveMatchIfNotExists(matchId: string) {
    const matchExist = await MatchRepository.checkIfMatchExist(matchId);

    if (!matchExist) {
      const match = await getMatch(matchId);
      const participantsObj = await this.savePlayersFromMatch(
        match.info.participants.map((p) => p.puuid)
      );

      await MatchRepository.saveMatch({
        ...match,
        metadata: {
          ...match.metadata,
          participants: participantsObj,
        },
      });

      return match.info.participants[Math.floor(Math.random() * 10)].puuid;
    } else {
      console.log("[NASUS]: Match already exists");
      const match = await getMatch(matchId);
      return match.info.participants[Math.floor(Math.random() * 10)].puuid;
    }
  }

  async savePlayersFromMatch(
    participants: string[]
  ): Promise<Schema.Types.ObjectId[]> {
    const _participants: Schema.Types.ObjectId[] = [];

    for (let puuid of participants) {
      const { id } = await this.savePlayerIfNotExists(puuid);
      _participants.push(id);
    }

    return _participants;
  }
}

export default Nasus;
