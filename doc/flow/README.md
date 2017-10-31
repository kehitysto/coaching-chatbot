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
        ...
    }
}
```