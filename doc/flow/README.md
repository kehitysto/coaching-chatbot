# Generating discussion flowchart

Use the following command to get predefined discussions in a markdown file:

`npm run visualize`

# Modifying discussions

Discussions are located in `discussions.json` which has the following syntax:

```json
{
    "Unique scenario description": {
        "player": "Name used in the table head",
        "session": "Session id used for the discussion",
        "messages": [
            "array",
            "of",
            "messages",
            "for",
            "input"
        ]
    },
    "Another unique scenario description": {
        "...": "Fill as above"
    },
    "Unique description of hidden discussion": {
        "session": "An arbitrary session id",
        "hide": true,
        "time": 1510647770885,
        "messages": [
            "test"
        ]
    },
    "Description of a player getting proactive messages": {
        "player": "Name",
        "session": "Session id used for the discussion",
        "messages": [
            "before this there could be received messages"
        ]
    }
}
```
# Automatic validation

Below the visualized discussions in `discussions.md` there's an automatically generated javascript file for testing.
