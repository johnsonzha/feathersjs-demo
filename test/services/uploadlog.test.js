const assert = require('assert');
const app = require('../../src/app');

describe('\'uploadlog\' service', () => {
  it('registered the service', () => {
    const service = app.service('uploadlog');

    assert.ok(service, 'Registered the service');
  });
});
