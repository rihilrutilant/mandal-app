require('dotenv').config();
const multer = require("multer");



//// profile pic upload on file middleware

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/slider_images')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        if (extension == "jpg" || extension == "jpeg" || extension == "png") {
            cb(null, file.originalname)
        } else {
            cb(null, "file formate not allow")
        }
    }
})

const upload = multer({ storage: storage })












module.exports = {
    upload,
}