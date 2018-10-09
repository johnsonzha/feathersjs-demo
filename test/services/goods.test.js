const assert = require('assert');
const app = require('../../src/app');

describe('\'goods\' service', () => {
  it('registered the service', () => {
    const service = app.service('goods');

    assert.ok(service, 'Registered the service');
  });
});
