## Coaching chatbot Installation
 - Prerequisites:
    * npm and node must be installed
      * npm is installed with node so you can get both here: https://nodejs.org/en/download/package-manager/
    * Set up AWS, instructions could be found: https://serverless.com/framework/docs/providers/aws/guide/credentials/
```
$ npm install -g serverless
$ git clone https://github.com/kehitysto/coaching-chatbot.git
$ npm install
```
Rename .env.example to .env and fill in `FACEBOOK_BOT_VERIFY_TOKEN`. The verify token can be anything you choose. You will need it later.

```
$ serverless deploy
```
Copy the GET endpoint url

## Facebook App Configuration



1. In Facebook Developer site create new Facebook application and page
  * Create Facebook application -> https://developers.facebook.com/quickstarts/?platform=web
  * Create Facebook page -> https://www.facebook.com/pages/create (if the page already exists, use it when we refer to the page created in step 1)
2. Go to the App Dashboard. Select under Products "+Add Product" and choose Messenger.  Next setup webhook by clicking `Setup Webhooks`
  * Callback URL -> use endpoint url copied in Coaching chatbot Installation
  * Verify Token -> use FACEBOOK_BOT_VERIFY_TOKEN filled in Coaching chatbot Installation
  * Select Subscription field `messages`
  * At this stage, the application is available only for developers and testers. The application needs to be approved by Facebook for public access
  * Click `Verify and Save`
4. In the Token Generation section, select the page created in step 1 and copy the generated token
5. In Webhooks section, select page created in step 1(Facebook App Configuration) to be the one that subscribes the webhooks
6. Paste token copied in step 4 to .env file as `FACEBOOK_BOT_PAGE_ACCESS_TOKEN`
```
$ serverless deploy
```
More detailed instructions for Facebook Messenger platform configuration can be found from https://developers.facebook.com/docs/messenger-platform/quickstart/



## Getting Facebook approvals

To make your application acceptable to other user your app should be approved by facebook  

- Prerequisites:
  * Your app must have App Icon (1024 x 1024) set.
  * Your app must have Privacy Policy URL set.
1. You can set them by going to the application in facebook developers, Setting -> Basic


Instructions of approvals:
1. Go to the application in facebook developers
2. Choose `Messenger` under `Products`
3. Scroll down to `App Review for Messenger`
4. For the app to work properly, you should have `pages_messaging` `pages_messaging_subscription` approved, to do so press `Add to Submission`
5. Scroll to `Current Submissions` and press `Edit Notes`.
    * `pages_messaging`
      * Example:
    <p align="center"><img src="/img/page-messaging.png" alt="Pages messaging"/></p>
    
    * `pages_messaging_subscription`  
        <p align="center"><img src="/img/pages-messaging-subscription.png" alt="Pages messaging"/></p>
        * Add description:
        "Our application will use pages_messaging_subscriptions to notify the user that some other users want to became their pair. The user can quite pair searching at any point if he/she doesn't want to get notification anymore.  Permission is needed because the pair could be found after 24 hours after subscribing and it's possible that during this time few users want to send a request to the user."
        <span style="color : yellow">  Feel free to change the description </span></br></br>
        * Upload a Screencast showing one path of the possible conversations with the bot. This example should show what kind of messages the bot sends to users without the user initiating the conversation.
6. Press `Submit for Review`



## Deploying multiple versions

To deploy multiple versions of the chatbot you have to define a name for serverless deploy:

```
$ serverless deploy <name here>
```

After this you can follow the instructions from the top of this page onwards. You can see the different versions you have deployed in your aws lambda dashboard and also delete/modify them there. One good use for this is for example having a staging environment and a production environment.
