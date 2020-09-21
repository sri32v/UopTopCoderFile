const AWS = require('aws-sdk');
const s3 = new AWS.S3();
let mime = require('mime-types');
const util =require('./util.js');
const multipart = require('parse-multipart');
AWS.config.update({region:'us-west-2'});
exports.handler = async (event) => {
 
    try {
        console.log(event.params.header);
       
       // console.log(JSON.stringify(event.params.header));
       // console.log(event['body-json']);
       let bodyBuffer = new Buffer.from(event['body-json'].toString(),'base64');
       console.log(bodyBuffer); 
        let boundary= multipart.getBoundary(event.params.header["Content-Type"]);
        //console.log(boundary);
        let parts =multipart.Parse(bodyBuffer,boundary);
        console.log(parts[0].data);

        let data = await s3.putObject({
            Bucket: process.env.imageUploadBucket,
            Key: 'test.jpeg',
            Body: parts[0].data,
            ACL:'public-read'
            }).promise();

        console.log("Successfully uploaded file");
        const url = `https://${process.env.imageUploadBucket}.s3-us-west-2.amazonaws.com/test.jpeg`;

        return{
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({result:'Success',files:parts})
            //imageURL: url
        }

    } catch (err) {
        console.log("Error",err);
//Have to return HTTP response with status codes
        return {
            statusCode: err.statusCode ? err.StatusCode : 500, 
            headers: util.getResponseHeaders(),
            body: JSON.stringify ({
                error: err.name ? err.name : "Exception",
                message: err.message? err.message: "unknown error"
            })
        }
    };
};