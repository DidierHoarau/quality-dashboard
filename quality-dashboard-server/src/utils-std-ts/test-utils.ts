import * as sinon from 'sinon';

declare var Promise: any;

export let sandbox: sinon.SinonSandbox;

beforeEach(() => {
  sandbox = sinon.createSandbox();
});

afterEach(() => {
  sandbox.restore();
});
