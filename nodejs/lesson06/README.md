# Instructions

### Part 1 Preparing a repository for development

- Watch this Video Tutorial on how to use GitHub + GitHub Desktop: GitHub Desktop Tutorial - How to install and create a new repository in GitHub using GitHub Desktop: https://www.youtube.com/watch?v=sObZ61W66GU&ab_channel=TheCodeBitesChannel
- Sign in to https://github.com/
- Create a new repository called ProjectManagerAPI
- Clone the repository locally
- Copy the contents of your demo project over to the repo folder
- Commit and Push to GitHub
- Go back to GitHub.com and create three new branches from master:
    - dev
    - qa
    - stg

### Part 2 Deploying our Applications using Render

- Create a new repository for your project (public preferably)
    - Remember to add a .gitignore file for Node
    - Upload your code to the repository
- Check instructions here https://geshan.com.np/blog/2021/01/free-nodejs-hosting/#render
- Navigate to Render.com
- Sign up and create a Free Account (using GitHub account to sign up is recommended)
- For each branch in the new repo:
    - Add a new Web Service
    - Select the corresponding branch:
        - dev
        - qa
        - stg
        - master (for prod)
    - Connect to GitHub Repo using your credentials
    - Modify build command to npm install
    - Modify start command to npm start
    - Navigate to your app link, e.g.: https://render-app-test-m9ki.onrender.com
- At the end of this activity you'll have 4 different app links


### Part 3 Demonstrating the Software Development Life Cycle

- Development starts in the DEV branch
- Clone repo locally and switch to the DEV branch
- Make changes to the Landing Page
    - Change the title to Project Manager API Home Page
- Push and commit your changes
- On GitHub.com:
    - Create a new Pull Request from DEV to QA
    - Accept and Merge Pull Request
    - Verify that deployment was triggered automatically in Render Dashboard
- When changes are in QA they are usually deployed to a QA environment and functional testing is performed
- After changes are accepted:
    - Create a new Pull Request from QA to STG
    - Accept and Merge Pull Request
    - Verify that deployment was triggered automatically in Render Dashboard
- When changes are in STG they are usually tested and verified by the customer
- After changes are accepted:
    - Create a new Pull Request from STG to master
    - Accept and Merge Pull Request
    - Verify that deployment was triggered automatically in Render Dashboard