const AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });
const util = require("./util.js");
const moment = require("moment");
const s3 = new AWS.S3();

// const dynamodb=new AWS.DynamoDB.DocumentClient();
// const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {

    console.log("Event:", event);
    console.log("Event REcieved");

    let fileContent = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body;
    let fileName = `${Date.now()}.jpeg`;
    //let contentType = event.headers['content-type'] || event.headers['Content-Type'];
  try {
    let data = await s3.putObject({
        Bucket: process.env.fileUploadBucket,
        Key: fileName,
        Body: fileContent,
        ACL:'public-read'
        }).promise();

    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({
        message: "File Uploaded Successfully",
        version: "v2Modified.0",
        timestamp: moment().unix(),
        Url:`https://${process.env.fileUploadBucket}.s3-us-west-2.amazonaws.com/${fileName}`
      }),
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
