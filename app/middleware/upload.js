const multer = require("multer");
const {nanoid} = require("nanoid");
const mime = require("mime-types");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

let storage = multer.diskStorage({
  destination: "static/uploads",
  filename: (req, file, cb) => {
    cb(null, `${nanoid()}.${mime.extension(file.mimetype)}`);
  },
});

let upload = multer({ storage, fileFilter: imageFilter });

module.exports = upload;
