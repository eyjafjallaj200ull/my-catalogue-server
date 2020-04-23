const kms = require('@google-cloud/kms');
const kmsClient = new kms.KeyManagementServiceClient();
module.exports = kmsClient;