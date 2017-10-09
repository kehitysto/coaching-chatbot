import fs from 'fs';
import * as sinon from 'sinon';

var assert = require('assert');

const handler = require('../../../src/facebook-messenger/handler');
const mockEvent = require('../../data/event-fbmessage.json');

describe('Facebook Messenger service handler', function() {
  beforeEach(function() {
    process.env.FACEBOOK_PAGE_ACCESS_TOKEN = 'DUMMY_ACCESS_TOKEN';
    process.env.FACEBOOK_VERIFY_TOKEN = 'DUMMY_VERIFY_TOKEN';
  });

  describe('#handler() on GET', function() {
    this.timeout(15000);

    it('should return challenge', function() {
      let s = sinon.stub();
      let challenge = 'CHALLENGE';

      let expectedResponse = {
        response: challenge
      };

      let event = {
        method: 'GET',
      };

      event.query = {};
      event.query['hub.verify_token'] = process.env.FACEBOOK_VERIFY_TOKEN;
      event.query['hub.challenge'] = challenge;

      const ret = handler.handler(event, {}, s);

      expect(ret)
        .to.be.a('Promise');

      return expect(ret)
        .to.eventually.be.fulfilled.then(() => {
          expect(s)
            .to.have.been.calledWith(null, expectedResponse);
        });
    });

    it('should return bad token on bad token when trying challenge',
      function() {
        let s = sinon.stub();
        let challenge = 'CHALLENGE';
        let expectedResponse = 'Error: 400 Bad Token';

        let event = {
          method: 'GET',
        };

        event.query = {};
        event.query['hub.verify_token'] = 512;
        event.query['hub.challenge'] = challenge;

        const ret = handler.handler(event, {}, s);

        expect(ret)
          .to.be.a('Promise');

        return expect(ret)
          .to.eventually.be.fulfilled.then(() => {
            expect(s.firstCall.args[0])
              .to.be.an('error');
          });
      });

    it('should return error on unsupported HTTP method', function() {
      let s = sinon.stub();
      let expectedResponse = 'Unknown event';

      let m = mockEvent;
      m.method = 'PUT';

      const ret = handler.handler(m, {}, s);

      return assert(s.firstCall.args[0] == expectedResponse);
    });
  });
});
