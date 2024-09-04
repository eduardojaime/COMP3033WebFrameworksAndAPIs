# Instructions

### Part 1 Exploring an API Directory

- Navigate to https://www.apislist.com
- Browse around the site
    - Click on About at the top to learn more about the library
    - Click on APIs > All APIs at the top to access the library
        - Explore some of the Most Popular APIs
            - Facebook
            - Google Maps
            - Weather Channel
        - Click on each of the above to navigate to the main API page
            - Read the description
            - Examine the Summary tab
                - Understand each feature and pricing tier
            - Click on Visit API Docs and identify the following:
                - API Endpoint
                - API Portal Home Page
                - SSL Support
                - Authentication Model
                - Architectural Style
                - Supported Request Formats
                - Supported Response Formats
                - Is this an unofficial API?

### Part 2 Consuming an API from the directory

- Search for Weather Unlocked Local Weather in the directory
    - Alternatively, use the direct link https://www.weatherunlocked.com/products/weather-api/overview
    - Read the description and pricing tabs
    - Click on the API Portal Home Page link
        - Alternatively, use the direct link https://developer.weatherunlocked.com/localweather
        - Click on the Documentation tab
            - Read the Get Started section for an overview of how to use the API
            - Click on the Sign Up link to create a free account
                - Once you have created an account and an app navigate to Dashboard (menu at the top)
                - Copy paste the App Name, App ID, and Key values on Notepad
            - Back to the documentation page
                - Copy the API Base URL (http) and paste it on Notepad
                - Copy the Request Structure and paste it on Notepad, appending it to the Base URL
                    - Example: http://api.weatherunlocked.com/api/{LocalWeatherType}/{Location}?app_id={APP_ID}&app_key={APP_KEY}
                - Modify the URL by substituting {APP_ID} and {APP_KEY} with your own key values
                - Replace {LocalWeatherType} with current
                - Replace {Location} with a coordinates value: 44.38,-79.69 for Barrie ON
                    - Example: http://api.weatherunlocked.com/api/current/44.38,-79.69?app_id={APP_ID}&app_key={APP_KEY}
                - Copy and paste the URL on your browser and take a look at the response
                    - Look for Current Temp in C
                - Create a copy of the URL and replace Location with an interesting place of your choosing
                    - E.g. 31.42306,-106.44361 for Samalayuca Dune Fields in Mexico
