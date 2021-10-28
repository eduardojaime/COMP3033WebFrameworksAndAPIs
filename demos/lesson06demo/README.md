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

### Part 2 Setting up a CI/CD pipeline in Heroku

- Sign in to https://dashboard.heroku.com
- Click on New > Create a New Pipeline named Project-Manager
- Two environments are enabled by default
- For both STG and PRD
    - Click on Add App > Create new App
    - Name them projectmgr-stg  and projectmgr-prd accordingly
    - Open projectmgr-stg by clicking on its name
        - Navigate to the Deploy tab
        - Select GitHub
        - Connect to your repository
        - Enable Automatic deploys from QA branch
        - In manual deploy, select QA branch and click Deploy
- Wait for app to deploy then go back to the pipeline
- Click on Promote to PRD to send your changes from STG to PRD
- Wait for app to deploy
- Verify app loads when hitting the STG and PRD URLS

### Part 3 Demonstrating the Software Development Life Cycle

- Development starts in the DEV branch
- Clone repo locally and switch to the DEV branch
- Make changes to the Landing Page
    - Change the title to Project Manager API Home Page
- Push and commit your changes
- On GitHub.com:
    - Create a new Pull Request from DEV to QA
    - Accept and Merge Pull Request
- When changes are in QA they are usually deployed to a QA environment and functional testing is performed
- After changes are accepted:
    - Create a new Pull Request from QA to STG
    - Accept and Merge Pull Request
    - Wait for Automatic Deployment to kick in
- When changes are in STG they are usually tested and verified by the customer
- After changes are accepted:
    - Go back to Heroku.com
    - Open the pipeline
    - Click on Promote to PRD
    - Wait for app to deploy
Verify changes in production URL