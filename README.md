<p align="center"><img src="/img/logo_small.png" alt="Coaching Chatbot"/></p>

<p align="center">
master:
<a href="https://travis-ci.org/kehitysto/coaching-chatbot"><img src="https://travis-ci.org/kehitysto/coaching-chatbot.svg?branch=master"></a>
<a href="https://coveralls.io/github/kehitysto/coaching-chatbot?branch=master"><img src="https://coveralls.io/repos/github/kehitysto/coaching-chatbot/badge.svg?branch=master"></a>
dev:
<a href="https://travis-ci.org/kehitysto/coaching-chatbot"><img src="https://travis-ci.org/kehitysto/coaching-chatbot.svg?branch=dev"></a>
<a href="https://coveralls.io/github/kehitysto/coaching-chatbot?branch=dev"><img src="https://coveralls.io/repos/github/kehitysto/coaching-chatbot/badge.svg?branch=dev"></a>
</p>
<p align="center">
waffle:
<a href="https://waffle.io/kehitysto/coaching-chatbot"><img src="https://badge.waffle.io/kehitysto/coaching-chatbot.svg?label=ready&title=Ready"></a>
</p>

## Description

Coaching Chatbot is a highly personalized bot for finding peers to match your needs.

The bot provides you a unique opportunity to engage in a peer-to-peer life coaching experience with a real person at the other end.

Utilizing cutting edge language processing capabilities, our bot allows you to take control of your personal development process, and maximize your enjoyment of life.

## Features

- Easy chatting through Facebook Messenger
- Innovative quick replies
- Automatic peer finding

## How To Use

Locally:

- Download and install Node.js, then:

```
$ git clone https://github.com/kehitysto/coaching-chatbot
$ cd coaching-chatbot
$ npm i
$ npm run bot-client
```

To test multiple users use different session IDs

```
$ npm run bot-client -- --session=<ID>
```

Manual testing can also be done with the following command. See readme in doc/flow for more information.

```
$ npm run visualize
```

Supported Node version 6.1.0

## Documentation
 - [Architecture](doc/architecture.md)
 - [Deploy instructions](doc/deploy-instructions.md)
 - [Testing instructions](doc/testing-instructions.md)
 - [Chatbot framework API](doc/apidoc/README.md)

## Links
 - [Definition of Done](doc/dod.md)
 - [Time Tracking and Product Backlog](https://docs.google.com/spreadsheets/d/1fKdP8b8bfaRfgDoVSWLBhEqba9kjgCiv7lt_gYjxqZI/)
 - [Drive folder - Project documents](https://drive.google.com/drive/folders/0B8ebXy63LRc8NUxmQ3ZDNzRLZms?ths=true)
 - [Demo](https://storage.googleapis.com/ohtu-demo/demo.html)
