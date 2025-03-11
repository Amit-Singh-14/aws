import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

// Initialize DynamoDB Client
const client = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || "Events";

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const auditPromises = event.Records.map(record => processRecord(record));

  try {
    await Promise.all(auditPromises);
    console.log("Successfully processed all records");
    return { statusCode: 200, body: "Success" };
  } catch (error) {
    console.error("Error processing records:", error);
    throw error;
  }
};

/**
 * Process individual DynamoDB Stream record
 * @param {Object} record - DynamoDB Stream record
 * @returns {Promise} - Promise from DynamoDB put operation
 */
async function processRecord(record) {
  const eventName = record.eventName;
  const dynamodbRecord = record.dynamodb;

  const modificationTime = new Date().toISOString();
  const itemKey = dynamodbRecord.Keys.key.S;

  // Create audit item with required fields
  const auditItem = {
    id: uuidv4(),
    itemKey: itemKey,
    modificationTime: modificationTime
  };

  // Process based on event type
  if (eventName === "INSERT") {
    const newImage = unmarshallImage(dynamodbRecord.NewImage);
    auditItem.newValue = { key: newImage.key, value: newImage.value };
  } else if (eventName === "MODIFY") {
    const oldImage = unmarshallImage(dynamodbRecord.OldImage);
    const newImage = unmarshallImage(dynamodbRecord.NewImage);

    auditItem.oldValue = oldImage.value;
    auditItem.newValue = newImage.value;
    auditItem.updatedAttribute = "value"; // Assuming only 'value' changes
  } else if (eventName === "REMOVE") {
    const oldImage = unmarshallImage(dynamodbRecord.OldImage);
    auditItem.oldValue = oldImage;
  }

  console.log("Saving audit item:", JSON.stringify(auditItem, null, 2));

  const params = new PutCommand({
    TableName: TABLE_NAME,
    Item: auditItem
  });
console.log("Attempting to write to table:", params.TableName);

  return await dynamoDB.send(params);
}

/**
 * Convert DynamoDB attribute values to JavaScript values
 * @param {Object} image - DynamoDB image with attribute values
 * @returns {Object} - Unmarshalled JavaScript object
 */
function unmarshallImage(image) {
  if (!image) return null;

  const result = {};

  for (const [key, value] of Object.entries(image)) {
    if (value.S !== undefined) {
      result[key] = value.S;
    } else if (value.N !== undefined) {
      result[key] = Number(value.N);
    } else if (value.BOOL !== undefined) {
      result[key] = value.BOOL;
    } else if (value.M !== undefined) {
      result[key] = unmarshallImage(value.M);
    } else if (value.L !== undefined) {
      result[key] = value.L.map(item => unmarshallImage(item));
    }
  }

  return result;
}
