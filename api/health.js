const AWS = require('aws-sdk');
const moment =require('moment');
const util =require('./util.js');
const s3 = new AWS.S3();

AWS.config.update({region:'us-west-2'});
exports.handler = async (event,context) =>{
            return{
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                message: "Healthy CI/CD Demo",
                version: "v3.0",
                timestamp: moment().unix()
            })
        }
}
 
