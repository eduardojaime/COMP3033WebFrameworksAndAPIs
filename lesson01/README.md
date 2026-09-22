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

## Alternative: Spotify Web API and a Favorite Artist 🎵

If you prefer, use the [Spotify Web API documentation](https://developer.spotify.com/documentation/web-api) to retrieve information about one of your favorite artists.

1. Read the [Spotify Web API documentation](https://developer.spotify.com/documentation/web-api), especially the authentication and artists sections.
2. Create or use a Spotify developer application and obtain the credentials required for authorization.
3. Authenticate using the method documented by Spotify. Do not commit a client secret, access token, or other credential to GitHub.
4. Search for your favorite artist using the **Search for an Item** endpoint:

   ```text
   GET https://api.spotify.com/v1/search?q=ARTIST_NAME&type=artist
   ```

5. Record the artist's Spotify ID from the search response.
6. Retrieve the artist's information using the [Get Artist endpoint](https://developer.spotify.com/documentation/web-api/reference/get-an-artist):

   ```text
   GET https://api.spotify.com/v1/artists/{id}
   ```

7. Print the returned artist information in a readable format. Include useful properties such as:
   - Artist name
   - Spotify artist ID
   - Genres
   - Popularity
   - Follower count
   - Spotify URL
8. Include the request method, redacted endpoint, response status, and relevant response data in your submission.

If you use an access token, replace it with `[REDACTED]` in screenshots, notes, URLs, and response examples. Follow Spotify's current developer terms, authentication requirements, and rate limits.

## Checklist

Before considering this lesson complete, confirm each item:

- [ ] An API was selected from the directory, or an alternative activity was completed using AniDB or Spotify.
- [ ] The API name and link were recorded, or the AniDB activity or Spotify artist name was documented.
- [ ] The API documentation URL was included.
- [ ] The request method and a redacted endpoint were recorded.
- [ ] The authentication model and any required parameters were documented.
- [ ] The response status code was recorded.
- [ ] The JSON response or a readable excerpt of the returned data was included.
- [ ] The response contents were explained.
- [ ] At least two useful fields from the response were identified.
- [ ] API keys, access tokens, client secrets, and other credentials were removed.