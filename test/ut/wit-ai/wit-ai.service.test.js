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

        const WitAI = require('../../../src/wit-ai/wit-ai.service');
        this.wit = new WitAI();
    });

    after(function() {
        mockery.disable();
    });

    describe('#set_job', function() {
      it('returns a Promise', function() {
        const ret = this.wit.set_job({
          context: {},
          entities: {},
        });

        expect(ret).to.be.a('Promise');
        });

      it('returns the job from entity job', function() {
        const ret = this.wit.set_job({
          context: {},
          entities: {
            job: [
              { value: 'taksikuski' },
            ],
          },
        });

        expect(ret).to.become({ job: 'taksikuski' });
      });

      it('preserves context', function() {
        const ret = this.wit.set_job({
          context: { 'foo': 'bar' },
          entities: {
            job: [
              { value: 'maalari' },
            ],
          },
        });

        return expect(ret).to.eventually
        .deep.equal( { 'foo': 'bar', 'job': 'maalari' } );
      });
    });

    describe('#set_age', function() {
      it('returns a Promise', function() {
        const ret = this.wit.set_age({
          context: {},
          entities: {},
        });

        expect(ret).to.be.a('Promise');
      });

      it('returns the age from entity age', function() {
          const ret = this.wit.set_age({
            context: {},
            entities: [
              { value: '66' },
            ],
          });

          expect(ret).to.become( { age: '66' } );
      });

      it('preserves context', function() {
        const ret = this.wit.set_age({
          context: { 'foo': 'bar' },
          entities: {
            age: [
              { value: '43' },
            ],
          },
        });

        return expect(ret).to.eventually
        .deep.equal( { 'foo': 'bar', 'age': '43' } );
      });
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

      it('preserves context', function() {
        const ret = this.wit.set_name({
            context: { 'foo': 'bar' },
            entities: {
              name: [
                { value: 'Jari' },
              ],
            },
        });

        return expect(ret).to.eventually
        .deep.equal( { 'foo': 'bar', 'name': 'Jari' } );
      });
    });
});
