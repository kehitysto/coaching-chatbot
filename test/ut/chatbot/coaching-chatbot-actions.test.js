// import sinon from 'sinon';
// import mockery from 'mockery';
import * as actions from '../../../src/chatbot/coaching-chatbot.actions.js';


describe('coaching-bot actions', function() {
    describe('#set_job', function() {
      it('returns a Promise', function() {
        const ret = actions.set_job({
          context: {},
          input: '',
        });

        expect(ret).to.be.a('Promise');
        });

      it('returns the job from entity job', function() {
        const ret = actions.set_job({
          context: {},
          input: 'taksikuski',
        });

        return expect(ret).to.eventually
        .deep.equal({ context: { job: 'taksikuski' } } );
      });

      it('preserves context', function() {
        const ret = actions.set_job({
          context: { 'foo': 'bar' },
          input: 'maalari',
        });

        return expect(ret).to.eventually
        .deep.equal( { context: { 'foo': 'bar', 'job': 'maalari' } } );
      });
    });

    describe('#set_age', function() {
      it('returns a Promise', function() {
        const ret = actions.set_age({
          context: {},
          input: '',
        });

        return expect(ret).to.be.a('Promise');
      });

      it('returns the age from entity age', function() {
          const ret = actions.set_age({
            context: {},
            input: '66',
          });

          return expect(ret).to.become({ context: { age: '66' } } );
      });

      it('preserves context', function() {
        const ret = actions.set_age({
          context: { 'foo': 'bar' },
          input: '43',
        });

        return expect(ret).to.eventually
        .deep.equal( { context: { 'foo': 'bar', 'age': '43' } } );
      });
    });

    describe('#set_name', function() {
      it('returns a Promise', function() {
        const ret = actions.set_name({
          context: {},
          input: '',
        });

        expect(ret).to.be.a('Promise');
      });

      it('returns the name from entity name', function() {
        const ret = actions.set_name({
          context: {},
          input: 'Pertti',
        });

        return expect(ret).to.become({ context: { name: 'Pertti' } } );
      });

      it('returns the name from entity contact', function() {
        const ret = actions.set_name({
            context: {},
            input: 'Jari',
        });

        return expect(ret).to.become({ context: { name: 'Jari' } } );
      });

      it('preserves context', function() {
        const ret = actions.set_name({
            context: { 'foo': 'bar' },
            input: 'Jari',
        });

        return expect(ret).to.eventually
        .deep.equal( { context: { 'foo': 'bar', 'name': 'Jari' } } );
      });
    });
    describe('#set_place', function() {
      it('returns a Promise', function() {
        const ret = actions.set_place({
          context: {},
          input: '',
        });

        expect(ret).to.be.a('Promise');
      });

      it('returns the name from entity place', function() {
        const ret = actions.set_place({
          context: {},
          input: 'Helsinki',
        });

        return expect(ret).to.become({ context: { place: 'Helsinki' } } );
      });

      it('returns the name from entity place', function() {
        const ret = actions.set_place({
            context: {},
            input: 'Amsterdam',
        });

        return expect(ret).to.become( { context: { place: 'Amsterdam' } } );
      });

      it('preserves context', function() {
        const ret = actions.set_place({
            context: { 'foo': 'bar' },
            input: 'Turku',
        });

        return expect(ret).to.eventually
        .deep.equal( { context: { 'foo': 'bar', 'place': 'Turku' } } );
      });
    });
    describe('#update_profile', function() {
      it('Should return a Promise', function() {
        const ret = actions.update_profile({
          context: {},
          input: '',
        });
        expect(ret).to.be.a('Promise');
      });

      it('Should return without age', function() {
        const ret = actions.update_profile({
          context: { 'name': 'Matti', 'job': 'Opiskelija',
         'place': 'Helsinki' },
          userData: '',
        });
        return expect(ret).to.eventually.deep.equal(
        { userData: { profile: 'Matti, Opiskelija, Helsinki' } } );
      });
      it('Should return without place', function() {
        const ret = actions.update_profile({
          context: { 'name': 'Matti', 'job': 'Opiskelija', 'age': '23' },
          userData: '',
        });
        return expect(ret).to.eventually.deep.equal(
        { userData: { profile: 'Matti, Opiskelija, 23' } } );
      });
      it('Should return without age and place', function() {
        const ret = actions.update_profile({
          context: { 'name': 'Matti', 'job': 'Opiskelija' },
          userData: '',
        });
        return expect(ret).to.eventually.deep.equal(
        { userData: { profile: 'Matti, Opiskelija' } } );
      });
      it('Should return everything', function() {
        const ret = actions.update_profile({
          context: { 'name': 'Matti', 'job':
          'Opiskelija', 'age': '23', 'place': 'Helsinki' },
          userData: '',
        });
        return expect(ret).to.eventually.deep.equal(
        { userData: { profile: 'Matti, Opiskelija, 23, Helsinki' } } );
      });
    });
    describe('#reset', function() {
      it('returns a Promise', function() {
        const ret = actions.reset({
          context: {},
          input: '',
        });
        expect(ret).to.be.a('Promise');
      });
      it('returns empty context', function() {
        const ret = actions.reset({
          context: {},
          input: '',
        });
        return expect(ret).to.eventually.deep.equal( { context: {} } );
      });
    });
});
