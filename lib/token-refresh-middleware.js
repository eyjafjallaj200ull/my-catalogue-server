const refresh = require('passport-oauth2-refresh');
const {db} = require("../config");
const {encrypt, decrypt} = require("./utils")
const kmsClient = require("./kmsClient");
const atob = require('atob');
const btoa = require("btoa");

module.exports = (options) => {
    return async (req, res, next) => {
        // Implement the middleware function based on the options object
        let retries = 2;
        const send401Response = () => {
            return res.status(401).end();
        };
        const makeRequest = () => {
        retries--;
        if(!retries) {
          // Couldn't refresh the access token.
          return send401Response();
        }
        options.request(...options.args).then((resp) => {
          // Success! Do something with the response
          req.data = resp;
          next("route");
  
        })
        .catch(async (reason) => {
            if(reason.code === 401) {
                // Access token expired.
                // Try to fetch a new one.
                //have to make a database call with encrypteduserid and get the encrypted refresh token
                const encryptedRefreshToken = await db("users").select("refreshToken").where("id", options.userId)
                .then(result => result[0]);
                //then decrypt the token and pass that
                const base64RT = await decrypt("my-catalogue1", "project", "google-auth", encryptedRefreshToken, kmsClient)
                const refreshToken = atob(base64RT)
                refresh.requestNewAccessToken('google', refreshToken, async (err, accessToken) => {
                    if(err || !accessToken) { return send401Response(); }
        
                    // Save the new accessToken for future use
                    const base64AT = btoa(accessToken);
                    const encryptedAccessToken = await encrypt("my-catalogue1", "project", "google-auth", base64AT, kmsClient);
                    setAsync(req.session.id, encryptedAccessToken)
                    // Retry the request.
                    .then(() => makeRequest())
                });
    
            } else {
                // There was another error, handle it appropriately.
                return res.status(reason.code).json(reason.message);
            }
        })
    };

    // Make the initial request.
    makeRequest();
    }
}