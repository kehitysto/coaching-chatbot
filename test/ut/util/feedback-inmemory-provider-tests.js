import * as sinon from 'sinon';

import * as Feedback from '../../../src/util/feedback-inmemory-provider';

describe('Inmemory database service', function() {
    before(function() {
        this.feedback = new Feedback();
    });

    describe('#load()', function() {
        it('should load provided data to the database', function() {
            const expected = {
                data: 'data',
            };

            this.feedback.load(expected);

            return expect(this.feedback.db)
                .to.deep.equal(expected);
        });
    });

    describe('#dump()', function() {
        it('should dump data from the database', function() {
            const expected = {
                data: 'data',
            };

            this.feedback.load(expected);

            return expect(this.feedback.dump())
                .to.deep.equal(expected);
        });
    });

    describe('#write()', function() {
        before(function() {
            this.feedback.load([]);
        });

        it('should store data into the database', function() {
            const expected = [{
                date: 2323,
                giver: 'asd',
                pair: 23,
                feedback: 'test',
            }, {
                date: 2323,
                giver: 2,
                pair: 3,
                feedback: 'feedback',
            },];

            this.feedback.write(expected[0]);
            this.feedback.write(expected[1]);

            return expect(this.feedback.dump())
                .to.deep.equal(expected);
        });

        it('should reject with an error when the given row does not include required fields', function() {
            return expect(this.feedback.write({ date: 1, giver: 'hack', pair: 2 }))
                .to.eventually.be.rejectedWith('Missing feedback parameters!');
        });
    });
});
