const jwt = require('jsonwebtoken')

module.exports = {
    generateToken : (payload) => {
        const token = jwt.sign(payload, process.env.JWT_KEY)
        return token;
    },
    verifyToken : (token) => {
        const verify = jwt.verify(token, process.env.JWT_KEY)
        return verify
    }
}