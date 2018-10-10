// Initializes the `uploadlog` service on path `/uploadlog`
const createService = require('feathers-sequelize');
const createModel = require('../../models/uploadlog.model');
const hooks = require('./uploadlog.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/uploadlog', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('uploadlog');

  service.hooks(hooks);
};
