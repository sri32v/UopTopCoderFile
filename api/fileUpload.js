const AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });
const util = require("./util.js");
const multipart = require("parse-multipart");
const moment = require("moment");
const {v4:uuidv4}=require('uuid');
const s3 = new AWS.S3();

//  const dynamodb=new AWS.DynamoDB.DocumentClient();
//  const tableName = "Uop-Doc-Init";

exports.handler = async (event) => {
//console.log(event.params.querystring.type);
  let bodyBuffer = new Buffer.from(event["body-json"].toString(), "base64");
  // console.log(event);
  // console.log(event.params.header);
  if (event.params.header.hasOwnProperty("Content-Type")){
    //console.log("CType:",event.params.header["Content-Type"])
    var boundary = multipart.getBoundary(event.params.header["Content-Type"]);
  }
  if (event.params.header.hasOwnProperty("content-type")){
    //console.log("ctype:",event.params.header["content-type"])
    var boundary = multipart.getBoundary(event.params.header["content-type"]);
  }
 
  let parts = multipart.Parse(bodyBuffer, boundary);
  //let fileName = `${Date.now()}.pdf`;
  // let fileType = parts[0].type;
  // console.log(fileType);
  // let extension  = fileType.substring(fileType.lastIndexOf('/')+1,fileType.length);
  // console.log(extension); 

   let fileName=`${Date.now()}_${parts[0].filename}`;
   const loggedUser=event.params.querystring.pid;
console.log(loggedUser);
switch(event.params.querystring.type) {
  case 'DR':
    fileName="Driving License/"+loggedUser+"/" + fileName;
    break;
  case 'TR':
    fileName="Transcripts/"+loggedUser+"/" + fileName;
    break;
  default:
    fileName="Other/"+loggedUser+"/" + fileName;
}

   let params = {
  Bucket: process.env.fileUploadBucket,
  key:fileName
}
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
      const confirmNum=moment().unix()+uuidv4();
      //console.log(url);
    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: {
        message: "File Uploaded Successfully",
        version: "v2Modified.0",
        timestamp: moment().unix(),
        confirmNum:confirmNum,
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
