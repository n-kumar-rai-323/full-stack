const { cloudConfig } = require("../config/config");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: cloudConfig.cloudName,
      api_key: cloudConfig.apiKey,
      api_secret: cloudConfig.apiSecret,
    });
  }

  uploadFile = async (file, dir = "") => {
    try {
      const uploadResult = await cloudinary.uploader.upload(file, {
        unique_filename: true,
        folder: "/ecom-" + dir,
      });

      fs.unlinkSync(file);

      const optimizedUrl = cloudinary.url(uploadResult.public_id, {
        quality: "auto",
        fetch_format: "auto",
      });

      // return { uploadResult, optimizedUrl };
      return {
        url: uploadResult.secure_url,
        optimizedUrl: optimizedUrl,
      };
    } catch (exception) {
      next(exception);
    }
  };
}
const cloudinarySvc = new CloudinaryService();
module.exports = cloudinarySvc;
