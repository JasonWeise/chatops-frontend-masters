
1. Setup a new Slack account and workspace for testing and dev
2. Go to https://api.slack.com/
3. Click "Your Apps" in top right corner of page
4. Create a new App (button) and select "From Scratch"
5. Give the App a sensible name and select the workspace
6. (OPTIONAL) Scroll menu) to the bottom of "Basic Information" page and add additional information in "Display Information" such as description, icon, background colour etc
7. Under "Features" (menu) --> "Slash Commands"
   1. Create a new Slash Command "Create New Command"
   2. Fill the following information </br>
   >    **Command**: (What the users will type to invoke the app) </br>
   >    **Resest URL**: (The endpoint that Slack will communicate with - e.g. the Netlify endpoint) </br>
   > >e.g. https://f3daab83--chatops-slack.netlify.live/api/slack    
   >       IMPORTANT: When using the Netfly live dev server, the URL will change slightly each time and will need to be updated here
   >     </br>
   > 
   >    Add any additional information such as info and usage hint (what the user should put after the slash command)
   
   3. Save
8. Add the App to a channel
   1. Go to "OAuth & Permissions" (Main Menu)
   2. Go to "Scopes" on the "OAuth & Permissions" page
   3. Add "chat:write" permission (OAuth Scope)
   4. Install to Workspace under "OAuth Tokens for Your Workspace" section
   > NOTE: If you get an error about no app(bot) user, go to Features->App Home and edit the information to add a username for the app
   > 
