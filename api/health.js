const AWS = require('aws-sdk');
AWS.config.update({region:'us-west-2'});
const util =require('./util.js');
const s3 = new AWS.S3();
 
// const dynamodb=new AWS.DynamoDB.DocumentClient();
// const tableName = process.env.NOTES_TABLE;
 
exports.handler = async (event) =>{
    try {
        return{
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
            message: "Healthy CI/CD Demo",
                version: "v1.0",
                timestamp: moment().unix()
})
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
    }
 
}

 
