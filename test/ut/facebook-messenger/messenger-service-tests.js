import * as fs from 'fs';
import * as sinon from 'sinon';

const mod = require('inject-loader!../../../src/facebook-messenger/messenger-service');

describe('Facebook Messenger service', function() {
  beforeEach(function() {
    this.request = sinon.stub()
      .returns(Promise.resolve());

    this.Messenger = mod({
      'request-promise': this.request,
    });

    process.env.FACEBOOK_PAGE_ACCESS_TOKEN = 'DUMMY_ACCESS_TOKEN';
    process.env.FACEBOOK_VERIFY_TOKEN = 'DUMMY_VERIFY_TOKEN';
  });

  describe('#send()', function() {
    before(function() {
      process.env.RUN_ENV = 'mock';
    });

    after(function() {
      process.env.RUN_ENV = 'dev';
    });

    it('should return a Promise', function() {
      const ret = this.Messenger.send('USER_ID', 'Message...');

      expect(ret)
        .to.be.a('Promise');

      return expect(ret)
        .to.eventually.be.fulfilled;
    });

    it('Should return an error when page acces token is empty',
      function() {
        delete process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
        const ret = this.Messenger.send('USER_ID', 'Message...');

        return expect(ret)
          .to
          .be.rejectedWith('No FACEBOOK_PAGE_ACCESS_TOKEN defined');
      });

    it('should send messages to facebook', function() {
      const ret = this.Messenger.send('USER_ID', 'Message...');

      return expect(ret)
        .to.eventually.be.fulfilled.then(() => {
          return expect(this.request)
            .to.have.been.calledWith(
              sinon.match({
                url: sinon.match(
                  /https:\/\/graph\.facebook\.com\/.*\/me\/messages/
                ),
                qs: {
                  access_token: 'DUMMY_ACCESS_TOKEN',
                },
                method: 'POST',
                json: sinon.match({
                  recipient: {
                    id: 'USER_ID',
                  },
                  message: {
                    text: 'Message...',
                  },
                }),
              })
            );
        });
    });
  });

  describe('#receive()', function() {
    before(function() {
      this.data = JSON.parse(
        fs.readFileSync('./test/data/event-fbmessage.json')
      );

      this.cb = {
        receive: sinon.stub()
          .returns(Promise.resolve([{
            message: 'hello, world!',
            quickReplies: [],
          }])),
      };
    });

    it('should return a Promise', function() {
      const ret = this.Messenger.receive(this.data.body, this.cb);

      expect(ret)
        .to.be.a('Promise');

      return expect(ret.catch())
        .to.eventually.be.fulfilled;
    });

    it('should call callback with the message sender and body',
      function() {
        const mock = sinon.mock(this.Messenger);
        mock.expects('send')
          .withArgs('USER_ID', 'hello, world!', []);

        const ret = this.Messenger.receive(this.data.body, this.cb);

        return expect(ret)
          .to.eventually.be.fulfilled.then(() => {
            return mock.verify();
          });
      });

    it('Should return an error when data.object value is not "page"',
      function() {
        let dat = {};
        const ret = this.Messenger.receive(dat, this.cb);

        return expect(ret)
          .to.be.rejectedWith('Bad event');
      });

    it('Should return an message when message contains no text',
      function() {
        const mock = sinon.mock(this.Messenger);

        const unhandledMessageTypeResponse =
          'Voit lähettää minulle vain tekstiä tai painaa antamiani nappeja.';
        mock.expects('send')
          .withArgs('USER_ID', unhandledMessageTypeResponse);

        this.data.body.entry[0].messaging[0].message.text = '';
        const ret = this.Messenger.receive(this.data.body, this.cb);

        return expect(ret)
          .to.eventually.be.fulfilled.then(() => {
            return mock.verify();
          });
      });

  });

  describe('#verify()', function() {
    it('Should return a Promise', function() {
      const ret = this.Messenger.verify(process.env.FACEBOOK_VERIFY_TOKEN,
        'challenge');

      return expect(ret)
        .to.be.a('Promise');
    });

    it('Should return challenge as response parameter value', function() {
      const ret = this.Messenger.verify(process.env.FACEBOOK_VERIFY_TOKEN,
        'chall');

      return expect(ret)
        .to.eventually.become({
          response: 'chall',
        });
    });

    it('Should return an error when verify token is wrong', function() {
      const ret = this.Messenger.verify('WRONG_TOKEN', 'challenge');

      return expect(ret)
        .to.be.rejectedWith(Error);
    });
  });
});
