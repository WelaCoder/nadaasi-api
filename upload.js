const multer = require("multer");
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, "client/build/uploads"); for production
    // for degug
    cb(null, "client/public/uploads");
  },
  filename: function (req, res, cb) {
    const ext = MIME_TYPE_MAP[res.mimetype];
    cb(null, Date.now() + "." + ext);
  },
});
module.exports = multer({
  storage: storage,
  limits: { fieldSize: "100MB ", fieldSize: "100MB" },
});
