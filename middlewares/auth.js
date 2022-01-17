const { Users } = require('../models')
const { verifyToken } = require('../utils/jwt')
const errorHandler = require('../utils/error-handler')

module.exports = {
    isLogin: async (req, res, next) => {
        try {
            let token = req.header("Authorization")

            if(!token) {
                return res.status(401).json({
                    message: "Token dibutuhkan",
                    status: "Authorized",
                    result : {}
                })
            }

            token = token.replace("Bearer ", "")
            const decoded = verifyToken(token, process.env.JWT_KEY)

            if(!decoded) {
                return res.status(401).json({
                    message: "Token tidak valid",
                    status: "Unauthorized",
                    result : {}
                })
            }

            const user = await Users.findByPk(decoded.id);
            if(!user){
                return res.status(401).json({
                    message: "User tidak ditemukan",
                    status: "Unauthorized",
                    result : {}
                })
            }

            req.user = {
                id: user.id,
                email: user.email,
                isAdmin: user.isAdmin
            }
            next()
        } catch (error) {
            errorHandler(res, error)
        }
        
    },
    isAdmin: async (req, res, next) => {
        try {
            let token = req.header("Authorization")

            if(!token) {
                return res.status(401).json({
                    message: "Token dibutuhkan",
                    status: "Authorized",
                    result : {}
                })
            }

            token = token.replace("Bearer ", "")
            const decoded = verifyToken(token, process.env.JWT_KEY)

            if(!decoded) {
                return res.status(401).json({
                    message: "Token tidak valid",
                    status: "Unauthorized",
                    result : {}
                })
            }

            const user = await Users.findByPk(decoded.id);
            if(!user){
                return res.status(401).json({
                    message: "User tidak ditemukan",
                    status: "Unauthorized",
                    result : {}
                })
            }

            if (!user.isAdmin) {
                return res.status(401).json({
                status: "Unauthorized",
                message: "You have no right to access this end-point",
                result: {},
                });
            }
            
            req.user = {
                id: user.id,
                email: user.email,
                isAdmin: user.isAdmin
            }

            next()
        } catch (error) {
            errorHandler(res, error)
        }
        
    }
}