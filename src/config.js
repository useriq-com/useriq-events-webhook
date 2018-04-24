const appName = process.env.APP_NAME || "useriq-events-webhook"

export default {
  app: {
    name: appName
  },

  server: {
    port: process.env.PORT || 8000,
    concurrency: process.env.WEB_CONCURRENCY || 1,
    is_production: process.env.NODE_ENV === 'production'
  },

  logger: {
    options: {
      name: appName,
      level: process.env.LOGGING_LEVEL || "info",
      stream: process.stdout
      /*streams: [
        {
          level: process.env.LOGGING_LEVEL || "info",
          path: path.join(__dirname,"..","logs","wiki.log")
        }
      ]*/
    }
  }
}
