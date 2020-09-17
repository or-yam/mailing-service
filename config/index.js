module.exports = {
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost/mailing-service',
  internalServicesSecret: process.env.INTERNAL_SECRET,
  secretsToken: process.env.SECRETS_TOKEN,
}
