## Coaching chatbot Installation
 - Prerequisites:
    * npm and node must be installed
    * Set up AWS, instructions could be found: https://serverless.com/framework/docs/providers/aws/guide/credentials/
```
$ npm install -g serverless
$ git clone https://github.com/kehitysto/coaching-chatbot.git
$ npm install
```
Rename .env.example to .env and fill in `FACEBOOK_BOT_VERIFY_TOKEN`

```
$ serverless deploy
```
Copy the GET endpoint url

## Facebook App Configuration



1. In Facebook Developer site create new Facebook application and page
  * Create Facebook application -> https://developers.facebook.com/quickstarts/?platform=web
  * Create Facebook page -> https://www.facebook.com/pages/create (if the page already exists, use it when we refer to the page created in step 1)
2. Go to the App Dashboard. Select under Products "+Add Product" and choose Messenger.  Next setup webhook by clicking `Setup Webhooks`
  * Callback URL -> use endpoint url coppied in Coaching chatbot Installation
  * Verify Token -> use FACEBOOK_BOT_VERIFY_TOKEN filled in Coaching chatbot Installation
  * Select Subscription field `messages`
  * At this stage, the application is available only for developers and testers. The application needs to be approved by Facebook for public access
  * Click `Verify and Save`
4. In the Token Generation section, select the page created in step 1 and copy the generated token
5. In Webhooks section, select page created in step 1(Facebook App Configuration) to be the one that subscribes the webhooks
6. Paste token copied in step 4 to .env file as `FACEBOOK_BOT_PAGE_ACCESS_TOKEN`
 choise the web
More detailed instructions for Facebook Messenger platform configuration can be found from https://developers.facebook.com/docs/messenger-platform/quickstart/

```
$ serverless deploy
```

## Getting Facebook approvals

To make your application acceptable to other user your app should be approved by facebook  
  
Instructions of approvals:
1. Go to the application in facebook developers
2. Choose `Messenger` under `Products`
3. Scroll down to `App Review for Messenger`
4. For the app to work properly, you should have `pages_messaging` `pages_messaging_subscription` approved, to do so press `Add to Submission`
5. Scroll to `Current Submissions` and press `Edit Notes`.
    * `pages_messaging`
    * `pages_messaging_subscription`  
    <span style="color : red">
      IMPORTANT!!   at the point "Please select the use case your bot matches". Select "News". </span>
