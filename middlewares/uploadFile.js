const cloudinary = require('../config/cloudinary')
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const multer = require('multer')
const errorHandler = require('../utils/error-handler')

module.exports = {
    uploadCloud: (fieldName) => {
        // membuat storage / setting storage (file disimpan dimana)
        const storage = new CloudinaryStorage({
          cloudinary: cloudinary,
          params: (req, file) => {
            return {
              folder: fieldName,
              resource_type: "raw",
              public_id: Date.now() + " - " + file.originalname,
            };
          },
        });
    
        const upload = multer({ storage }).single(fieldName); // setting uploader
    
        return (req, res, next) => {
          upload(req, res, (err) => {
            if (err) {
              catchHandler(res, err);
            }
            next();
          });
        };
    }
}
