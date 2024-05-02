import type { Schema } from "mongoose";
import type { MatchV5DTOs } from "twisted/dist/models-dto";
import Match from "../models/Match";

class MatchRepository {
  public saveMatch({
    metadata,
    info,
  }: {
    metadata: {
      participants: Schema.Types.ObjectId[];
      dataVersion: string;
      matchId: string;
    };
    info: MatchV5DTOs.InfoDto;
  }) {
    const newMatch = new Match({
      metadata,
      info,
    });

    return newMatch.save();
  }

  /**
   * Return true if a match it's already recorded on the DB
   * @param matchId Match id
   * @returns
   */
  public async checkIfMatchExist(matchId: string) {
    const _matchFromDB = await Match.exists({ metadata: { matchId } });

    return _matchFromDB!!
  }
}

export default new MatchRepository();
