1. User Authentication
Google Sign-In
Endpoint: /api/auth/google
Method: POST
Description: Authenticate the user using Google Sign-In.
Request Body:
{  "token": "<Google OAuth token>"}
{  "message": "Authentication successful",  "accessToken": "<JWT token>",  "user": {    "id": "<User ID>",    "email": "<User email>"  }}
2. Create Short URL
Create a new short URL
Endpoint: /api/shorten
Method: POST
Description: Create a new short URL to facilitate easy sharing of long URLs.
Request Body:
{  "longUrl": "<Original long URL>",  "customAlias": "<Optional custom alias>",  "topic": "<Optional topic>"}
{  "shortUrl": "<Generated short URL>",  "createdAt": "<Timestamp of creation>"}
3. Redirect Short URL
Redirect to the original URL
Endpoint: /api/shorten/{alias}
Method: GET
Description: Redirect to the original URL based on the short URL alias.
Response: Redirects the user to the original long URL.
4. Get URL Analytics
Retrieve analytics for a specific short URL
Endpoint: /api/analytics/{alias}
Method: GET
Description: Retrieve detailed analytics for a specific short URL.
Response:
{  "totalClicks": 123,  "uniqueClicks": 45,  "clicksByDate": [    { "date": "2024-12-23", "clicks": 12 },    { "date": "2024-12-24", "clicks": 18 }  ],  "osType": [    { "osName": "Windows", "uniqueClicks": 40, "uniqueUsers": 35 },    { "osName": "macOS", "uniqueClicks": 20, "uniqueUsers": 15 }  ],  "deviceType": [    { "deviceName": "mobile", "uniqueClicks": 70, "uniqueUsers": 60 },    { "deviceName": "desktop", "uniqueClicks": 53, "uniqueUsers": 43 }  ]}
5. Get Topic-Based Analytics
Retrieve analytics for all URLs under a specific topic
Endpoint: /api/analytics/topic/{topic}
Method: GET
Description: Retrieve analytics for all short URLs grouped under a specific topic.
Response:
{  "totalClicks": 500,  "uniqueClicks": 200,  "clicksByDate": [    { "date": "2024-12-23", "clicks": 50 },    { "date": "2024-12-24", "clicks": 100 }  ],  "urls": [    {      "shortUrl": "<Short URL 1>",      "totalClicks": 300,      "uniqueClicks": 150    },    {      "shortUrl": "<Short URL 2>",      "totalClicks": 200,      "uniqueClicks": 50    }  ]}
6. Get Overall Analytics
Retrieve overall analytics for all short URLs created by the user
Endpoint: /api/analytics/overall
Method: GET
Description: Retrieve a comprehensive view of all user-created short URLs.
Response:
{  "totalUrls": 10,  "totalClicks": 1000,  "uniqueClicks": 400,  "clicksByDate": [    { "date": "2024-12-23", "clicks": 100 },    { "date": "2024-12-24", "clicks": 200 }  ],  "osType": [    { "osName": "Windows", "uniqueClicks": 400, "uniqueUsers": 300 },    { "osName": "macOS", "uniqueClicks": 200, "uniqueUsers": 150 }  ],  "deviceType": [    { "deviceName": "mobile", "uniqueClicks": 700, "uniqueUsers": 600 },    { "deviceName": "desktop", "uniqueClicks": 300, "uniqueUsers": 200 }  ]}
