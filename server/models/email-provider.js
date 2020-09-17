const mongoose = require('mongoose')

// define the Provider model schema
const EmailProviderSchema = new mongoose.Schema({
  tenant: {
    type: String,
    index: true,
    required: true,
  },
  kind: {
    type: String,
    enum: ['smtp'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  metadata: {
    from: {
      type: String,
      required: true,
      validate: (from) => from && from.includes('@')
    },
  },
  authentication: String
})

module.exports = mongoose.model('EmailProvider', EmailProviderSchema)
