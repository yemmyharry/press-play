## Recent Changes to this branch
- add post and get routes for podcast endpoint
- add a handleUploads middleware
- Remove author route
- Edited all responses in user controller to use standard response object with **status**, **message** and **data** properties
- use lodash to filter and return only firstname, lastname and email user data after account is activated
- correct the user model and add ``bio`` property and add validation
- correct user model to include ``isAuthor`` property by default
- correct the **activate-account** route to collect token from the query not the body 
- set up cloudinary config file in config folder
- add a few more comments to explain app file better
- call joi object id validation in the app file so the entire app can acccess it
- add joi Object validation file in config folder (for current lack of a better place to put it)
- Update the endpoint naming convention to use **/api/\[endpoint\]** instead of just **/\[endpoint\]**   
Example **/users** becomes **/api/users**
- Update the route file and endpoint names to plural eg: **user** to **users**
- Make a podcasts route