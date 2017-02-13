## Start
 - Prerequisites: npm must be installed
 - Install *serverless* (preferably as global) and dependencies:

    ```
    $ npm install -g serverless
    $ npm install
    ```

## Coaching chatbot Installation

1. Run `serverless install --url https://github.com/kehitysto/coaching-chatbot`
2. Run `npm install`
3. Rename example.env to .env and fill in `FACEBOOK_BOT_VERIFY_TOKEN`
4. Run `serverless deploy` then copy the GET endpoint url

## Facebook App Configuration

1. In Facebook Developer site create new Facebook application and page
  * Create Facebook application -> https://developers.facebook.com/quickstarts/?platform=web
  * Create Facebook page -> https://www.facebook.com/pages/create (if the page already exists, use it when we refer to the page created in step 1)
2. Go to the App Dashboard and under Product Settings and setup webhook by clicking `Setup Webhooks`
  * Callback URL -> url from step 4 in Coaching chatbot Installation
  * Verify Token -> from step 3 in Coaching chatbot Installation
  * Select Subscription field `messages` 
  * At this stage, the application is available only for developers and testers. The application needs to be approved by Facebook for public access
3. Click `Verify and Save`
4. In the Token Generation section, select the page created in step 1(Facebook App Configuration) and copy the generated token
5. In Webhooks section, select page created in step 1(Facebook App Configuration) to be the one that subscribes the webhooks
6. Paste token copied in step 4(Facebook App Configuration) to .env file as `FACEBOOK_BOT_PAGE_ACCESS_TOKEN`

More detailed instructions for Facebook Messenger platform configuration can be found from https://developers.facebook.com/docs/messenger-platform/quickstart/

- Run `serverless deploy`
