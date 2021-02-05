const cloudinary = require("cloudinary").v2;
const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_API_KEY,
  CLOUDINARY_ROOT_FOLDER,
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,

  api_key: CLOUDINARY_API_KEY,

  api_secret: CLOUDINARY_API_SECRET,
});

async function requireCoverImage(req) {
  if (!req.file)
    return res.status(400).send({
      status: false,
      message: "coverImage is Required",
      data: null,
    });
}

async function requireAudio(req) {
  if (!req.file)
    return res.status(400).send({
      status: false,
      message: "Episode Audio is Required",
      data: null,
    });
}
async function coverImageUpload(req) {
  requireCoverImage(req);

  const uploadResult = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "image",
    folder: "press-play/coverImages",
    use_filename: true,
  });

  req.body.coverImageUrl = uploadResult.secure_url;
  req.body.cloudinary = uploadResult;
  return uploadResult;
}

async function deleteFile(path, resource_type) {
  const deleteResult = await cloudinary.uploader.destroy(path, {
    resource_type,
  });
  return deleteResult;
}

async function audioUpload(req) {
  requireAudio(req);

  const uploadResult = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "video",
    folder: "press-play/audio",
    use_filename: true,
  });
  req.body.episodeAudioUrl = uploadResult.secure_url;
  req.body.cloudinary = uploadResult;
  return uploadResult;
}

exports.coverImageUpload = coverImageUpload;
exports.audioUpload = audioUpload;
exports.deleteFile = deleteFile;
