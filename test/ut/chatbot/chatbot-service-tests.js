import * as sinon from 'sinon';

import * as Bot from '../../../src/chatbot/chatbot-service';
import dialog from '../../../src/coaching-chatbot/dialog';
import * as Sessions from '../../../src/util/sessions-service';

describe('chatbot-service', function() {
  beforeEach(function() {
    this.sessions = new Sessions();
    this.dialog = dialog;
    this.bot = new Bot(this.dialog, this.sessions);
  });

  describe('#receive', function() {
    it('should attempt to read context with the supplied sessionId',
      function() {
        const sessionId = 123;
        const text = 'beef';
        const mockSessions = sinon.mock(this.sessions);
        mockSessions.expects('read')
          .withArgs(sessionId)
          .returns(Promise.resolve({}));

        return expect(this.bot.receive(sessionId, text))
          .to.eventually.be.fulfilled
          .then(() => {
            return mockSessions.verify();
          });
      });

    it('should call dialog with the supplied arguments', function() {
      const sessionId = 123;
      const context = {};
      const text = 'beef';

      const mockSessions = sinon.mock(this.sessions);
      mockSessions.expects('read')
        .withArgs(sessionId)
        .returns(Promise.resolve({}));

      const mockDialog = sinon.mock(this.dialog);
      mockDialog.expects('run')
        .withArgs(sessionId, context, text)
        .returns({});

      return expect(this.bot.receive(sessionId, text))
        .to.eventually.be.fulfilled
        .then(() => {
          return mockDialog.verify();
        });
    });

    it('should attempt to write the context to the database', function() {
      const sessionId = 123;
      const expectedContext = {
        state: '/?1',
      };
      const text = 'beef';

      const mockSessions = sinon.mock(this.sessions);
      mockSessions.expects('write')
        .withArgs(sessionId, expectedContext)
        .returns(Promise.resolve({}));

      const mockDialog = sinon.mock(this.dialog);
      mockDialog.expects('run')
        .withArgs(sessionId, {}, text)
        .returns(Promise.resolve({
          context: expectedContext,
        }));

      return expect(this.bot.receive(sessionId, text))
        .to.eventually.be.fulfilled
        .then(() => {
          return mockSessions.verify();
        });
    });
  });
});
