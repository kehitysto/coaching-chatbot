import * as sinon from 'sinon';

import * as actions from '../../../src/coaching-chatbot/actions.js';
import * as Sessions from '../../../src/util/sessions-service';
import * as Pairs from '../../../src/util/pairs-service';
import * as Feedback from '../../../src/util/feedback-service';

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

  describe('#setRealName', function() {
    it('returns the real name', function() {
      const ret = actions.setRealName({
        context: {},
      });
      expect(ret).to.become({
        context: {
          name:'Matti Luukkainen'
        }
      })
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
        context: {  },
        input: 'Matti Luukkainen',
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
        input: 'Matti Luukkainen',
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

    it('Should return everything', function() {
      const ret = actions.updateProfile({
        context: {
          'name': 'Matti',
          'bio': 'Kokenut koodari'
        },
        userData: {},
      });

      return expect(ret)
        .to.eventually.deep.equal({
          userData: {
            profile: 'Matti, Kokenut koodari',
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
          context: {
            communicationMethods: {},
          },
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

    it('Should fail if there is no undefined communication info', function() {
      const ret = actions.addCommunicationInfo({
        context: {
          communicationMethods: {
            'Skype': 'skype_acc',
          },
        },
        input: 'nickname',
      });

      return expect(ret).be.rejected;
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
            searching: false,
          },
        });
    });
  });

  describe('#resetRequestsAndSearching', function() {
    it('should reset all requests, available and rejected peers and searching', function() {
      const ret = actions.resetRequestsAndSearching({
        context: {
          rejectedPeers: ['123'],
          availablePeers: ['321'],
          pairRequests: ['322'],
          sentRequests: ['123', '523'],
          searching: true,
        },
      });

      return expect(ret)
        .to.eventually
        .deep.equal({
          context: {
            rejectedPeers: [],
            availablePeers: [],
            pairRequests: [],
            sentRequests: [],
            searching: false,
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
          name: "test",
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
        name: "test",
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

      const ret = actions.getAvailablePeers({
        sessionId: TEST_SESSION,
        context: {},
      });

      return expect(ret).to.become({
        context: { availablePeers: ['TEST1', 'TEST2'], availablePeersIndex: 1 },
      }).then(() => stubGetAvailablePairs.restore());
    });
  });

  describe('#nextAvailablePeer', function() {
    it('moves the current peer to the end of nextAvailablePeer array', function() {
      const ret = actions.nextAvailablePeer({
        context: { availablePeers: ['TEST1', 'TEST2'], availablePeersIndex: 1 },
      });

      return expect(ret).to.become({
        context: { availablePeers: ['TEST1', 'TEST2'], availablePeersIndex: 2 },
      });
    });
  });

  describe('#rejectAvailablePeer', function() {
    it('adds the current peer to the rejectedPeers array', function() {
      const ret = actions.rejectAvailablePeer({
        context: {
          rejectedPeers: ['TEST1'],
          availablePeers: ['TEST2'],
          availablePeersIndex: 1,
        },
      });

      return expect(ret).to.become({
        context: {
          rejectedPeers: ['TEST1', 'TEST2'],
          availablePeers: ['TEST2'],
          availablePeersIndex: 1,
        },
      });
    });

    it('creates the rejectedPeers array if it does not exist', function() {
      const ret = actions.rejectAvailablePeer({
        context: {
          availablePeers: ['TEST2'],
          availablePeersIndex: 1
        },
      });

      return expect(ret).to.become({
        context: {
          rejectedPeers: ['TEST2'],
          availablePeers: ['TEST2'],
          availablePeersIndex: 1
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
                'Antti\n -  Puhelin (044123123)',
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
        pairRequests: [1],
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
          sentRequests: [],
          hasPair: true,
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
      const stubSessionsRead = sinon.stub(sessions.db, 'read');

      stubSessionsRead.returns(
        Promise.resolve({
          name: 'Pertti',
          communicationMethods: {
            SKYPE: 'pertti_42',
          },
          sentRequestMessages: { '1': 'Message' }
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
        sessionId: '1'
      });

      return expect(ret)
        .to.become(expected)
        .then(() => stubSessionsRead.restore());
    });

    it('should handle exceptions properly', function() {
      return expect(actions.displayRequest({ sessionId: -1 }))
        .to.eventually.be.rejected;
    });
  });

  describe('#displayRequestMessage', function() {
    it('should display the sent message of the requesting user', function() {
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
          sentRequestMessages: { '1': 'Message' }
        })
      );

      const context = {
        pairRequests: [
          1,
          2,
        ],
      };

      const expected = {
        result: 'Message',
      };

      const ret = actions.displayRequestMessage({
        context,
        sessionId: '1'
      });

      return expect(ret)
        .to.become(expected)
        .then(() => stubSessionsRead.restore());
    });

    it('should handle exceptions properly', function() {
      return expect(actions.displayRequestMessage({ sessionId: -1 }))
        .to.eventually.be.rejected;
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

    it('should save reset context to disk', function() {
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
      };

      stubSessionsRead.returns(Promise.resolve({
        ...profile,
        weekDay: 'MA',
        time: '12:22',
      }));

      const ret = actions.breakPair({
        sessionId: 0,
        context: { ...profile, weekDay: 'MA', time: '12:22', },
      });

      return ret.then((result) => {
        stubSessionsRead.restore();
        sessions.read(0).then((context) => {
          return expect(context).to.deep.equal(profile);
        });
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
          state: '/?0/profile?0/ok?0',
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
        expect(result.result).to.equal('@PEER_NO_LONGER_AVAILABLE_GENERIC');
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
        state: '/?0',
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

  describe('#sendRating', () => {
    it('should result in empty string', () => {
      const stubPairsRead = sinon.stub(
        new Pairs().db, 'read'
      ).returns(Promise.resolve([1]));

      const ret = actions.sendRating({ context: {}, sessionId: 1 });

      return ret.then((result) => {
        expect(result.result).to.equal('');
      }).then(() => stubPairsRead.restore())
    });

    it('should fail if there is no pairId', () => {
      const stubPairsRead = sinon.stub(
        new Pairs().db, 'read'
      ).returns(Promise.resolve([]));

      const ret = actions.sendRating({ context: {}, sessionId: 1 });

      return expect(ret).be.rejected
        .then(() => stubPairsRead.restore())
    });
  });

  describe('#sendFeedback', () => {
    it('should write feedback to database', () => {
      const stubPairsRead = sinon.stub(
        new Pairs().db, 'read'
      ).returns(Promise.resolve([1]));

      const spyFeedback = sinon.spy(
        new Feedback().db, 'write'
      );

      const ret = actions.sendFeedback({
        context: {}, sessionId: 1, input: ' ',
      });

      return ret.then(() => {
        expect(spyFeedback).calledOnce;
      }).then(() => {
        stubPairsRead.restore();
        spyFeedback.restore();
      });
    });

    it('should fail if there is no pairId', () => {
      const stubPairsRead = sinon.stub(
        new Pairs().db, 'read'
      ).returns(Promise.resolve([]));

      const ret = actions.sendFeedback({
        context: {}, sessionId: 1, input: ' ',
      });

      return expect(ret).be.rejected
        .then(() => stubPairsRead.restore())
    });
  });

  describe('#setDay', () => {
    it('should return context with day', () => {
      const ret = actions.setWeekday({
        context: {}, input: 'mAanantai',
      });

      const expected = {
        context: {
          weekDay: 'MA',
        }
      };

      return expect(ret).to.eventually
        .deep.equal(expected);
    });
  });

  describe('#setTime', () => {
    it('should return context with time', () => {
      const ret = actions.setTime({
        context: {}, input: '10:23',
      });

      const expected = {
        context: {
          remindersEnabled: true,
          time: '10:23',
        }
      }

      return expect(ret).to.eventually
        .deep.equal(expected);
    });
  });

  describe('#resetMeetingAndHasPair', () => {
    it('should remove day, time and hasPair from context', () => {
      const ret = actions.resetMeetingAndHasPair({
        context: {
          asd: 3,
          weekDay: 'TI',
          as: 5,
          time: '10:23',
          hasPair: true,
        }
      });

      const expected = {
        asd: 3,
        as: 5,
      }

      return expect(ret).to.eventually
        .deep.equal(expected);
    });
  });
});
