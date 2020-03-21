const redis = require("redis");
const redisClient = redis.createClient();
const { promisify } = require("util");
const setAsync = promisify(redisClient.set).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

module.exports = {
    redisClient,
    setAsync,
    getAsync,
    delAsync
}