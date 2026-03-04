import cron from "node-cron";
import { markOverdueIssuesService } from "../services/issue.service.js";

const DEFAULT_SCHEDULE = "*/5 * * * *";

const resolveCronHelpers = () => {
  const schedule = cron.schedule || cron.default?.schedule;
  const validate = cron.validate || cron.default?.validate;
  return { schedule, validate };
};

const getSchedule = () => {
  const schedule = process.env.OVERDUE_CRON_SCHEDULE || DEFAULT_SCHEDULE;
  const { validate } = resolveCronHelpers();
  if (!validate || !validate(schedule)) {
    console.warn(
      `[OverdueCron] Invalid schedule '${schedule}', using default '${DEFAULT_SCHEDULE}'.`
    );
    return DEFAULT_SCHEDULE;
  }
  return schedule;
};

const startOverdueCron = () => {
  const cronSchedule = getSchedule();
  const { schedule } = resolveCronHelpers();

  if (!schedule) {
    console.error("[OverdueCron] node-cron schedule helper not available.");
    return;
  }

  const runCheck = async () => {
    try {
      const updatedCount = await markOverdueIssuesService();
      if (updatedCount > 0) {
        console.info(`[OverdueCron] Marked ${updatedCount} issues as overdue.`);
      }
    } catch (error) {
      console.error("[OverdueCron] Failed to update overdue issues", error.message);
    }
  };

  console.info(`[OverdueCron] Scheduled with '${cronSchedule}'.`);
  runCheck();
  schedule(cronSchedule, runCheck);
};

export default startOverdueCron;
