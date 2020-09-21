// Route: POST /note
// LAMBDA BoilerPlate Code
const AWS = require('aws-sdk');
AWS.config.update({region:'us-west-2'});
//const moment = require('moment');
//const {v4:uuidv4}=require('uuid');
const util =require('./util.js');

const dynamodb=new AWS.DynamoDB.DocumentClient(); 
var param = {};
console.log(dynamodb);
// dynamodb.listTables(param, function (err, data) {
//     if (err) console.log(err, err.stack); // an error occurred
//     else     console.log(data);           // successful response
//   });
const tableName = "sls-notes-backend-prod";

exports.handler = async (event) =>{

    try {
      let item = { 
          user_id:"testete",
          user_name:"sgagfdada",
          note_id:"dfadfafdaa",
          timestamp:1
        }

    //Dynamo DB putobject
    
        let data = await dynamodb.put({
            TableName: tableName,
            Item: item
        }).promise();
    
        return{
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(item)
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
