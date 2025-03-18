const axios = require("axios");
const { DynamoDBClient, GetItemCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient({ region: "eu-central-1" });
const TABLE_NAME = process.env.TARGET_TABLE || "Weather";

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const path = event?.rawPath || "/";
    const method = event?.requestContext?.http?.method || "GET";

    if (method === "GET" && path === "/weather") {
        try {
            const response = await axios.get(
                "https://api.open-meteo.com/v1/forecast?latitude=50.4375&longitude=30.5&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&current_weather=true"
            );

            const weatherData = response.data;
            const newId = uuidv4();

            const item = {
                id: { S: newId },
                forecast: { S: JSON.stringify(weatherData) }
            };

            await client.send(new PutItemCommand({ TableName: TABLE_NAME, Item: item }));

            return {
                statusCode: 200,
                body: JSON.stringify({ id: newId, forecast: weatherData }),
                headers: { "content-type": "application/json" },
                isBase64Encoded: false
            };
        } catch (error) {
            console.error("Error fetching weather data:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal Server Error" }),
                headers: { "content-type": "application/json" },
                isBase64Encoded: false
            };
        }
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify({
                statusCode: 400,
                message: `Bad request syntax or unsupported method. Request path: ${path}. HTTP method: ${method}`
            }),
            headers: { "content-type": "application/json" },
            isBase64Encoded: false
        };
    }
};
