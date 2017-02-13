## Coaching chatbot Installation

1. Run `serverless install --url https://github.com/kehitysto/coaching-chatbot`
2. Run `npm install`
3. Rename example.env to .env and fill in `FACEBOOK_BOT_VERIFY_TOKEN`
4. Run `serverless deploy` then copy the GET endpoint url

## Facebook App Configuration

5. In Facebook Developer site create new Facebook application and page
  * Create Facebook application -> https://developers.facebook.com/quickstarts/?platform=web
  * Create Facebook page -> https://www.facebook.com/pages/create (if the page already exists, just use it instead when we refer to step 5 page)
6. Go to the App Dashboard and under Product Settings and setup webhook by clicking `Setup Webhooks`
  * Callback URL -> url from step 4 
  * Verify Token -> from step 3 
  * Select Subscription field `messages` 
  * At this stage, the application is available only for developers and testers. The application needs to be approved by Facebook for public access
7. Click `Verify and Save`
8. In the Token Generation section, select the page created in step 5 and copy the generated token
9. In Webhooks section, select page created in step 5 to be the one that subscribes the webhooks
10. Paste token copied in step 8 to .env file as `FACEBOOK_BOT_PAGE_ACCESS_TOKEN`

More detailed instructions for Facebook Messenger platform configuration can be found from https://developers.facebook.com/docs/messenger-platform/quickstart/

- Run `serverless deploy`
