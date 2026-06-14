const multer = require("multer");
const fs = require("fs");

// storage
const myStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = "./public";

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }

    cb(null, path);
  },

  filename: (req, file, cb) => {
    const filename = Date.now() + "-" + file.originalname;
    cb(null, filename);
  },
});

// uploader
const uploader = (type = "image") => {
  let alloweExist = ["jpg", "jpeg", "png", "webp"];
  let fileSizeLimit = 5 * 1024 * 1024; // 2 MB

  if (type === "doc") {
    alloweExist = ["pdf", "doc", "docx", "xls", "xlsx"];
    fileSizeLimit = 3 * 1024 * 1024; // 3 MB
  } else if (type === "audio") {
    alloweExist = ["mp3", "wav", "aac"];
    fileSizeLimit = 3 * 1024 * 1024; // 3 MB
  } else if (type === "video") {
    alloweExist = ["mp4", "avi", "mov", "mkv"];
    fileSizeLimit = 5 * 1024 * 1024; // 5 MB
  }

  const fileFilter = (req, file, cb) => {
    const ext = file.originalname.split(".").pop().toLowerCase();

    if (!alloweExist.includes(ext)) {
      return cb({
        code: 422,
        message: "File format not supported",
        status: "INVALID_FILE_FORMAT",
      });
    }

    cb(null, true);
  };

  return multer({
    storage: myStorage,
    fileFilter,
    limits: {
      fileSize: fileSizeLimit,
    },
  });
};

module.exports = uploader;