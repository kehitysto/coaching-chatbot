import fs from 'fs';
import sinon from 'sinon';


const mod = require('inject!../../../src/facebook-messenger/messenger.service');


describe('Facebook Messenger service', function() {
    before(function() {
        process.env.FACEBOOK_PAGE_ACCESS_TOKEN = 'DUMMY_ACCESS_TOKEN';
    });

    beforeEach(function() {
        this.request = sinon.stub().returns(Promise.resolve());

        this.Messenger = mod({
            'request-promise': this.request
        });
    });

    describe('#send()', function() {
        it('should return a Promise', function() {
            const ret = this.Messenger.send('USER_ID', 'Message...');

            expect(ret).to.be.a('Promise');

            return expect(ret).to.eventually.be.fulfilled;
        });

        it('should send messages to facebook', function() {
            const ret = this.Messenger.send('USER_ID', 'Message...');

            return expect(ret).to.eventually.be.fulfilled.then(() => {
                return expect(this.request).to.have.been.calledWith(
                    sinon.match({
                        url: sinon.match(/https:\/\/graph\.facebook\.com\/.*\/me\/messages/),
                        qs: { access_token: 'DUMMY_ACCESS_TOKEN' },
                        method: 'POST',
                        json: sinon.match({
                            recipient: { id: 'USER_ID' },
                            message: { text: "Message..." }
                        })
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

            this.cb = { receive: sinon.stub() };
        });

        afterEach(function() {
            this.cb.receive.reset();
        });

        it('should return a Promise', function() {
            const ret = this.Messenger.receive(this.data.body, this.cb);

            expect(ret).to.be.a('Promise');

            return expect(ret).to.eventually.be.fulfilled;
        });

        it('should call callback with the message sender and body', function() {
            const ret = this.Messenger.receive(this.data.body, this.cb);

            return expect(ret).to.eventually.be.fulfilled.then(() => {
                return expect(this.cb.receive).to.have.been.calledWith(
                    'USER_ID', "hello, world!"
                );
            });
        });
    });
});
