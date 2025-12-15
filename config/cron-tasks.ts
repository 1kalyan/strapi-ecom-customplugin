export default {
  "*/10 * * * *": async ({ strapi }) => {
    try {
      const value = Math.floor(Math.random() * 1000);

      await strapi.entityService.create("api::cron-log.cron-log", {
        data: {
          message: `Cron executed at ${new Date().toLocaleString()}`,
          value,
        },
      });
      strapi.log.info(`Cron saved entry with value: ${value}`);
    } catch (err) {
      strapi.log.error("Cron failed", err);
    }
  },
};
