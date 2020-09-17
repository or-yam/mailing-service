const app = require('@greenpress/api-kit').app()
const { createProvider, getProvidersList, getProviderById, getProvider, updateProvider, removeProvider } = require('../controllers/providers')

app
  .get('/api/mailing/providers', getProvidersList)
  .post('/api/mailing/providers', createProvider)
  .get('/api/mailing/providers/:providerId', getProviderById, getProvider)
  .put('/api/mailing/providers/:providerId', getProviderById, updateProvider)
  .delete('/api/mailing/providers/:providerId', getProviderById, removeProvider)
