import * as actions from '../../../src/coaching-chatbot/actions.js';


describe('coaching-bot actions', function() {
    describe('#setJob', function() {
      it('returns a Promise', function() {
        const ret = actions.setJob({
          context: {},
          input: '',
        });

        expect(ret).to.be.a('Promise');
        });

      it('returns the job from entity job', function() {
        const ret = actions.setJob({
          context: {},
          input: 'taksikuski',
        });

        return expect(ret).to.eventually
        .deep.equal({ context: { job: 'taksikuski' } } );
      });

      it('preserves context', function() {
        const ret = actions.setJob({
          context: { 'foo': 'bar' },
          input: 'maalari',
        });

        return expect(ret).to.eventually
        .deep.equal( { context: { 'foo': 'bar', 'job': 'maalari' } } );
      });
    });

    describe('#setAge', function() {
      it('returns a Promise', function() {
        const ret = actions.setAge({
          context: {},
          input: '',
        });

        return expect(ret).to.be.a('Promise');
      });

      it('returns the age from entity age', function() {
          const ret = actions.setAge({
            context: {},
            input: '66',
          });

          return expect(ret).to.become({ context: { age: '66' } } );
      });

      it('preserves context', function() {
        const ret = actions.setAge({
          context: { 'foo': 'bar' },
          input: '43',
        });

        return expect(ret).to.eventually
        .deep.equal( { context: { 'foo': 'bar', 'age': '43' } } );
      });
    });

    describe('#setName', function() {
      it('returns a Promise', function() {
        const ret = actions.setName({
          context: {},
          input: '',
        });

        expect(ret).to.be.a('Promise');
      });

      it('returns the name from entity name', function() {
        const ret = actions.setName({
          context: {},
          input: 'Pertti',
        });

        return expect(ret).to.become({ context: { name: 'Pertti' } } );
      });

      it('returns the name from entity contact', function() {
        const ret = actions.setName({
            context: {},
            input: 'Jari',
        });

        return expect(ret).to.become({ context: { name: 'Jari' } } );
      });

      it('preserves context', function() {
        const ret = actions.setName({
            context: { 'foo': 'bar' },
            input: 'Jari',
        });

        return expect(ret).to.eventually
        .deep.equal( { context: { 'foo': 'bar', 'name': 'Jari' } } );
      });
    });
    describe('#setPlace', function() {
      it('returns a Promise', function() {
        const ret = actions.setPlace({
          context: {},
          input: '',
        });

        expect(ret).to.be.a('Promise');
      });

      it('returns the name from entity place', function() {
        const ret = actions.setPlace({
          context: {},
          input: 'Helsinki',
        });

        return expect(ret).to.become({ context: { place: 'Helsinki' } } );
      });

      it('returns the name from entity place', function() {
        const ret = actions.setPlace({
            context: {},
            input: 'Amsterdam',
        });

        return expect(ret).to.become( { context: { place: 'Amsterdam' } } );
      });

      it('preserves context', function() {
        const ret = actions.setPlace({
            context: { 'foo': 'bar' },
            input: 'Turku',
        });

        return expect(ret).to.eventually
        .deep.equal( { context: { 'foo': 'bar', 'place': 'Turku' } } );
      });
    });
    describe('#updateProfile', function() {
      it('Should return a Promise', function() {
        const ret = actions.updateProfile({
          context: {},
          input: '',
        });
        expect(ret).to.be.a('Promise');
      });

      it('Should return without age', function() {
        const ret = actions.updateProfile({
          context: { 'name': 'Matti', 'job': 'Opiskelija',
         'place': 'Helsinki' },
          userData: '',
        });
        return expect(ret).to.eventually.deep.equal(
        { userData: { profile: 'Matti, Opiskelija, Helsinki' } } );
      });
      it('Should return without place', function() {
        const ret = actions.updateProfile({
          context: { 'name': 'Matti', 'job': 'Opiskelija', 'age': '23' },
          userData: '',
        });
        return expect(ret).to.eventually.deep.equal(
        { userData: { profile: 'Matti, Opiskelija, 23' } } );
      });
      it('Should return without age and place', function() {
        const ret = actions.updateProfile({
          context: { 'name': 'Matti', 'job': 'Opiskelija' },
          userData: '',
        });
        return expect(ret).to.eventually.deep.equal(
        { userData: { profile: 'Matti, Opiskelija' } } );
      });
      it('Should return everything', function() {
        const ret = actions.updateProfile({
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

    describe('#addCommunicationMethod', function() {
      it('Should return a communication methods with undefined Communication Info', function() {
        const ret = actions.addCommunicationMethod({
          context: {},
          input: 'Skype',
        });
        return expect(ret).to.eventually.deep.equal(
          { context: { communicationMethods: { 'SKYPE': 'UNDEFINED_COMMUNICATION_INFO' } }, result: '@REQUEST_SKYPE_NAME' } );
      });

      it('Should return a a communication method with uderfined communication info when there is already other communication method', function() {
        const ret = actions.addCommunicationMethod({
          context: { communicationMethods: { 'SKYPE': 'nickname' } },
          input: 'Puhelin',
        });
        return expect(ret).to.eventually.deep.equal(
          { context: { communicationMethods: { 'SKYPE': 'nickname', 'PHONE': 'UNDEFINED_COMMUNICATION_INFO' } }, result: '@REQUEST_PHONE_NUMBER' } );
      });
   });

  describe('#addCommunicationInfo', function() {
     it('Should return a communication methods with undefined Communication Info', function() {
       const ret = actions.addCommunicationInfo({
         context: {
           communicationMethods: {
             'Skype': 'UNDEFINED_COMMUNICATION_INFO',
           }
         },
         input: 'nickname',
       });
       return expect(ret).to.eventually.deep.equal(
         { context: { communicationMethods: { 'Skype': 'nickname' } } } );
     });

     it('Should return Promise if there is no undefined communication methods', function() {
       const ret = actions.addCommunicationInfo({
         context: {},
         input: 'nickname',
       });
       return expect(ret).to.eventually.deep.equal(
         { context: { communicationMethods: { input: 'nickname' } } } );
     });
  });

    describe('#MeetingFrequency', function() {
      it('returns a Promise', function() {
        const ret = actions.addMeetingFrequency({
          context: {},
          input: '',
        });

        expect(ret).to.be.a('Promise');
      });

      it('returns the name from entity meetingfrequency', function() {
        const ret = actions.addMeetingFrequency({
          context: {},
          input: 'Kerran viikossa',
        });

        return expect(ret).to.become({ context: { meetingFrequency: 'ONCE_A_WEEK' } } );
      });


      it('preserves context', function() {
        const ret = actions.addMeetingFrequency({
            context: { 'foo': 'bar' },
            input: 'Kerran viikossa',
        });

        return expect(ret).to.eventually
        .deep.equal( { context: { 'foo': 'bar', 'meetingFrequency': 'ONCE_A_WEEK' } } );
      });
    })
});
