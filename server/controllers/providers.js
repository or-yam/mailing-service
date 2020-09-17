const EmailProvider = require('../models/email-provider')
const uniqid = require('uniqid')
const { setSecret } = require('../../helpers/secrets-management')

function createProvider(req, res) {
  const body = req.body || {}
  const provider = new EmailProvider({
    tenant: req.headers.tenant,
    name: body.name,
    kind: body.kind,
    metadata: body.metadata,
    authentication: uniqid()
  })

  return setSecret(provider.tenant, provider.authentication, body.authentication)
    .then(() => provider.save())
    .then((storage) => {
      return res.status(200).json({
        _id: storage._id,
        name: storage.name,
        kind: storage.kind,
        metadata: storage.metadata
      }).end()
    })
    .catch((err) => {
      res.status(400).json({ message: 'email provider creation failed' }).end()
    })
}

function getProvidersList(req, res) {
  return EmailProvider.find({ tenant: req.headers.tenant })
    .select('kind name metadata')
    .lean()
    .then(list => {
      if (!list) {
        return Promise.reject(null)
      }
      return res.status(200).json(list).end()
    })
    .catch(() => res.status(400).json({ message: 'error loading email providers list' }).end())
}

function removeProvider(req, res) {
  req.storage.remove()
    .then(() => res.status(200).json({}).end())
    .catch(() => res.status(400).json({ message: 'failed to remove email provider' }).end())
}

function updateProvider(req, res) {
  const body = req.body || {}
  let promise = Promise.resolve()
  if (body.name && body.name !== req.provider.name) {
    req.provider.name = body.name
  }
  if ((body.kind && body.kind !== req.provider.kind) || body.authentication) {
    req.provider.kind = body.kind || req.provider.kind
    promise = setSecret(req.provider.tenant, req.provider.authentication, body.authentication)
  }
  if (body.metadata) {
    req.provider.metadata = body.metadata
  }
  promise
    .then(() => req.storage.save())
    .then(() => res.status(200).json({
      name: req.provider.name,
      kind: req.provider.kind,
      metadata: req.provider.metadata
    }).end())
    .catch(() => res.status(400).json({ message: 'failed to update email provider' }).end())
}

function getProviderById(req, res, next) {
  return EmailProvider.findOne({ _id: req.params.providerId, tenant: req.headers.tenant })
    .then(provider => {
      req.provider = provider
      next()
    })
    .catch(() => res.status(404).json({ message: 'could not find email provider' }).end())
}

function getProvider(req, res) {
  const { _id, name, kind, metadata } = req.storage
  res.status(200).json({ _id, name, kind, metadata }).end()
}

module.exports = { createProvider, getProvidersList, removeProvider, getProviderById, updateProvider, getProvider }
