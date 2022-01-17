const Joi = require("joi")
const { Vendor, Sepeda } = require("../models")
const errorHandler = require("../utils/error-handler")

module.exports = {
  createVendor: async (req, res) => {
    const body = req.body
    try {
      //Create schema Joi
      const schema = Joi.object({
          name: Joi.string().required(),
          estabilishedYear: Joi.number().required(),
          city: Joi.string().required()
      })
      //Check Joi
      const { error } = schema.validate(req.body);
      if (error) {
          return res.status(400).json({
              message: error.message,
              status: "Bad Request",
              result: {}
          })
      }
      //Insert to Database Vendor
      const vendor = await Vendor.create(body);
      //Check Error
      if (!vendor) {
        return res.status(500).json({
          message: "Create Data Failed",
          status: "Internal Server Error",
          result: {}
        })
      }
      //Response Success
      res.status(201).json({
        message: "Create Vendor Success",
        status: "OK",
        result: vendor,
      })
    } catch (error) {
        errorHandler(res, error)
    }
  },
  getVendors: async (req, res) => {
    try {
      //Get * from Database Vendor
      const vendors = await Vendor.findAll({
        limit: 10, //limit get Data
        include : [ //join on
          {
            model : Sepeda,
            as : "sepeda",
            attributes : ["name", "price", "stock"] //join attributes
          }
        ],
        attributes : { 
          exclude : ["updatedAt", "createdAt"] //exclude attributes 
        } 
      })
      //Check if data is not added
      if (vendors.length == 0) {
        return res.status(404).json({
          message: "Data is empty",
          status: "Not Found",
          result: [],
        })
      }
      //Response Success
      return res.status(200).json({
        message: "Get Data Success",
        status: "OK",
        result: vendors,
      })
    } catch (error) {
        errorHandler(res, error)
    }
  },
  getVendor: async (req, res) => {
    const { vendorId } = req.params
    try {
      //Get a data from Database Vendor
      const vendor = await Vendor.findOne({
        where: { //Where Clause
          id : vendorId,
        },
        include : [ //join on
          {
            model : Sepeda,
            as : "sepeda",
            attributes : ["name", "price", "stock", "image"]
          }
        ]
      })
      //Check if Data is Existing
      if (!vendor) {
        return res.status(404).json({
          message: "Cannot find a Vendor with id " + vendorId,
          status: "Not Found",
          result: {},
        })
      }
      //Response Success
      res.status(200).json({
        message: "Get Data Success",
        status: "OK",
        result: vendor,
      })
    } catch (error) {
        errorHandler(res, error)
    }
  },
  updateVendor: async (req, res) => {
    const { vendorId } = req.params
    const body = req.body
    try {
      //Create schema Joi
      const schema = Joi.object({
        name: Joi.string(),
        estabilishedYear: Joi.number(),
        city: Joi.string(),
      })
      //Check Joi
      const { error } = schema.validate(body);
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
          result: {},
        })
      }
      //Update Data to Database
      const checkUpdate = await Vendor.update(body, {
        where: { //Where Clause
          id: vendorId,
        },
      })
      //Check if Data is Existing
      if (checkUpdate[0] != 1) {
        return res.status(404).json({
          message: "Data is Not Found",
          status: "Not Found",
          result: {},
        })
      }
      //Get Updated Data By Its Primary Key
      const vendor = await Vendor.findByPk(vendorId)
      //Response Success
      res.status(200).json({
        message: "Update Data Success",
        status: "OK",
        result: vendor,
      })
    } catch (error) {
        errorHandler(res, error)
    }
  },
  deleteVendor: async (req, res) => {
    const { vendorId } = req.params;
    try {
      //Delete From Database
      const vendor = await Vendor.destroy({
        where: { //Where Clause
          id: vendorId,
        },
      });
      //Check if Data is Exist
      if (!vendor) {
        return res.status(404).json({
          message: "Data is Not Exist",
          status: "Not Found",
          result: {},
        })
      }
      //Response Success
      res.status(200).json({
        message: "Delete Data Success",
        status: "OK",
        result: {},
      })
    } catch (error) {
        errorHandler(res, error)
    }
  }
}