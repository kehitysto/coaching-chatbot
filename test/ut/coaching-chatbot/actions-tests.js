import * as sinon from 'sinon';

import * as actions from '../../../src/coaching-chatbot/actions.js';
import * as Sessions from '../../../src/util/sessions-service';
import * as Pairs from '../../../src/util/pairs-service';

const TEST_SESSION = 'SESSION';

describe('coaching-bot actions', function() {
  describe('#setRating', function() {
    it('returns the rating from entity rating', function() {
      const ret = actions.setRating({
        context: {},
        input: '2',
      });

      return expect(ret).to.become({
        context: {
          rating: 2,
        },
      });
    });

    it('preserves the context', function() {
      const ret = actions.setRating({
        context: {
          name: 'Matti Luukkainen',
        },
        input: '2',
      });

      return expect(ret).to.become({
        context: {
          name: 'Matti Luukkainen',
          rating: 2,
        },
      });
    });
  });

  describe('#setJob', function() {
    it('returns a Promise', function() {
      const ret = actions.setJob({
        context: {},
        input: '',
      });

      expect(ret)
        .to.be.a('Promise');
    });

    it('returns the job from entity job', function() {
      const ret = actions.setJob({
        context: {},
        input: 'taksikuski',
      });

      return expect(ret)
        .to.eventually
        .deep.equal({
          context: {
            job: 'taksikuski',
          },
        });
    });

    it('preserves context', function() {
      const ret = actions.setJob({
        context: {
          'foo': 'bar',
        },
        input: 'maalari',
      });

      return expect(ret)
        .to.eventually
        .deep.equal({
          context: {
            'foo': 'bar',
            'job': 'maalari',
          },
        });
    });
  });

  describe('#setAge', function() {
    it('returns a Promise', function() {
      const ret = actions.setAge({
        context: {},
        input: '',
      });

      return expect(ret)
        .to.be.a('Promise');
    });

    it('returns the age from entity age', function() {
      const ret = actions.setAge({
        context: {},
        input: '66',
      });

      return expect(ret)
        .to.become({
          context: {
            age: '66',
          },
        });
    });

    it('preserves context', function() {
      const ret = actions.setAge({
        context: {
          'foo': 'bar',
        },
        input: '43',
      });

      return expect(ret)
        .to.eventually
        .deep.equal({
          context: {
            'foo': 'bar',
            'age': '43',
          },
        });
    });
  });

  describe('#setName', function() {
    it('returns a Promise', function() {
      const ret = actions.setName({
        context: {},
        input: '',
      });

      expect(ret)
        .to.be.a('Promise');
    });

    it('returns the name from entity name', function() {
      const ret = actions.setName({
        context: {},
      });

      return expect(ret)
        .to.become({
          context: {
            name: 'Matti Luukkainen',
          },
        });
    });

    it('preserves context', function() {
      const ret = actions.setName({
        context: {
          'foo': 'bar',
        },
      });

      return expect(ret)
        .to.eventually
        .deep.equal({
          context: {
            'foo': 'bar',
            'name': 'Matti Luukkainen',
          },
        });
    });
  });

  describe('#setPlace', function() {
    it('returns a Promise', function() {
      const ret = actions.setPlace({
        context: {},
        input: '',
      });

      expect(ret)
        .to.be.a('Promise');
    });

    it('returns the name from entity place', function() {
      const ret = actions.setPlace({
        context: {},
        input: 'Helsinki',
      });

      return expect(ret)
        .to.become({
          context: {
            place: 'Helsinki',
          },
        });
    });

    it('returns the name from entity place', function() {
      const ret = actions.setPlace({
        context: {},
        input: 'Amsterdam',
      });

      return expect(ret)
        .to.become({
          context: {
            place: 'Amsterdam',
          },
        });
    });

    it('preserves context', function() {
      const ret = actions.setPlace({
        context: {
          'foo': 'bar',
        },
        input: 'Turku',
      });

      return expect(ret)
        .to.eventually
        .deep.equal({
          context: {
            'foo': 'bar',
            'place': 'Turku',
          },
        });
    });
  });

  describe('#setBio', function() {
    it('returns a Promise', function() {
      const ret = actions.setBio({
        context: {},
        input: '',
      });

      expect(ret)
      .to.be.a('Promise');
    });

    it('returns the bio from user', function() {
      const ret = actions.setBio({
        context: {},
        input: 'My name is X and I\'m a human',
      });

      return expect(ret)
        .to.become({
          context: {
            bio: 'My name is X and I\'m a human',
          },
        });
    });

    it('preserves context', function() {
      const ret = actions.setBio({
        context: {
          'foo': 'bar',
        },
        input: 'Long bio string',
      });

      return expect(ret)
        .to.eventually
        .deep.equal({
          context: {
            'foo': 'bar',
            'bio': 'Long bio string',
          },
        });
    });
  });

  describe('#updateProfile', function() {
    it('Should return a Promise', function() {
      const ret = actions.updateProfile({
        context: {},
        input: '',
      });

      expect(ret)
        .to.be.a('Promise');
    });

    it('Should return without age', function() {
      const ret = actions.updateProfile({
        context: {
          'name': 'Matti',
          'job': 'Opiskelija',
          'place': 'Helsinki',
        },
        userData: '',
      });

      return expect(ret)
        .to.eventually.deep.equal({
          userData: {
            profile: 'Matti, Opiskelija, Helsinki',
          },
        });
    });

    it('Should return without place', function() {
      const ret = actions.updateProfile({
        context: {
          'name': 'Matti',
          'job': 'Opiskelija',
          'age': '23',
        },
        userData: '',
      });

      return expect(ret)
        .to.eventually.deep.equal({
          userData: {
            profile: 'Matti, Opiskelija, 23',
          },
        });
    });

    it('Should return without age and place', function() {
      const ret = actions.updateProfile({
        context: {
          'name': 'Matti',
          'job': 'Opiskelija',
        },
        userData: '',
      });

      return expect(ret)
        .to.eventually.deep.equal({
          userData: {
            profile: 'Matti, Opiskelija',
          },
        });
    });

    it('Should return everything', function() {
      const ret = actions.updateProfile({
        context: {
          'name': 'Matti',
          'job': 'Opiskelija',
          'age': '23',
          'place': 'Helsinki',
        },
        userData: '',
      });

      return expect(ret)
        .to.eventually.deep.equal({
          userData: {
            profile: 'Matti, Opiskelija, 23, Helsinki',
          },
        });
    });
  });

  describe('#reset', function() {
    it('returns a Promise', function() {
      const ret = actions.reset({
        context: {},
        input: '',
      });

      expect(ret)
        .to.be.a('Promise');
    });

    it('returns empty context', function() {
      const ret = actions.reset({
        context: {},
        input: '',
      });

      return expect(ret)
        .to.eventually.deep.equal({
          context: {},
        });
    });
  });

  describe('#addCommunicationMethod', function() {
    it(
      'Should return a communication methods with undefined Communication Info',
      function() {
        const ret = actions.addCommunicationMethod({
          context: {},
          input: 'Skype',
        });

        return expect(ret)
          .to.eventually.deep.equal({
            context: {
              communicationMethods: {
                'SKYPE': 'UNDEFINED_COMMUNICATION_INFO',
              },
            },
            result: '@REQUEST_SKYPE_NAME',
          });
      });

    it(
      'Should return a communication method with undefined communication info when there are already other communication methods',
      function() {
        const ret = actions.addCommunicationMethod({
          context: {
            communicationMethods: {
              'SKYPE': 'nickname',
            },
          },
          input: 'Puhelin',
        });

        return expect(ret)
          .to.eventually.deep.equal({
            context: {
              communicationMethods: {
                'SKYPE': 'nickname',
                'PHONE': 'UNDEFINED_COMMUNICATION_INFO',
              },
            },
            result: '@REQUEST_PHONE_NUMBER',
          });
      });
  });

  describe('#addCommunicationInfo', function() {
    it('Should return a communication methods', function() {
      const ret = actions.addCommunicationInfo({
        context: {
          communicationMethods: {
            'Skype': 'UNDEFINED_COMMUNICATION_INFO',
          },
        },
        input: 'nickname',
      });

      return expect(ret)
        .to.eventually.deep.equal({
          context: {
            communicationMethods: {
              'Skype': 'nickname',
            },
          },
        });
    });

    it(
      'Should return input if there is no undefined communication methods',
      function() {
        const ret = actions.addCommunicationInfo({
          context: {},
          input: 'nickname',
        });

        return expect(ret)
          .to.eventually.deep.equal({
            context: {
              communicationMethods: {
                input: 'nickname',
              },
            },
          });
      });
  });

  describe('#markUserAsSearching', function() {
    it('returns a Promise', function() {
      const ret = actions.markUserAsSearching({
        context: {},
        input: '',
      });

      expect(ret)
        .to.be.a('Promise');
    });

    it('Should return searching value as true', function() {
      const ret = actions.markUserAsSearching({
        context: {},
      });
      return expect(ret)
        .to.eventually
        .deep.equal({
          context: {
            searching: true,
          },
        });
    });
  });

  describe('#markUserAsNotSearching', function() {
    it('should set searching to false in context', function() {
      const ret = actions.markUserAsNotSearching({
        context: {
          searching: true,
        },
      });

      return expect(ret)
        .to.eventually
        .deep.equal({
          context: {
            availablePeers: [],
            rejectedPeers: [],
            pairRequests: [],
            searching: false,
            sentRequests: []
          },
        });
    });
  });

  describe('#removeSentRequests', function() {
    it('should remove contexts peerRequests from the recipients', function() {
      const sessions = new Sessions();
      
      const stubSessionsRead = sinon.stub(
        sessions.db,
        'read'
      );

      const spySessionsWrite = sinon.spy(
        sessions.db,
        'write'
      );
      
      stubSessionsRead.returns(
        Promise.resolve({
          pairRequests: [
            1,
            3
          ]
        })
      )

      const ret = actions.removeSentRequests({
        sessionId: 1,
        context: {
          sentRequests: [
            2
          ]
        },
      });

      const expectedToWrite = {
        pairRequests: [
          3
        ]
      };

      return ret.then((result) => {
        expect(spySessionsWrite.calledWith(2, expectedToWrite)).to.equal(true);
      }).then(() => {          
        spySessionsWrite.restore();
        stubSessionsRead.restore();
      });
    });
  });

  describe('#updateAvailablePeers', function() {
    it('adds retrieved user ids to context', function() {
      const sessions = new Sessions();
      const stubGetAvailablePairs = sinon.stub(
        sessions.db,
        'getAvailablePairs'
      );
      stubGetAvailablePairs.returns(
        Promise.resolve([
          { id: 'TEST1' },
          { id: 'TEST2' },
        ])
      );

      const ret = actions.updateAvailablePeers({
        sessionId: TEST_SESSION,
        context: {},
      });

      return expect(ret).to.become({
        context: { availablePeers: ['TEST1', 'TEST2'] },
      }).then(() => stubGetAvailablePairs.restore());
    });
  });

  describe('#nextAvailablePeer', function() {
    it('drops the current peer from availablePeers array', function() {
      const ret = actions.nextAvailablePeer({
        context: { availablePeers: ['TEST1', 'TEST2'] },
      });

      return expect(ret).to.become({
        context: { availablePeers: ['TEST2'] },
      });
    });
  });

  describe('#rejectAvailablePeer', function() {
    it('adds the current peer to the rejectedPeers array', function() {
      const ret = actions.rejectAvailablePeer({
        context: {
          rejectedPeers: ['TEST1'],
          availablePeers: ['TEST2'],
        },
      });

      return expect(ret).to.become({
        context: {
          rejectedPeers: ['TEST1', 'TEST2'],
          availablePeers: ['TEST2'],
        },
      });
    });

    it('creates the rejectedPeers array if it does not exist', function() {
      const ret = actions.rejectAvailablePeer({
        context: {
          availablePeers: ['TEST2'],
        },
      });

      return expect(ret).to.become({
        context: {
          rejectedPeers: ['TEST2'],
          availablePeers: ['TEST2'],
        },
      });
    });
  });

  describe('#displayAvailablePeer', function() {
    it('should return a pair string if a pair is found', function() {
        const sessions = new Sessions();
        const stubSessionsRead = sinon.stub(
        sessions.db,
        'read'
        );

        stubSessionsRead.returns(
        Promise.resolve({
            name: 'Pertti',
            communicationMethods: {
            SKYPE: 'pertti_42',
            },
        })
        );

        const context = {
        availablePeers: [
            1,
            2,
        ],
        };

        const expected = {
        result: 'Pertti\n  - Skype',
        };

        const ret = actions.displayAvailablePeer({
        context,
        });

        return expect(ret)
        .to.become(expected)
        .then(() => stubSessionsRead.restore());
    });
  });

  describe('#displayAcceptedPeer', function() {
    it('should return a profile string if pairs are found', function () {
        const sessions = new Sessions();
        const stubSessionsRead = sinon.stub(
          sessions.db,
          'read'
        );

        const pairs = new Pairs();
        const stubPairsRead = sinon.stub(
          pairs.db,
          'read'
        );

        const profiles = [
          {
            name: 'Pertti',
            communicationMethods: {
              SKYPE: 'pertti_42',
            },
          },
          {
            name: 'Masa',
            communicationMethods: {
              PHONE: '040566123',
            },
          },
          {
            name: 'Antti',
            communicationMethods: {
              PHONE: '044123123',
              CAFETERIA: 'Fazer',
            },
          },
        ];

        stubSessionsRead.onCall(0).returns(Promise.resolve(profiles[0]));
        stubSessionsRead.onCall(1).returns(Promise.resolve(profiles[1]));
        stubSessionsRead.onCall(2).returns(Promise.resolve(profiles[2]));

        stubPairsRead.returns(Promise.resolve([1, 2, 3]));

        const expected = {
          result: 'Pertti\n -  Skype (pertti_42)\n' +
                  'Masa\n -  Puhelin (040566123)\n' +
                  'Antti\n -  Puhelin (044123123),\n -  Kahvila (Fazer)',
        };
        
        const ret = actions.displayAcceptedPeer({
          sessionId: sessions.sessionId,
        });

        return expect(ret)
          .to.become(expected)
          .then(() => {
            stubSessionsRead.restore();
            stubPairsRead.restore();
          });
    });
  });

  describe('#rejectRequest', function() {
    it('should drop the first item from the list', function() {
        const ret = actions.rejectRequest({
        context: {
          pairRequests: [0, 1, 2],
        },
        });

        return expect(ret)
        .to.become({
            context: {
              pairRequests: [1, 2],
              rejectedPeers: [0],
            },
        });
    });
  });

  describe('#acceptRequests', function() {
    it('should write a state and mark user as not searching', function() {
        const sessions = new Sessions();

        const stubSessionsRead = sinon.stub(
          sessions.db,
          'read'
        );

        const spySessionsWrite = sinon.spy(
          sessions.db,
          'write'
        );

        const profile = {
          name: 'Pertti',
          communicationMethods: {
            SKYPE: 'pertti_42',
          },
        };

        stubSessionsRead.returns(Promise.resolve(
          profile
        ));

        const expectedFromMarkUser = {
          context: {
            availablePeers: [],
            pairRequests: [],
            rejectedPeers: [],
            searching: false,
            sentRequests: []
          }
        };

        const expectedToWrite = {
          ...profile,
          ...expectedFromMarkUser.context,
          state: '/?0/profile?0/accepted_pair_information?0',
        };

        const ret = actions.acceptRequest({
          sessionId: 0,
          context: {
            pairRequests: [1],  
          },
        });

        return ret.then((result) => {
          expect(result).to.deep.equal(expectedFromMarkUser);
        }).then(() => {          
          expect(spySessionsWrite.calledWith(1, expectedToWrite)).to.equal(true);
        }).then(() => {
          spySessionsWrite.restore();
          stubSessionsRead.restore();
        });
      });
  });

  describe('#displayRequest', function() {
    it('should display the profile of the requesting user', function() {
        const sessions = new Sessions();
        const stubSessionsRead = sinon.stub(
        sessions.db,
        'read'
        );

        stubSessionsRead.returns(
        Promise.resolve({
            name: 'Pertti',
            communicationMethods: {
            SKYPE: 'pertti_42',
            },
        })
        );

        const context = {
        pairRequests: [
            1,
            2,
        ],
        };

        const expected = {
        result: 'Pertti\n  - Skype',
        };

        const ret = actions.displayRequest({
        context,
        });

        return expect(ret)
        .to.become(expected)
        .then(() => stubSessionsRead.restore());
    });
  });
});

describe('#breakPair', function() {
  it('should reject if there is no pairId', function() {
      const pairs = new Pairs()
      const stubPairsRead = sinon.stub(
        pairs.db,
        'read'
      );

      stubPairsRead.returns(Promise.resolve(
        []
      ));

      const ret = actions.breakPair({
        sessionId: 0,
      });

      return expect(ret).be.rejected.then(() => {
        stubPairsRead.restore()
      });
  });

  it('should set pair state to profile and return pair broken', function() {
      const sessions = new Sessions();
      const stubSessionsRead = sinon.stub(
        sessions.db,
        'read'
      );

      const spySessionsWrite = sinon.spy(
        sessions.db,
        'write'
      );

      const profile = {
        name: 'Pertti',
        communicationMethods: {
          SKYPE: 'pertti_42',
        },
      };

      stubSessionsRead.returns(Promise.resolve(
        profile
      ));

      const pairs = new Pairs()
      const stubPairsRead = sinon.stub(
        pairs.db,
        'read'
      );

      stubPairsRead.returns(Promise.resolve(
        [1]
      ));

      const expectedPairBroken = {
        result: '@PAIR_BROKEN',
      };

      const expectedToWrite = {
        ...profile,
        state: '/?0/profile?0',
      };

      const ret = actions.breakPair({
        sessionId: 0,
        context: { ...profile },
      });

      return ret.then((result) => {
        expect(result).to.deep.equal(expectedPairBroken);
      }).then(() => {          
        expect(spySessionsWrite.calledWith(1, expectedToWrite)).to.equal(true);
      }).then(() => {
        stubPairsRead.restore();
        spySessionsWrite.restore();
        stubSessionsRead.restore();
      });
    });
});

describe('#breakAllPairs', function() {
  it('should read pairs and call breakPair for them', function() {
      const sessions = new Sessions();
      const pairs = new Pairs();

      const stubSessionsRead = sinon.stub(
        sessions.db,
        'read'
      );

      const stubPairsRead = sinon.stub(
        pairs.db,
        'read'
      );

      const spyPairsBreakPair = sinon.spy(
        Pairs.prototype,
        'breakPair'
      );

      const profile = {
        name: 'Pertti',
        communicationMethods: {
          SKYPE: 'pertti_42',
        },
      };

      stubSessionsRead.returns(Promise.resolve(
        profile
      ));

      stubPairsRead.returns(Promise.resolve(
        [1, 2, 3]
      ));

      const ret = actions.breakAllPairs({
        sessionId: 0,
      });

      return ret.then((result) => {
        expect(spyPairsBreakPair.args).to.deep.equal([[0, 1], [0, 2], [0, 3]]);
      }).then(() => {
        spyPairsBreakPair.restore();
        stubPairsRead.restore();
        stubSessionsRead.restore();
      });
    });
});

describe('#addPairRequest', function() {
  it('should return peer no longer available if peer is not searching', function() {
    const sessions = new Sessions();

    const stubSessionsRead = sinon.stub(
      sessions.db,
      'read'
    );

    const profile = {
      name: 'Pertti',
      communicationMethods: {
        SKYPE: 'pertti_42',
      },
      searching: false,
    };

    stubSessionsRead.returns(Promise.resolve(
      profile
    ));

    const ret = actions.addPairRequest({
      context: {
        availablePeers: [1],
      },
    })

    return ret.then((result) => {
      expect(result.result).to.equal('@PEER_NO_LONGER_AVAILABLE');
    }).then(() => {
      stubSessionsRead.restore();
    });
  });

  it('should confirm added request', function() {
    const sessions = new Sessions();

    const stubSessionsRead = sinon.stub(
      sessions.db,
      'read'
    );

    const profile = {
      name: 'Pertti',
      communicationMethods: {
        SKYPE: 'pertti_42',
      },
      searching: true,
    };

    stubSessionsRead.returns(Promise.resolve(
      profile
    ));

    const ret = actions.addPairRequest({
      context: {
        availablePeers: [1],
      },
    })

    return ret.then((result) => {
      expect(result.result).to.equal('@CONFIRM_NEW_PEER_ASK');
    }).then(() => {
      stubSessionsRead.restore();
    });
  });
});

