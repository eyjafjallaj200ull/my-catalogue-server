# my-catalogue-server
API that lets the client authenticate with Google and sends and takes in Google Books data to and from authorised users, as well as accepting requests from the user to make and delete book reviews.
# How it works
The project uses sockets (Socket.IO) between the client and the server. When the client requests user data, the socket ID is attached to the request and if Google Auth is successful, the server emits the user data from the respective socket. OAuth 2.0 Access Tokens are encrypted with keys stored in Google Cloud Key Management Service and the encrypted tokens are stored in Redis. User emails and reviews are stored in a PostgreSQL database.
