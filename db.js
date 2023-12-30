import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import uniqid from 'uniqid';
dotenv.config();

const myAWSAccessKey = process.env.AWSACCESSKEY;
const myAWSSecretKey = process.env.AWSSECRETACCESSKEY;
const myRegion = process.env.REGION;

AWS.config.update({
  secretAccessKey: myAWSSecretKey,
  accessKeyId: myAWSAccessKey,
  region: myRegion,
  signatureVersion: 'v4',
});
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const myBucket = process.env.BUCKET
const s3 = new AWS.S3();

export async function getFiles() {
  // const fileStream = await s3.listObjectsV2(({Bucket: myBucket})).promise();
  // // const files = fileStream.Contents.map(item => item.Key);
  // return fileStream.Contents;
  let fileTable = {
    TableName: 'files',
  }

  try {
    const { Items = [] } = await dynamoDB.scan(fileTable).promise();
    return { success: true, data: Items }

  } catch(error){
    return { success: false, data: error }
  }
}

export async function uploadFile(file) {

  const fileId = uniqid();

  //TODO: Add check for type
  try {

    s3.upload({ Bucket: myBucket, Key: fileId, Body: file.file.data }, (err, data) => {

    //Create entry in DynamDB
      const dynamoParams = {
        TableName: 'files',
        Item: {
          file_id: fileId,
          fileName: file.file.name,
          dateUploaded: new Date().toISOString()
        },
      };

      dynamoDB.put(dynamoParams, (dynamoErr, dynamoData) => {
        if (dynamoErr) {
          return { success: false, data: dynamoErr }
        }
      });
    });
    return { success: true, data: fileId }
  } catch(error) {
    return { success: false, data: error }
  }

}

export async function downloadFile(fileId) {
  try {
    const file = await s3.getObject({Bucket: myBucket, Key: fileId}).promise();
    return { success: true, data: file }
  } catch (error) {
    return { success: false, data: error }
  }
}



