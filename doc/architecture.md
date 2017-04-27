# General architecture

### Facebook messenger -> AWS -> Coaching chatbot -> AWS -> Facebook messenger

1. Facebook messenger receives a message from the user. The message is sent to AWS (API Gateway -> Lambda -> Serverless stuff).
2. Coaching chatbot receives the message and processes it.
3. Coaching chatbot calls any functions that are required to be called (save name to database, save occupation to database, see below). The database is DynamoDB.
4. Coaching chatbot sends a message back to Facebook Messenger

## High-level design diagram
<p align="center"><img src="/img/Chatbot Architecture1.png" alt="High-level design diagram"/></p>

## Low-level design diagram
<p align="center"><img src="/img/Low Level Diagram3.png" alt="Low-level design diagram"/></p>
