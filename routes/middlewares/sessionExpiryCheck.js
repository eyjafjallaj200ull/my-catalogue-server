const {getAsync} = require("../../services/redis-client")
const sessionExpiryCheck = (req, res, next) =>  {
    getAsync(req.session.id)
    .then(data => {
        if(data) {
            next()
        } else {
            res.status(401).json()
        }
    })
}

module.exports = sessionExpiryCheck;