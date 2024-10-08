const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

// Initialize the S3 client using AWS SDK v3
const s3 = new S3Client({
  region: 'ap-southeast-2', // Example: 'us-east-1'
  // AWS CLI credentials will be used automatically
});

// Multer configuration for uploading files to S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'lifelens-images',
    key: (req, file, cb) => {
      cb(null, `images/${Date.now()}_${file.originalname}`);  // Customize the file name in S3
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },  // 5 MB size limit
});

module.exports = upload;
