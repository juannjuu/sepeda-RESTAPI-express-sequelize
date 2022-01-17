const Joi = require("joi")
const { Sepeda, Vendor } = require("../models")
const errorHandler = require("../utils/error-handler")

module.exports = {
  createSepeda: async (req, res) => {
    const body = req.body
    const file = req.file
    try {
      //Create schema Joi
      const schema = Joi.object({
        vendorId : Joi.number().required(),
        name : Joi.string().required(),
        price : Joi.number().required(),
        stock : Joi.number().required(),
        image : Joi.string().required()
      });
      //Check Joi
      const { error } = schema.validate({
        ...body, //Spread Operator Except Image
        image: file.path, //Check file path extensions
      })
      //Check Error Joi
      if (error) {
        return res.status(400).json({
            message: error.message,
            status: "Bad Request",
            result: {}
        })
      }
      //Insert to Database
      const sepeda = await Sepeda.create({
        ...body, 
        image: file.path
      });
      //Check Error
      if (!sepeda) {
        return res.status(500).json({
          message: "Create Sepeda Failed",
          status: "Internal Server Error",
          result: {}
        })
      }
      //Response Success
      res.status(201).json({
        message: "Create Sepeda Berhasil",
        status: "OK",
        result: sepeda
      })
    } catch (error) {
        errorHandler(res, error)
    }
  },
  getSepedas: async (req, res) => {
    try {
      //Get * from Database Sepeda
      const sepedas = await Sepeda.findAll({
        limit: 10, //limit get Data
        include : [ //join on
          {
            model : Vendor,
            as : "vendor",
            attributes : ["name", "city", "estabilishedYear"] //join attributes
          }
        ],
        attributes : { 
          exclude : ["updatedAt", "createdAt"]  //exclude attributes
        } 
      })
      //Check if data is not added
      if (sepedas.length == 0) {
        return res.status(404).json({
          message: "Data is empty",
          status: "Not Found",
          result: [],
        })
      }
      return res.status(200).json({
        message: "Get Data Success",
        status: "OK",
        result: sepedas,
      });
    } catch (error) {
        errorHandler(res, error)
    }
  },
  getSepeda: async (req, res) => {
    const { sepedaId } = req.params;
    try {
      //Get a data from Database Vendor
      const sepeda = await Sepeda.findOne({
        where: { //Where Clause
          id : sepedaId,
        },
        include : [ //join on
          {
            model : Vendor,
            as : "vendor",
            attributes : ["name", "city", "estabilishedYear"]
          }
        ]
      })
      //Check if Data is Existing
      if (!sepeda) {
        return res.status(404).json({
          message: "Cannot find a Sepeda with id " + sepedaId,
          status: "Not Found",
          result: {},
        })
      }
      //Response Success
      res.status(200).json({
        message: "Get Data Success",
        status: "OK",
        result: sepeda,
      })
    } catch (error) {
        errorHandler(res, error)
    }
  },
  updateSepeda: async (req, res) => {
    const { sepedaId } = req.params
    const body = req.body
    try {
      //Create schema Joi
      const schema = Joi.object({
        vendorId : Joi.number(),
        name : Joi.string(),
        price : Joi.number(),
        stock : Joi.number(),
        image : Joi.string()
      })
      //Check Joi
      const { error } = schema.validate(body)
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
          result: {},
        })
      }
      //Update Data to Database
      const checkUpdate = await Sepeda.update(body, {
        where: { //Where Clause
          id: sepedaId,
        },
      })
      //Check if Data is Existing
      if (checkUpdate[0] != 1) {
        return res.status(404).json({
          status: "Not Found",
          message: "Failed to update the data / data not found",
          result: {},
        })
      }
      //Get Updated Data By Its Primary Key
      const sepeda = await Sepeda.findByPk(sepedaId)
      //Response Success
      res.status(200).json({
        message: "Update Data Success",
        status: "OK",
        result: sepeda,
      })
    } catch (error) {
        errorHandler(res, error)
    }
  },
  deleteSepeda: async (req, res) => {
    const { sepedaId } = req.params
    try {
      //Delete a data from Database
      const sepeda = await Sepeda.destroy({
        where: {
          id: sepedaId,
        },
      })
      //Check if Data is Exist
      if (!sepeda) {
        return res.status(404).json({
          message: "Data is not Exist",
          status: "Not Found",
          result: {},
        })
      }
      //Response Success
      res.status(200).json({
        status: "success",
        message: "Successfuly delete the data",
        result: {},
      })
    } catch (error) {
        errorHandler(res, error)
    }
  }
}