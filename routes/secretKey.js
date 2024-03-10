// secretKey.js
const crypto = require('crypto');

// Generar una clave secreta aleatoria de 64 bytes (512 bits)
const secretKey = crypto.randomBytes(64).toString('hex');

module.exports = secretKey;
