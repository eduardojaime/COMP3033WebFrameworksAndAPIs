# Lesson 01: Exploring and Consuming an API

## Objective

In this lesson, you will explore an API directory, evaluate an API's documentation, and make a request to retrieve data. You may use an API from the directory or complete the AniDB alternative activity.

## Part 1: Explore an API Directory

1. Navigate to the [popular APIs directory](https://apislist.com/apis/popular).
2. Browse the popular APIs and choose one that interests you.
3. Open the API's information page and read its description.
4. Review the available documentation and identify the following:
   - API endpoint
   - API portal or home page
   - SSL/HTTPS support
   - Authentication model
   - Architectural style, such as REST or GraphQL
   - Supported request formats
   - Supported response formats
   - Whether the API is unofficial
   - Pricing or usage limitations

> You are encouraged to choose one of the most popular APIs, but you may select another API from the directory if it provides accessible documentation and a testable endpoint.

## Part 2: Make an API Request

1. Read the API's documentation before making a request.
2. Identify an endpoint that returns useful data.
3. Determine whether the request requires an API key or other authentication.
4. Make a request using one of the following approaches:
   - A browser, for a simple `GET` request.
   - A REST client such as Thunder Client or Postman.
   - A Node.js script using the built-in `fetch` API.
5. Record the request method, endpoint, parameters, and response status code.
6. Save the response in JSON format when the API provides a JSON response.
7. Explain briefly what the response contains and identify at least two useful fields.

### Security requirements

- Do not commit API keys, access tokens, or other credentials to GitHub.
- Replace exposed credentials with `[REDACTED]` in screenshots, notes, and response examples.
- Follow the API provider's terms of use and rate limits.

## Alternative: AniDB and Dragon Ball GT 🐉

If you prefer, use the [AniDB HTTP API definition](https://wiki.anidb.net/HTTP_API_Definition) instead of selecting an API from the directory.

1. Read the AniDB HTTP API documentation.
2. Identify the endpoint and request format needed to search for anime information.
3. Find the AniDB entry for **Dragon Ball GT**.
4. Make the request using a browser, REST client, or Node.js script.
5. Print the returned Dragon Ball GT information in a readable format.
6. Include the request URL, response status, and relevant response data in your submission.

If the AniDB endpoint requires authentication, registration, a client identifier, or a specific request format, follow the requirements in the current AniDB documentation. Do not submit any private credentials.

## Submission

Collect the following information in your repository:

- Name and link of the API selected from the directory, or confirmation that you completed the AniDB alternative.
- API documentation URL.
- Request method and redacted endpoint.
- Authentication model and any required parameters.
- Response status code.
- JSON response or a readable excerpt of the returned data.
- A short explanation of what the response represents.
- At least two fields identified from the response.