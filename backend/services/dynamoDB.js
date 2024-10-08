const AWS = require('aws-sdk');

// Configure AWS SDK to use DynamoDB in the correct region
AWS.config.update({ region: 'ap-southeast-2' });
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Function to add a diary entry to DynamoDB
const addDiaryEntry = async (entryId, email, entryDate, content, imageUrl = null) => {
  const params = {
    TableName: 'DiaryEntries',
    Item: {
      entryId,
      email, // Use email as an attribute
      entryDate,
      content,
      imageUrl, // Store image URL if present
    },
  };

  console.log('Adding item to DynamoDB:', params.Item); // Log the item being added
  return dynamoDb.put(params).promise();
};

const getDiaryEntryByDateAndEmail = async (entryDate, email) => {
    const params = {
        TableName: 'DiaryEntries',
        IndexName: 'email-entryDate-index',  // Replace with your table name
        KeyConditionExpression: 'email = :email AND entryDate = :date',  // Modify based on your schema
        ExpressionAttributeValues: {
            ':email': email,
            ':date': entryDate
        }
    };
    console.log(entryDate,email);
    const result = await dynamoDb.query(params).promise();
    return result.Items[0];  // Return the first item (assuming one entry per date)
};



module.exports = { addDiaryEntry, getDiaryEntryByDateAndEmail };
