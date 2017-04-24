# General architecture

### Facebook messenger -> AWS -> Coaching chatbot -> AWS -> Facebook messenger

1. Facebook messenger receives a message from the user. The message is sent to AWS (API Gateway -> Lambda -> Serverless stuff).
2. Coaching chatbot receives the message and processes it.
3. Coaching chatbot calls any functions that are required to be called (save name to database, save occupation to database, see below). The database is DynamoDB.
4. Coaching chatbot sends a message back to Facebook Messenger

## High-level design diagram
<p align="center"><img src="/img/Chatbot Architecture1.png" alt="High-level design diagram"/></p>

## Low-level design diagram
<p align="center"><img src="/img/Low Level Diagram.png" alt="Low-level design diagram"/></p>

# API for Coaching chatbot #

These are the functions from our bot service.

*note: These are only guidelines for now.*

*note: messenger_id === sessionId unless it needs to be something else.*

### set_name(messenger_id, name)
```
write something here
```

### set_occupation(messenger_id, occupation)
```
write something here
```
### set_age(messenger_id, age)
```
write something here
```
### set_location(messenger_id, location)
```
write something here
```
### get_profile(messenger_id)
```
write something here
```

### set_peer_meeting_preferred_interval(messenger_id, interval)
```
write something here
```

### set_peer_meeting_preferred_contact_method(messenger_id, contact_method)
```
write something here
```

### set_peer_meeting_contact_information(messenger_id, contact_information)
```
write something here
```


## More advanced API ##

### search_for_a_peer(messenger_id)
```
write something here
```

### match_peers(messenger_id, messenger_id)
```
write something here
```

### notify_peers(messenger_id, messenger_id, details)?
```
write something here
```
