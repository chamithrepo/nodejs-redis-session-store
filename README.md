<h1>Session Management in Nodejs Using Redis as Session Store</h1>

Building a simple user login using the sessions.
1. User login to the application by entering the username and the password.
2. After submitting the server generates a unique random number, known as the session ID, which is also stored on the Reids store.
3. The session ID is sent back to the user in the cookie header of the response data. For Node.js, this cookie header is named connect.sid.
4. Next time user comes to the application, the cookie is passed back to the server in the header with the session id. Then server check for the particular session id in the Redis store. If the session exists in the store user will be redirected to the home page without going to the login page.
5. User can stay in the page until the session expires.
