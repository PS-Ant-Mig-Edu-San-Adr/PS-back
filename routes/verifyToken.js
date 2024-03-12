const jwt = require("jsonwebtoken");
const secretKey = require('./secretKey');

function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ success: false, details: "No se ha proporcioado token" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, details: "Fallo al autenticar" });
        }

        req.user = decoded;
        next();
    });
}

module.exports = verifyToken;
