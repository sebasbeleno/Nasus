import {
  getLeague,
  getMatch,
  getSummoner,
  getSummonerMatchesIds,
} from "./services/LeagueOfLegends";
import { getAccountWithPuuid, getAccountWithRiotID } from "./services/Riot";
import Player from "./models/Player";
import Match from "./models/Match";
import Mongoose, { Schema } from "mongoose";
import Logs from "./models/Logs";
import { getMathDocument, getPlatformId, getRegion } from "./utils";

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
    console.log("Nasus is ready to stack");
    this.firstSummonerGameName = summonerGameName;
    this.firstSummonerGameTag = summonerGameTag;
    this.platformId = getPlatformId();
    this.region = getRegion();
  }

  async ConnectDB() {
    try {
      // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
      await Mongoose.connect(
        Bun.env.MONGO_URI.replace(
          "<database>",
          Bun.env.PLATFORM_ID.toLowerCase()
        )
      );

      console.log(
        Bun.env.MONGO_URI.replace(
          "<database>",
          Bun.env.PLATFORM_ID.toLowerCase()
        )
      );
      await Mongoose.connection.db.admin().command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
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
      const log = new Logs({
        message: error.message,
        level: "error",
        timestamp: new Date(),
        label: error.name,
        rateLimit: error.rateLimit,
        meta: error.body,
      });
      log.save();

      if (error && error.body.status.status_code === 403) {
        console.error(
          "[NASUS]: Request failed with status code 403. Please ensure that your RIOT API Key is valid"
        );
      } else {
        const _randomPlayer = await Player.aggregate([
          { $sample: { size: 1 } },
        ]);
        this.stack(_randomPlayer[0].puuid);
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

      const playerFromDb = await Player.findOne({ puuid: account.puuid });

      if (playerFromDb) {
        return {
          puuid: account.puuid,
          id: playerFromDb.id,
        };
      }
      puuid = account.puuid;
      let summoner = await getSummoner(account.puuid);
      const leagues = await getLeague(summoner.id);

      const player = new Player({
        puuid: account.puuid,
        accountId: account.gameName,
        summonerLevel: summoner.summonerLevel,
        profileIconId: summoner.profileIconId,
        gameName: account.gameName,
        tagLine: account.tagLine,
        leagues: leagues,
        platformId: this.platformId,
      });

      player.save();

      return {
        puuid: account.puuid,
        id: player.id,
      };
    }

    const player = await Player.findOne({ puuid });

    /**
     * If the user its not on the DB, create it
     */
    if (!player) {
      let account = await getAccountWithPuuid(puuid);
      let summoner = await getSummoner(account.puuid);
      const leagues = await getLeague(summoner.id);

      const newPlayer = new Player({
        puuid: account.puuid,
        accountId: account.gameName,
        summonerLevel: summoner.summonerLevel,
        profileIconId: summoner.profileIconId,
        gameName: account.gameName,
        tagLine: account.tagLine,
        leagues: leagues,
        platformId: this.platformId,
      });

      newPlayer.save();

      return {
        id: newPlayer.id,
        puuid: account.puuid,
      };
    }

    return {
      id: player.id,
      puuid: puuid,
    };
  }

  async saveMatchIfNotExists(matchId: string) {
    const _matchFromDB = await Match.findOne({ metadata: { matchId } });

    if (!_matchFromDB) {
      const match = await getMatch(matchId);
      const participantsObj = await this.savePlayersFromMatch(
        match.info.participants.map((p) => p.puuid)
      );
      const match_model = new Match({
        ...match,
        metadata: {
          ...match.metadata,
          participants: participantsObj,
        },
      });

      await match_model.save();

      return match.info.participants[Math.floor(Math.random() * 10)].puuid;
    } else {
      console.log("Match already exists");
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
