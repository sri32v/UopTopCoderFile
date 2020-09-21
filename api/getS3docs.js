const AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });
const util = require("./util.js");
const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    let bucket =process.env.fileUploadBucket;
    // Get file from S3
    var params = {
       Bucket: bucket,
    };
const response = await s3.listObjectsV2(params).promise();
    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(response)
    };
  } catch (err) {
    console.log("Error", err);
    //Have to return HTTP response with status codes
    return {
      statusCode: err.statusCode ? err.StatusCode : 500,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "unknown error",
      }),
    };
  }
};
