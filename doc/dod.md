# Definition of Done

## Code is clean
 - lint: no warnings
 - code must have passed the review process
    - everyone on the team must have OK'd the code (done during review of PR's before merge to dev branch)


## Code must be deployed to staging (and functional (demoable))


## Application works as customer has requested
 - fulfills user story (& acceptance criteria)


## Tests have good quality and are runnable
 - unit test:
   - test code coverage >= 75% (in lines)
   - all tests must pass
   - tests should be automatically executed as part of CI test suite
 - feature test:
   - minimum: user story (automated)
   - all tests must pass
   - tests should be automatically executed as part of CI test suite
 - exploratory testing:
   - the feature **must** be manually tested by someone on the team who did not develop the feature
   

## Documentation is 5/5
 - code
    - clear function and variable names
    - readable code
    - according to code conventions
 - deployment
   - any changes to deployment process should be documented
