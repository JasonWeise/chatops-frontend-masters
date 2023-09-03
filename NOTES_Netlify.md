Netlify CLI and Live dev server (alternative to NGrok)

1. Install Netflify CLI </br>
`npm install -g netflify-cli`
2. Check CLI version </br>
`ntl -v`
3. Login to Netlify CLI </br>
`ntl login` <br>
OR if you want to logout`ntl logout`
4. Get Netlify status
`ntl status`
>**NOTE**: First time run this will likely say </br>
> **Error: You don't appear to be in a folder that is linked to a site** </br>
> This means the project isn't yet initialized
5. Initialize Netflify app </br>
`ntl init`
> NOTE: Create an configure a new site </br>
> NOTE: Give it a memorable name
6. Start Netlify local dev server </br>
`ntl dev --live`
> NOTE: This will setup a live tunnel to Netlify so we can local dev whilst using a actual public URL
