const assert = require('assert');
const app = require('../../src/app');

describe('\'wgoods\' service', () => {
  it('registered the service', () => {
    const service = app.service('wgoods');

    assert.ok(service, 'Registered the service');
  });
});
