import sinon from 'sinon';
import mockery from 'mockery';


describe('Wit.ai service', function() {
    before(function() {
        process.env.WIT_AI_TOKEN = 'DUMMY_WIT_AI_TOKEN';

        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true,
        });

        this.WitSDK = {
            Wit: sinon.stub(),
            log: { Logger: sinon.stub() },
        };
        mockery.registerMock('node-wit', this.WitSDK);

        this.sessions = {
            read: sinon.stub(),
            write: sinon.stub(),
        };
        mockery.registerMock('./sessions.service', this.sessions);

        const WitAI = require('../../src/wit-ai/wit-ai.service');
        this.wit = new WitAI();
    });

    after(function() {
        mockery.disable();
    });

    describe('#set_name', function() {
      it('returns a Promise', function() {
        const ret = this.wit.set_name({
          context: {},
          entities: {},
        });

        expect(ret).to.be.a('Promise');
      });

      it('returns the name from entity name', function() {
        const ret = this.wit.set_name({
          context: {},
          entities: {
            name: [
              { value: 'Pertti' },
            ],
          },
        });

        expect(ret).to.become({ name: 'Pertti' });
      });

      it('returns the name from entity contact', function() {
        const ret = this.wit.set_name({
            context: {},
            entities: {
              contact: [
                { value: 'Jari' },
              ],
            },
        });

        expect(ret).to.become( { name: 'Jari' } );
      });
    });
});
