import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const dynamoDBClient = new DynamoDBClient();
const TABLE_NAME = process.env.TABLE_NAME || "Events";

export const handler = async (event) => {
    try {
        console.log("Received event:", JSON.stringify(event, null, 2));

        let inputEvent;
        try {
            inputEvent = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        } catch (parseError) {
            console.error("Error parsing event body:", parseError);
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Invalid JSON format in request body" })
            };
        }

        if (!inputEvent?.principalId || inputEvent?.content === undefined) {
            console.error("Validation failed: Missing required fields", inputEvent);
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Invalid input: principalId and content are required" })
            };
        }

        const eventId = uuidv4();
        const createdAt = new Date().toISOString();

        const eventItem = {
            id: eventId,
            principalId: Number(inputEvent.principalId),
            createdAt,
            body: inputEvent.content
        };

        console.log("Saving to DynamoDB:", JSON.stringify(eventItem, null, 2));

        const response = await dynamoDBClient.send(new PutCommand({
            TableName: TABLE_NAME,
            Item: eventItem,
        }));
        console.log("Saved successfully");

        console.log("DynamoDB Response:", response);

        const responseObject = {
            statusCode: 201,
            body: JSON.stringify({statusCode : 201, event : eventItem})
        };

        console.log("Final response:", JSON.stringify(responseObject, null, 2));
        return responseObject;

    } catch (error) {
        console.error("Error processing request:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error", error: error.message })
        };
    }
};