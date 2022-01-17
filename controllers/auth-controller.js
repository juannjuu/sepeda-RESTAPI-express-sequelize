const Joi = require('Joi')
const { Users } = require('../models')
const { hashPassword, comparePassword } = require('../utils/bcrypt')
const { generateToken } = require('../utils/jwt')
const errorHandler = require('../utils/error-handler')

module.exports = {
    register : async (req, res) => {
        const { name, email, password } = req.body
        try {
            //create schema Joi
            const schema = Joi.object({
                email: Joi.string().email().required(),
                name: Joi.string().required(),
                password: Joi.string().required()
            })
            //check Joi
            const { error } = schema.validate(req.body)
            if(error) {
                return res.status(400).json({
                    message: error.message,
                    status: "Bad Request",
                    result: {}
                })
            }
            //Get User Where
            const check = await Users.findOne({
                where: { //Where Clause
                    email: email,
                }
            })
            //Check Email is Exist
            if (check) {
                return res.status(400).json({
                    message: "Email is Already in Use",
                    status: "Bad Request",
                    result: {}
                })
            }
            //Hash Password Bcrypt
            const passwordHashed = hashPassword(password)
            //Insert to Database
            const user = await Users.create({
                name: name,
                email: email,
                password: passwordHashed
            })
            //Create token
            const token = generateToken({
                id: user.id,
                email: user.email,
            },
            process.env.SECRET_TOKEN,
            { expiresIn: 60 * 60 * 12 }
            )
            //Response Success
            res.status(200).json({
                message: "Register Success",
                status: "OK",
                result: { 
                    token: token 
                }
            })
        } catch (error) {
            errorHandler(res, error)
        }
    }, 
    login: async (req, res) => {
        const { email, password } = req.body
        try {
            //Create schema Joi
            const schema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().required()
            })
            //Check Joi
            const { error } = schema.validate(req.body)
            if(error) {
                return res.status(400).json({
                    message: error.message,
                    status: "Bad Request",
                    result: {}
                })
            }
            //Get User Where
            const user = await Users.findOne({ 
                where: { //Where Clause
                    email
                } 
            })
            //Check Data
            if(!user) {
                return res.status(401).json({
                    message: "Username or Password Incorrect",
                    status: "Unauthorized",
                    result: {}
                })
            }
            //Compare Password from Body and Password from Database
            const checkValid = comparePassword(password, user.password)
            if(!checkValid) {
                return res.status(401).json({
                    message: "Username or Password Incorrect",
                    status: "Unauthorized",
                    result: {}
                })
            }
            //Create New Token
            const token = generateToken({ 
                email: user.email,
                id: user.id
            },
            process.env.JWT_KEY,
            { expiresIn: "12 hours" }
            )
            //Response Success
            res.status(200).json({
                message: "Login Success",
                status: "OK",
                result: {
                    token: token
                }
            })
        } catch (error) {
            errorHandler(res, error)
        }
    }
}