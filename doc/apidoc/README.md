# Chatbot Framework API

## Builder
Class for defining the dialog structure.

[API documentation](builder.md)

## Session
Maintains the current state of the chatbot during execution, and provides
the API for controlling the chatbot from dialog functions.

[API documentation](session.md)

## Chatbot-Service
Wrapper providing the full chatbot execution flow as an
AWS API gateway handler.

Reads the chatbot state from DynamoDB, executes the dialog provided from
Builder, and writes the resulting state to disk.

[API documentation](chatbot-service.md)
