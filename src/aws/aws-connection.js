const aws = require("aws-sdk");

aws.config.update({
  accessKeyId: process.env.Aws_accessKey,
  secretAccessKey: process.env.Aws_secretKey,
  region: process.env.Aws_region,
});

exports.uploadFile = async (file) => {
  return new Promise(function (resolve, reject) {
    let s3 = new aws.S3({ apiVersion: "2006-03-01" });

    var uploadParams = {
      ACL: "public-read",
      Bucket: process.env.Aws_bucket,
      Key: Date.now + file.originalname,
      Body: file.buffer,
    };

    s3.upload(uploadParams, function (err, data) {
      if (err) return reject({ error: err });
      console.log("file uploaded succesfully");
      return resolve(data.Location);
    });
  });
};
