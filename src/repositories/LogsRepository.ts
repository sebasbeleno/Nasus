import Logs from "../models/Logs";

class LogsRepository {
  public async saveLog({
    message,
    level,
    timestamp,
    label,
    rateLimit,
    meta,
  }: {
    message: string;
    level: string;
    timestamp: Date;
    label: string;
    rateLimit: any;
    meta: any;
  }) {
    const log = new Logs({
      message: message,
      level,
      timestamp,
      label,
      rateLimit,
      meta,
    });
    await log.save();
  }
}

export default new LogsRepository();