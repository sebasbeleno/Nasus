import { Constants } from "twisted";
import type { MatchV5DTOs } from "twisted/dist/models-dto";

export const getRegion = () => {
  const region = getPlatformId();

  return Constants.regionToRegionGroup(region);
};

export const getPlatformId = () => {
  const platform = process.env.PLATFORM_ID;

  if (!platform) {
    throw new Error("No platform provided");
  }

  switch (platform) {
    case "BRAZIL":
      return Constants.Regions.BRAZIL;
    case "EU_EAST":
      return Constants.Regions.EU_EAST;
    case "EU_WEST":
      return Constants.Regions.EU_WEST;
    case "KOREA":
      return Constants.Regions.KOREA;
    case "LAT_NORTH":
      return Constants.Regions.LAT_NORTH;
    case "LAT_SOUTH":
      return Constants.Regions.LAT_SOUTH;
    case "AMERICA_NORTH":
      return Constants.Regions.AMERICA_NORTH;
    case "OCEANIA":
      return Constants.Regions.OCEANIA;
    case "TURKEY":
      return Constants.Regions.TURKEY;
    case "RUSSIA":
      return Constants.Regions.RUSSIA;
    case "JAPAN":
      return Constants.Regions.JAPAN;
    case "VIETNAM":
      return Constants.Regions.VIETNAM;
    case "TAIWAN":
      return Constants.Regions.TAIWAN;
    case "THAILAND":
      return Constants.Regions.THAILAND;
    case "SINGAPORE":
      return Constants.Regions.SINGAPORE;
    case "PHILIPPINES":
      return Constants.Regions.PHILIPPINES;
    case "PBE":
      return Constants.Regions.PBE;
    default:
      throw new Error("Invalid platform");
  }
};

export const getMathDocument = (
  match: MatchV5DTOs.MatchDto
): MatchV5DTOs.MatchDto => {
  return match;
};
