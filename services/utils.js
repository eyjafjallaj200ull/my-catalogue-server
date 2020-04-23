const encrypt = async (projectId, keyRingId, cryptoKeyId, plaintext, kmsClient) => {
  const locationId = 'global';
  const name = kmsClient.cryptoKeyPath(
    projectId,
    locationId,
    keyRingId,
    cryptoKeyId
  );
  const [result] = await kmsClient.encrypt({name, plaintext});
  return result.ciphertext;
}

const decrypt = async (projectId, keyRingId, cryptoKeyId, ciphertext, kmsClient) => {
  const locationId = 'global';
  const name = kmsClient.cryptoKeyPath(
    projectId,
    locationId,
    keyRingId,
    cryptoKeyId
  );
  const [result] = await kmsClient.decrypt({name, ciphertext});
  return result.plaintext;
}

module.exports = {
  encrypt,
  decrypt
}