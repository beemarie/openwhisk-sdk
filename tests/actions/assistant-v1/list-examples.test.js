const assert = require('assert');
const nock = require('nock');
const extend = require('extend');
const omit = require('object.omit');
const openwhisk = require('openwhisk');
const { auth, describe } = require('../../resources/auth-helper');
const { adapt, negativeHandler } = require('../../resources/test-helper');
let listExamples = require('../../../packages/assistant-v1/actions/list-examples');

let ow;
let credentials;
let payload = {
  intent: 'example_intent',
  workspace_id: 'example_workspace',
  headers: {
    'User-Agent': 'openwhisk'
  }
};

before(() => {
  if (process.env.TEST_OPENWHISK && auth) {
    ow = openwhisk(auth.ow);
    listExamples = adapt(listExamples, 'assistant-v1/list-examples', ow);
    credentials = auth.conversation;
  } else {
    credentials = {
      username: 'username',
      password: 'password',
      version: 'version-date'
    };
    beforeEach(() => {
      nock('https://gateway.watsonplatform.net/assistant')
        .get(`/api/v1/workspaces/${payload.workspace_id}`
            + `/intents/${payload.intent}/examples`)
        .query({
          version: credentials.version
        })
        .reply(200, {});
    });
  }
  payload = extend({}, payload, credentials);
});

describe('list-examples', () => {
  it('should fail if credentials are missing', () => {
    const params = omit(payload, ['username', 'password']);
    return listExamples
      .test(params)
      .then(() => {
        assert.fail('No failure on missing credentials');
      })
      .catch(err => negativeHandler(err));
  });
  it('should fail if version is missing', () => {
    const params = omit(payload, ['version']);
    return listExamples
      .test(params)
      .then(() => {
        assert.fail('No failure on missing version');
      })
      .catch(err => negativeHandler(err));
  });
  it('should fail if workspace_id is missing', () => {
    const params = omit(payload, ['workspace_id']);
    return listExamples
      .test(params)
      .then(() => {
        assert.fail('No failure on missing workspace_id');
      })
      .catch(err => negativeHandler(err));
  });
  it('should fail if intent is missing', () => {
    const params = omit(payload, ['intent']);
    return listExamples
      .test(params)
      .then(() => {
        assert.fail('No failure on missing intent');
      })
      .catch(err => negativeHandler(err));
  });
  it('should generate a valid payload', () => {
    const params = payload;
    return listExamples
      .test(params)
      .then(() => {
        assert.ok(true);
      })
      .catch(() => {
        assert.fail('Failure on valid payload');
      });
  });
  it('should succeed with __bx_creds as credential source', () => {
    const params = { __bx_creds: { conversation: payload } };
    return listExamples
      .test(params)
      .then(() => {
        assert.ok(true);
      })
      .catch(() => {
        assert.fail('Failure on valid payload');
      });
  });
});
