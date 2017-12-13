# Testing

The mocha-webpack plugin module is included in the project. You can invoke tests locally with these commands.

### Unit tests:
- `$ npm run test` (runs unit tests)

- `$ npm run test:watch` (continually running, if UT files are changed it reruns the unit tests)  

### Feature tests:
- `$ npm run ft` (runs feature tests)

- `$ npm run ft:watch` (continually running, if FT files are changed it reruns the feature tests)


### Visualizer:
- `$ npm run visualize` (Runs visualizer)
  - The user input is defined in discussions.json
  - After visualizer has run the conversation between a user and a bot can be found in doc/flow/discussions.md
  - After changes to texts or the logic of the app the visualizer is a handy tool to show if something has changed and thus the output of this command should always be checked after changes
  
  
### Demonizer:
- `$ npm run demonize` (Runs visualizer)
  - The user input is defined in discussions.json
  - After demonizer has run open doc/flow/demo.html
  - The HTML page displays the conversation as an animation
