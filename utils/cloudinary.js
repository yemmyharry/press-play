const cloudinary = require("cloudinary").v2;
const {
  CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_SECRET, 
  CLOUDINARY_API_KEY, CLOUDINARY_ROOT_FOLDER 
} = process.env

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,

  api_key: CLOUDINARY_API_KEY,

  api_secret: CLOUDINARY_API_SECRET,
});

async function coverImageUpload (req) {
  const uploadResult = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "image", folder: "press-play/coverImages", use_filename: true 
  });
  req.body.coverImageUrl = uploadResult.secure_url;

}

async function audioUpload (req) {
  const uploadResult = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "video", folder: "press-play/audio", use_filename: true 
  });
  req.body.audioUrl = uploadResult.secure_url;

}

exports.coverImageUpload = coverImageUpload
exports.audioUpload = audioUpload
