const AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });
const util = require("./util.js");
const multipart = require("parse-multipart");
const moment = require("moment");
const s3 = new AWS.S3();

// const dynamodb=new AWS.DynamoDB.DocumentClient();
// const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
  console.log(event);
  console.log(event.params.header);

  // console.log(JSON.stringify(event.params.header));
  // console.log(event['body-json']);
  let bodyBuffer = new Buffer.from(event["body-json"].toString(), "base64");
  console.log(bodyBuffer);
  let boundary = multipart.getBoundary(event.params.header["Content-Type"]);
  //console.log(boundary);
  let parts = multipart.Parse(bodyBuffer, boundary);
  console.log(parts[0].data);
  console.log(parts);
  let fileDetails= parts.map((part)=>{
return {filename:part.filename,filetype:part.type};
  });
console.log(fileDetails);

  let fileName = `${Date.now()}.pdf`;
  //let contentType = event.headers['content-type'] || event.headers['Content-Type'];
  try {
    let data = await s3
      .putObject({
        Bucket: process.env.fileUploadBucket,
        Key: fileName,
        Body: parts[0].data,
        ACL: "public-read",
      })
      .promise();
    const url = `https://${process.env.fileUploadBucket}.s3-us-west-2.amazonaws.com/${fileName}`;
    console.log(url);
    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: {
        message: "File Uploaded Successfully",
        version: "v2Modified.0",
        timestamp: moment().unix(),
        ImageURL: url,
        Parts: { FileName: parts[0].filename, FileType: parts[0].type },
      },
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
